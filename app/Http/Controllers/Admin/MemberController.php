<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class MemberController extends Controller
{
    // [Halaman] Manajemen Member (Admin)
    public function index()
    {
        return Inertia::render('Admin/MemberManagement');
    }

    // [API] Ambil daftar member dengan pencarian dan filter sederhana
    public function getMembers(Request $request)
    {
        // Gunakan eager loading 'with()' untuk efisiensi query
        $query = User::where('role', 'member')->with(['memberProfile.specialization']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                // Cari di tabel relasi
                ->orWhereHas('memberProfile', function ($profileQuery) use ($search) {
                    $profileQuery->where('phone', 'like', "%{$search}%");
                });
            });
        }

        // Filter berdasarkan Jenis Pelatihan
        if ($request->filled('training_type')) {
            $query->whereHas('memberProfile.specialization', function ($profileQuery) use ($request) {
                $profileQuery->where('name', $request->input('training_type'));
            });
        }

        // Filter berdasarkan Jenis Pertemuan
        if ($request->filled('meeting_type')) {
            $query->whereHas('memberProfile', function ($profileQuery) use ($request) {
                $profileQuery->where('delivery_mode', $request->input('meeting_type'));
            });
        }

        $members = $query->orderBy('created_at', 'desc')
                    ->paginate(6)
                    ->through(fn ($user) => [
                        'id' => $user->id_user,
                        'name' => $user->name,
                        'email' => $user->email,
                        // Ambil data dari relasi memberProfile
                        'phone' => $user->memberProfile->phone ?? null,
                        'meetingType' => $user->memberProfile->delivery_mode ?? 'Daring',
                        'remainingSessions' => $user->memberProfile->remaining_sessions ?? 0,
                        'trainingType' => $user->memberProfile->specialization->name ?? null,
                    ]);

                return response()->json($members);
            }

    // [API] Tambah member baru (sederhana)
    public function store(Request $request)
    {
        // Debug: Log incoming request data
        \Log::info('Store Member Request:', $request->all());
        
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:20',
            'sessions' => 'required|integer|min:0',
            'meetingType' => [
                'required',
                Rule::in(['Daring', 'Luring']),
            ],
            'trainingType' => ['required', Rule::in([
                'Administrasi Perkantoran',
                'Graphic Design',
                'Web Programming Basic',
                'UI/UX Design'])
            ],
        ]);
        
        // Debug: Log validated data
        \Log::info('Validated Data:', $validatedData);

        $member = DB::transaction(function () use ($validatedData) {
            // 1. Buat data di tabel 'users'
            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'role' => 'member',
            ]);

            // 2. Cari specialization berdasarkan nama
            $specialization = \App\Models\Specialization::where('name', $validatedData['trainingType'])->first();
            
            // 3. Buat / update data di tabel 'member_profiles'
            $profileData = [
                'phone' => $validatedData['phone'],
                'delivery_mode' => $validatedData['meetingType'],
                'remaining_sessions' => $validatedData['sessions'],
                'Id_specializations' => $specialization ? $specialization->Id_specializations : null,
            ];
            
            // Debug: Log profile data being created
            \Log::info('Creating member profile with data:', $profileData);
            
            // Create profile if not exists, otherwise update to avoid unique user_id violation
            $user->memberProfile()->updateOrCreate(
                ['user_id' => $user->id_user],
                $profileData
            );

            return $user->load('memberProfile.specialization'); // Muat relasi untuk response
        });

        return response()->json([
            'message' => 'Member berhasil ditambahkan!', 
            'member' => [
                'id' => $member->id_user,
                'name' => $member->name,
                'email' => $member->email,
                'phone' => $member->memberProfile->phone ?? null,
                'meetingType' => $member->memberProfile->delivery_mode ?? 'Daring',
                'remainingSessions' => $member->memberProfile->remaining_sessions ?? 0,
                'trainingType' => $member->memberProfile->specialization->name ?? null,
            ]
        ], 201);
    }

    // [API] Detail singkat member
    public function show($id)
    {
        $member = User::where('role', 'member')->where('id_user', $id)->with('memberProfile.specialization')->firstOrFail();
        
        return response()->json([
            'id' => $member->id_user,
            'name' => $member->name,
            'email' => $member->email,
            'phone' => $member->memberProfile->phone ?? null,
            'meetingType' => $member->memberProfile->delivery_mode ?? 'Daring',
            'remainingSessions' => $member->memberProfile->remaining_sessions ?? 0,
            'trainingType' => $member->memberProfile->specialization->name ?? null,
            'created_at' => $member->created_at,
            'updated_at' => $member->updated_at,
        ]);
    }

    // [API] Update data member (sederhana)
    public function update(Request $request, $id)
    {
        $member = User::where('role', 'member')->where('id_user', $id)->firstOrFail();
        
        // Debug: Log incoming request data
        \Log::info('Update Member Request:', $request->all());

        // Validasi input utama; trainingType wajib agar tidak kembali ke default
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'nullable|string|max:20',
            'sessions' => 'required|integer|min:0',
            'meetingType' => ['required', Rule::in(['Daring', 'Luring'])],
        ]);

        DB::transaction(function () use ($request, $member) {
            // 1. Update data di tabel 'users'
            $member->update([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
            ]);
            // (Opsional: update password jika diisi)

            // 2. Cari specialization berdasarkan nama
            $specialization = \App\Models\Specialization::where('name', $request->input('trainingType'))->first();
            
            // 3. Update atau buat data di tabel 'member_profiles'
            $profileData = [
                'phone' => $request->input('phone'),
                'delivery_mode' => $request->input('meetingType'),
                'remaining_sessions' => $request->input('sessions'),
                'Id_specializations' => $specialization ? $specialization->Id_specializations : null,
            ];
            
            // Debug: Log profile data being updated
            \Log::info('Updating member profile with data:', $profileData);
            
            $member->memberProfile()->updateOrCreate(
                ['user_id' => $member->id_user],
                $profileData
            );
        });
        
        $member->load('memberProfile.specialization');
        return response()->json([
            'message' => 'Member berhasil diperbarui!',
            'member' => [
                'id' => $member->id_user,
                'name' => $member->name,
                'email' => $member->email,
                'phone' => $member->memberProfile->phone ?? null,
                'meetingType' => $member->memberProfile->delivery_mode ?? 'Daring',
                'remainingSessions' => $member->memberProfile->remaining_sessions ?? 0,
                'trainingType' => $member->memberProfile->specialization->name ?? null,
            ],
        ]);
    }
    
    // [API] Hapus member
    public function destroy($id)
    {
        try {
            $member = User::where('role', 'member')->where('id_user', $id)->firstOrFail();
            $memberName = $member->name;
            
            // Log the activity before deletion
            auth()->user()->logActivity('delete', "Deleted member: " . $memberName, $member);
            
            // Use database transaction to ensure all related data is deleted safely
            DB::transaction(function () use ($member) {
                // Delete related data using direct queries to avoid relationship issues
                
                // Delete member profile
                DB::table('member_profiles')->where('user_id', $member->id_user)->delete();
                
                // Delete meetings where this user is a member
                DB::table('meetings')->where('member_id', $member->id_user)->delete();
                
                // Delete meetings where this user is a mentor (if any)
                DB::table('meetings')->where('mentor_id', $member->id_user)->delete();
                
                // Delete ratings where this user is a member
                DB::table('ratings')->where('member_id', $member->id_user)->delete();
                
                // Delete ratings where this user is a mentor (if any)
                DB::table('ratings')->where('mentor_id', $member->id_user)->delete();
                
                // Delete schedules where this user is a member
                DB::table('schedules')->where('member_id', $member->id_user)->delete();
                
                // Delete schedules where this user is a mentor (if any)
                DB::table('schedules')->where('mentor_id', $member->id_user)->delete();
                
                // Delete meeting history where this user is a member
                DB::table('meeting_history')->where('member_id', $member->id_user)->delete();
                
                // Delete meeting history where this user is a mentor (if any)
                DB::table('meeting_history')->where('mentor_id', $member->id_user)->delete();
                
                // Finally, delete the user itself
                $member->delete();
            });

            return response()->json([
                'message' => "Member '{$memberName}' dan semua data terkait berhasil dihapus!"
            ]);
            
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Error deleting member: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Gagal menghapus member. Silakan coba lagi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get member statistics
     *
     * @return \Illuminate\Http\JsonResponse
     */
    // [API] Statistik member sederhana
    public function getStats()
    {
        $totalMembers = User::where('role', 'member')->count();
        $daringMembers = User::where('role', 'member')
            ->whereHas('memberProfile', function($query) {
                $query->where('delivery_mode', 'Daring');
            })
            ->count();
        $luringMembers = User::where('role', 'member')
            ->whereHas('memberProfile', function($query) {
                $query->where('delivery_mode', 'Luring');
            })
            ->count();

        return response()->json([
            'total' => $totalMembers,
            'daring' => $daringMembers,
            'luring' => $luringMembers,
        ]);
    }
}