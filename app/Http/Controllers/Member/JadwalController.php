<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Schedule;
use App\Models\MemberProfile;
use App\Models\Rating;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class JadwalController extends Controller
{
    /**
     * Validasi jam operasional dan hari kerja.
     * - Hanya Senin s/d Sabtu.
     * - Sabtu: 08:30 - 10:00.
     * - Senin-Jumat: 08:30 - 15:00.
     */
    protected function validateOperationalTime(Carbon $date, Carbon $time)
    {
        $dayOfWeek = $date->dayOfWeek; // 0 = Minggu, 6 = Sabtu

        // Tidak boleh hari Minggu
        if ($dayOfWeek === Carbon::SUNDAY) {
            abort(422, 'Tanggal tidak boleh hari Minggu. Pilih hari Senin sampai Sabtu.');
        }

        // Batas waktu dasar
        $startTime = Carbon::createFromTime(8, 30, 0);

        if ($dayOfWeek === Carbon::SATURDAY) {
            $endTime = Carbon::createFromTime(10, 0, 0);
        } else {
            // Senin - Jumat
            $endTime = Carbon::createFromTime(15, 0, 0);
        }

        if ($time->lt($startTime) || $time->gt($endTime)) {
            $message = $dayOfWeek === Carbon::SATURDAY
                ? 'Hari Sabtu hanya boleh mengajukan jadwal antara pukul 08.30 - 10.00.'
                : 'Hari Senin sampai Jumat hanya boleh mengajukan jadwal antara pukul 08.30 - 15.00.';

            abort(422, $message);
        }
    }

    public function index(Request $request)
    {
        $memberId = $request->user()->id_user;
        
        // Get member profile for training type and meeting type with specialization
        $memberProfile = MemberProfile::where('user_id', $memberId)
            ->with('specialization')
            ->first();
        
        // Get all schedules for this member with proper relationships
        $schedules = Schedule::where('member_id', $memberId)
            ->with([
                'mentor' => function($query) {
                    $query->select('id_user', 'name', 'email');
                },
                'member' => function($query) {
                    $query->select('id_user', 'name', 'email');
                },
                'specialization' => function($query) {
                    $query->select('Id_specializations', 'name');
                }
            ])
            ->orderBy('proposed_date', 'desc')
            ->orderBy('proposed_time', 'asc')
            ->get()
            ->map(function($schedule) use ($memberProfile) {
                return [
                    'id' => $schedule->Id_schedles,
                    'mentor' => $schedule->mentor ? [
                        'id' => $schedule->mentor->id_user,
                        'name' => $schedule->mentor->name,
                        'email' => $schedule->mentor->email,
                    ] : null,
                    'proposed_date' => $schedule->proposed_date,
                    'proposed_time' => $schedule->proposed_time,
                    'status' => $schedule->status,
                    'training_type' => $schedule->specialization ? $schedule->specialization->name : ($memberProfile && $memberProfile->specialization ? $memberProfile->specialization->name : 'Administrasi Perkantoran'),
                    'rejection_reason' => $schedule->rejection_reason,
                    'materi_modul' => $schedule->materi_modul,
                    'materi_topik' => $schedule->materi_topik,
                    'materi_sub_topik' => $schedule->materi_sub_topik,
                ];
            });

        // Get mentors that match member's specialization (via JSON specialization_ids)
        $mentors = User::where('role', 'mentor')
            ->whereHas('mentorProfile', function ($query) use ($memberProfile) {
                if ($memberProfile && $memberProfile->Id_specializations) {
                    // Check if mentor's specialization_ids JSON array contains member's specialization
                    $query->whereJsonContains('specialization_ids', $memberProfile->Id_specializations);
                }
            })
            ->with(['mentorProfile' => function ($query) {
                $query->with('specialization');
            }])
            ->get()
            ->map(function ($mentor) {
                return [
                    'id' => $mentor->id_user,
                    'name' => $mentor->name,
                    'email' => $mentor->email,
                    'specialization' => $mentor->mentorProfile
                        ? ($mentor->mentorProfile->specialization
                            ? $mentor->mentorProfile->specialization->name
                            : null)
                        : null,
                ];
            });

        // Format member profile for frontend
        $formattedMemberProfile = null;
        if ($memberProfile) {
            $formattedMemberProfile = [
                'training_type' => $memberProfile->specialization ? $memberProfile->specialization->name : 'Administrasi Perkantoran',
                'meeting_type' => $memberProfile->delivery_mode ?? 'Luring',
                'remaining_sessions' => $memberProfile->remaining_sessions ?? 0,
            ];
        }

        return Inertia::render('Member/JadwalMember', [
            'schedules' => $schedules,
            'mentors' => $mentors,
            'memberProfile' => $formattedMemberProfile,
            'auth' => [
                'user' => $request->user()
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'mentor_id' => 'required|exists:users,id_user',
            'proposed_date' => 'required|date|after:today',
            'proposed_time' => 'required|date_format:H:i',
        ]);

        $memberId = $request->user()->id_user;

        // Validasi jam operasional & hari kerja
        $proposedDate = Carbon::parse($request->proposed_date);
        $proposedTime = Carbon::createFromFormat('H:i', $request->proposed_time);
        $this->validateOperationalTime($proposedDate, $proposedTime);
        
        // Get member profile for training type
        $memberProfile = MemberProfile::where('user_id', $memberId)->with('specialization')->first();
        
        if (!$memberProfile) {
            return back()->withErrors(['error' => 'Member profile tidak ditemukan']);
        }

        // Check if mentor is available for the proposed date
        $existingSchedule = Schedule::where('mentor_id', $request->mentor_id)
            ->where('proposed_date', $request->proposed_date)
            ->whereIn('status', ['pending_approval', 'approved', 'confirmed'])
            ->first();

        if ($existingSchedule) {
            return back()->withErrors(['error' => 'Mentor sudah memiliki jadwal pada tanggal tersebut']);
        }

        Schedule::create([
            'member_id' => $memberId,
            'mentor_id' => $request->mentor_id,
            'Id_specializations' => $memberProfile->Id_specializations,
            'proposed_date' => $request->proposed_date,
            'proposed_time' => $request->proposed_time,
            'status' => 'pending_approval'
        ]);

        return redirect()->route('member.jadwal')->with('success', 'Jadwal berhasil ditambahkan');
    }

    public function destroy($id, Request $request)
    {
        $schedule = Schedule::where('Id_schedles', $id)
            ->where('member_id', $request->user()->id_user)
            ->first();

        if (!$schedule) {
            return back()->withErrors(['error' => 'Jadwal tidak ditemukan']);
        }

        $schedule->delete();

        return redirect()->route('member.jadwal')->with('success', 'Jadwal berhasil dihapus');
    }

    public function markCompleted($id, Request $request)
    {
        $schedule = Schedule::where('Id_schedles', $id)
            ->where('member_id', $request->user()->id_user)
            ->first();

        if (!$schedule) {
            return back()->withErrors(['error' => 'Jadwal tidak ditemukan']);
        }

        // Only allow marking as completed if status is confirmed
        if ($schedule->status !== 'confirmed') {
            return back()->withErrors(['error' => 'Jadwal harus dalam status dikonfirmasi untuk ditandai selesai']);
        }

        $schedule->update(['status' => 'completed']);

        return redirect()->route('member.jadwal')->with('success', 'Jadwal berhasil ditandai selesai dan dipindahkan ke riwayat');
    }

    public function riwayat(Request $request)
    {
        $memberId = $request->user()->id_user;
        
        // Get completed and rejected schedules with all relationships
        $schedules = Schedule::where('member_id', $memberId)
            ->whereIn('status', ['completed', 'rejected'])
            ->with([
                'mentor' => function($query) {
                    $query->select('id_user', 'name', 'email');
                },
                'member' => function($query) {
                    $query->select('id_user', 'name', 'email');
                },
                'specialization' => function($query) {
                    $query->select('Id_specializations', 'name');
                },
                'materi' => function($query) {
                    $query->select('id_materi', 'modul', 'topik', 'sub_topik');
                }
            ])
            ->orderBy('proposed_date', 'desc')
            ->orderBy('proposed_time', 'desc')
            ->get()
            ->map(function($schedule) {
                return [
                    'id' => $schedule->Id_schedles,
                    'mentor' => $schedule->mentor ? [
                        'id' => $schedule->mentor->id_user,
                        'name' => $schedule->mentor->name,
                        'email' => $schedule->mentor->email,
                    ] : null,
                    'mentor_id' => $schedule->mentor_id,
                    'proposed_date' => $schedule->proposed_date,
                    'proposed_time' => $schedule->proposed_time,
                    'status' => $schedule->status,
                    'training_type' => $schedule->specialization ? $schedule->specialization->name : 'Administrasi Perkantoran',
                    'rejection_reason' => $schedule->rejection_reason,
                    'materi_modul' => $schedule->materi_modul ?? ($schedule->materi ? $schedule->materi->modul : null),
                    'materi_topik' => $schedule->materi_topik ?? ($schedule->materi ? $schedule->materi->topik : null),
                    'materi_sub_topik' => $schedule->materi_sub_topik ?? ($schedule->materi ? $schedule->materi->sub_topik : null),
                    'dokumentasi' => $schedule->dokumentasi,
                    'laporan_dikirim_at' => $schedule->laporan_dikirim_at,
                    'created_at' => $schedule->created_at,
                    'updated_at' => $schedule->updated_at,
                ];
            });

        // Get existing ratings for this member
        $ratings = Rating::where('member_id', $memberId)
            ->with('mentor:id_user,name')
            ->get()
            ->keyBy('mentor_id')
            ->map(function($rating) {
                return [
                    'rating' => $rating->rating,
                    'review' => $rating->review,
                ];
            });

        return Inertia::render('Member/RiwayatMember', [
            'schedules' => $schedules,
            'ratings' => $ratings,
            'auth' => [
                'user' => $request->user()
            ]
        ]);
    }

    public function storeRating(Request $request)
    {
        $request->validate([
            'mentor_id' => 'required|exists:users,id_user',
            'rating' => 'required|numeric|min:1|max:5',
            'review' => 'nullable|string|max:500'
        ]);

        $memberId = $request->user()->id_user;

        // Check if rating already exists
        $existingRating = Rating::where('member_id', $memberId)
            ->where('mentor_id', $request->mentor_id)
            ->first();

        if ($existingRating) {
            return back()->withErrors(['error' => 'Anda sudah memberikan rating untuk mentor ini']);
        }

        Rating::create([
            'member_id' => $memberId,
            'mentor_id' => $request->mentor_id,
            'rating' => $request->rating,
            'review' => $request->review
        ]);

        return redirect()->route('member.riwayat')->with('success', 'Rating berhasil disimpan');
    }

    public function getAvailableMentors(Request $request)
    {
        $request->validate([
            'proposed_date' => 'required|date|after:today',
            'proposed_time' => 'required|date_format:H:i',
        ]);

        $proposedDate = $request->proposed_date;
        $proposedTime = $request->proposed_time;

        // Validasi jam operasional & hari kerja
        $this->validateOperationalTime(
            Carbon::parse($proposedDate),
            Carbon::createFromFormat('H:i', $proposedTime)
        );
        
        // Get member profile to get training type
        $memberId = $request->user()->id_user;
        $memberProfile = MemberProfile::where('user_id', $memberId)->first();
        
        if (!$memberProfile) {
            return response()->json([]);
        }
        
        // Convert English day to Indonesian day
        $dayMapping = [
            'Monday' => 'Senin',
            'Tuesday' => 'Selasa', 
            'Wednesday' => 'Rabu',
            'Thursday' => 'Kamis',
            'Friday' => 'Jumat',
            'Saturday' => 'Sabtu',
            'Sunday' => 'Minggu'
        ];
        
        $englishDay = date('l', strtotime($proposedDate));
        $indonesianDay = $dayMapping[$englishDay];
        
        // Debug logging
        \Log::info('Member Jadwal - Date: ' . $proposedDate . ', English Day: ' . $englishDay . ', Indonesian Day: ' . $indonesianDay);
        \Log::info('Member Training Type: ' . $memberProfile->Id_specializations);
        
        // Get mentors with specialization matching member's training type (via JSON specialization_ids)
        $mentors = User::where('role', 'mentor')
            ->whereHas('mentorProfile', function ($query) use ($memberProfile) {
                if ($memberProfile && $memberProfile->Id_specializations) {
                    // Check if mentor's specialization_ids JSON array contains member's specialization
                    $query->whereJsonContains('specialization_ids', $memberProfile->Id_specializations);
                }
            })
            ->with(['mentorProfile' => function ($query) {
                $query->with('specialization');
            }])
            ->get()
            ->filter(function ($mentor) use ($proposedDate, $proposedTime) {
                // Check if mentor already has a schedule at this date/time
                $existingSchedule = Schedule::where('mentor_id', $mentor->id_user)
                    ->where('proposed_date', $proposedDate)
                    ->where('proposed_time', $proposedTime)
                    ->whereIn('status', ['pending_approval', 'approved', 'confirmed'])
                    ->exists();
                
                if ($existingSchedule) {
                    \Log::info('Mentor ' . $mentor->name . ' - Already has schedule at ' . $proposedDate . ' ' . $proposedTime);
                    return false;
                }
                
                \Log::info('Mentor ' . $mentor->name . ' - Available!');
                return true;
            })
            ->map(function ($mentor) {
                return [
                    'id' => $mentor->id_user,
                    'name' => $mentor->name,
                    'email' => $mentor->email,
                    'specialization' => optional($mentor->mentorProfile->specialization)->name
                ];
            })
            ->values();

        return response()->json($mentors);
    }
}
