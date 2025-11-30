<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\MemberProfile; // Pastikan ini di-import jika belum
use App\Models\MentorProfile;
use App\Models\Specialization;
use Illuminate\Http\Request;

use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class MentorController extends Controller
{
    // [Halaman] Manajemen Mentor (Admin)
    public function index()
    {
        // Arahkan ke halaman Inertia baru untuk Mentor
        $specializations = Specialization::all('Id_specializations','name');
        $availableDays = \App\Models\AvailableDay::orderBy('sort_order')->get(['Id_day', 'name', 'sort_order']);
        
        // Debug logging
        \Log::info('MentorController index - Specializations count: ' . $specializations->count());
        \Log::info('MentorController index - Available Days count: ' . $availableDays->count());
        
        return Inertia::render('Admin/MentorManagement',[
            'specializations' => $specializations,
            'availableDays' => $availableDays->map(function($day) {
                return [
                    'Id_day' => $day->Id_day,
                    'name' => $day->name
                ];
            })
        ]);
    }

    // [API] Ambil daftar mentor dengan filter sederhana
    public function getMentors(Request $request)
    {
        $query = User::where('role', 'mentor')
        ->with(['mentorProfile'])
        ->withCount('ratings') 
        ->withAvg('ratings', 'rating')
        ->withCount(['meetings as completed_meetings_count' => function ($query) {
            $query->where('status', 'completed');
        }]);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhereHas('mentorProfile', function ($profileQuery) use ($search) {
                    $profileQuery->where('phone', 'like', "%{$search}%");
                });
            });
        }

        // ==========================================================
    // TAMBAHKAN BLOK FILTER DI SINI
    // ==========================================================
    // Filter berdasarkan ID Spesialisasi (Id_specializations)
    if ($request->filled('specialization_id')) {
        $query->whereHas('mentorProfile', function ($specQuery) use ($request) {
            $specQuery->whereJsonContains('specialization_ids', $request->input('specialization_id'));
        });
    }

    // Filter berdasarkan Hari Tersedia (Id_day)
    if ($request->filled('day_id')) {
        $query->whereHas('mentorProfile', function ($dayQuery) use ($request) {
            $dayQuery->whereJsonContains('available_day_ids', $request->input('day_id'));
        });
    }
    // ==========================================================


        $mentors = $query->orderBy('created_at', 'desc')
            ->paginate(6)
            ->through(fn ($user) => [
                'id' => $user->id_user,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->mentorProfile ? $user->mentorProfile->phone : null,
                'specializations' => $user->mentorProfile ? $user->mentorProfile->getSpecializationNames() : [],
                'available_days' => $user->mentorProfile ? $user->mentorProfile->getAvailableDayNames() : [],
                 // TAMBAHKAN 2 BARIS INI UNTUK MENGIRIM DATA RATING
                'average_rating' => round($user->ratings_avg_rating ?? 0, 1),
                'ratings_count' => $user->ratings_count,
                // TAMBAHKAN JUMLAH PERTEMUAN COMPLETED
                'completed_meetings_count' => $user->completed_meetings_count,
            ]);

        return response()->json($mentors);
    }

    // [API] Tambah mentor baru (sederhana)
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:20',
            'specialization_ids' => 'required|array',
            'specialization_ids.*' => 'string|exists:specializations,Id_specializations',
            'day_ids' => 'required|array',
            'day_ids.*' => 'string|exists:available_days,Id_day',
        ]);

        DB::transaction(function () use ($validatedData) {
            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'role' => 'mentor', // Role diubah menjadi 'mentor'
                'status' => 'active',
            ]);

            // Create profile dengan JSON data
            $profile = $user->mentorProfile()->updateOrCreate(
                ['user_id' => $user->id_user],
                [
                    'phone' => $validatedData['phone'] ?? null,
                    'specialization_ids' => $validatedData['specialization_ids'],
                    'available_day_ids' => $validatedData['day_ids'],
                ]
            );
        });

        return response()->json(['message' => 'Mentor berhasil ditambahkan!'], 201);
    }

    // [API] Detail singkat mentor
    public function show($id)
    {
        $mentor = User::where('role', 'mentor')
        ->where('id_user', $id)
        ->with(['mentorProfile'])
        ->firstOrFail();
        
        $specializationNames = $mentor->mentorProfile ? $mentor->mentorProfile->getSpecializationNames() : [];
        $dayNames = $mentor->mentorProfile ? $mentor->mentorProfile->getAvailableDayNames() : [];
        $specializationIds = $mentor->mentorProfile ? $mentor->mentorProfile->specialization_ids ?? [] : [];
        $dayIds = $mentor->mentorProfile ? $mentor->mentorProfile->available_day_ids ?? [] : [];

        return response()->json([
            'id' => $mentor->id_user,
            'name' => $mentor->name,
            'email' => $mentor->email,
            'phone' => $mentor->mentorProfile->phone ?? null,
            'specializations' => $specializationNames,
            'available_days' => $dayNames,
            'specialization_ids' => $specializationIds,
            'day_ids' => $dayIds,
            'created_at' => $mentor->created_at,
            'updated_at' => $mentor->updated_at,
        ]);
    }

    // [API] Update data mentor (sederhana)
    public function update(Request $request, $id)
    {
        $mentor = User::where('role', 'mentor')
        ->where('id_user', $id)
        ->firstOrFail();

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($mentor->id_user, 'id_user')],
            'password' => 'nullable|string|min:6',
            'phone' => 'nullable|string|max:20',
            'specialization_ids' => 'required|array',
            'specialization_ids.*' => 'string|exists:specializations,Id_specializations',
            'day_ids' => 'required|array',
            'day_ids.*' => 'string|exists:available_days,Id_day',
        ]);

        DB::transaction(function () use ($validatedData, $mentor) {
            $mentor->update([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
            ]);

            if (!empty($validatedData['password'])) {
                $mentor->update(['password' => Hash::make($validatedData['password'])]);
            }

            // Update profile dengan JSON data
            $profile = $mentor->mentorProfile()->updateOrCreate(
                ['user_id' => $mentor->id_user],
                [
                    'phone' => $validatedData['phone'] ?? null,
                    'specialization_ids' => $validatedData['specialization_ids'],
                    'available_day_ids' => $validatedData['day_ids'],
                ]
            );
        });

        return response()->json(['message' => 'Mentor berhasil diperbarui!']);
    }

    // [API] Hapus mentor
    public function destroy($id)
    {
        try {
            $mentor = User::where('role', 'mentor')->where('id_user', $id)->firstOrFail();
            $mentorName = $mentor->name;
            
            // Log the activity before deletion
            auth()->user()->logActivity('delete', "Deleted mentor: " . $mentorName, $mentor);
            
            // Use database transaction to ensure all related data is deleted safely
            DB::transaction(function () use ($mentor) {
                // Delete related data using direct queries to avoid relationship issues
                
                // Delete mentor profile
                DB::table('mentor_profiles')->where('user_id', $mentor->id_user)->delete();
                
                // Delete meetings where this user is a mentor
                DB::table('meetings')->where('mentor_id', $mentor->id_user)->delete();
                
                // Delete meetings where this user is a member (if any)
                DB::table('meetings')->where('member_id', $mentor->id_user)->delete();
                
                // Delete ratings where this user is a mentor
                DB::table('ratings')->where('mentor_id', $mentor->id_user)->delete();
                
                // Delete ratings where this user is a member (if any)
                DB::table('ratings')->where('member_id', $mentor->id_user)->delete();
                
                // Delete schedules where this user is a mentor
                DB::table('schedules')->where('mentor_id', $mentor->id_user)->delete();
                
                // Delete schedules where this user is a member (if any)
                DB::table('schedules')->where('member_id', $mentor->id_user)->delete();
                
                // Delete meeting history where this user is a mentor
                DB::table('meeting_history')->where('mentor_id', $mentor->id_user)->delete();
                
                // Delete meeting history where this user is a member (if any)
                DB::table('meeting_history')->where('member_id', $mentor->id_user)->delete();
                
                // Finally, delete the user itself
                $mentor->delete();
            });

            return response()->json([
                'message' => "Mentor '{$mentorName}' dan semua data terkait berhasil dihapus!"
            ]);
            
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Error deleting mentor: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Gagal menghapus mentor. Silakan coba lagi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}