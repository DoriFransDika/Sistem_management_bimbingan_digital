<?php
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\MemberController;
use App\Http\Controllers\Admin\MentorController;
use App\Http\Controllers\Admin\VerificationController;
use App\Http\Controllers\Member\MemberDashboardController;
use App\Http\Controllers\Member\JadwalController; 
use App\Http\Controllers\Admin\RiwayatPertemuanController;
use App\Http\Controllers\Mentor\MentorDashboardController;
use App\Http\Controllers\Mentor\PermintaanMasukController;
use App\Http\Controllers\Mentor\RatingController as MentorRatingController;
use App\Http\Controllers\Mentor\NotificationController as MentorNotificationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Inertia\Inertia;

// Welcome route
Route::get('/', function () {
    return Inertia::render('Dashboard/WelcomeDashboard', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// =================================================================
// SEMUA ROUTE ADMIN DIJADIKAN SATU GRUP
// =================================================================
Route::middleware(['auth', 'verified', 'role:admin'])
->prefix('admin')->name('admin.')
->group(function () {
    
    // Dashboard
    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/real-time-data', [DashboardController::class, 'getRealTimeData'])->name('realtime.data');

    // Member Management
    Route::get('members', [MemberController::class, 'index'])->name('members.index');
    Route::get('members/data', [MemberController::class, 'getMembers'])->name('members.data');
    Route::get('members/stats', [MemberController::class, 'getStats'])->name('members.stats');
    Route::post('members', [MemberController::class, 'store'])->name('members.store');
    Route::get('members/{id}', [MemberController::class, 'show'])->name('members.show');
    Route::put('members/{id}', [MemberController::class, 'update'])->name('members.update');
    Route::delete('members/{id}', [MemberController::class, 'destroy'])->name('members.destroy');

    // Mentor Management
    Route::get('mentors', [MentorController::class, 'index'])->name('mentors.index');
    Route::get('mentors/data', [MentorController::class, 'getMentors'])->name('mentors.data');
    Route::post('mentors', [MentorController::class, 'store'])->name('mentors.store');
    Route::get('mentors/{id}', [MentorController::class, 'show'])->name('mentors.show');
    Route::put('mentors/{id}', [MentorController::class, 'update'])->name('mentors.update');
    Route::delete('mentors/{id}', [MentorController::class, 'destroy'])->name('mentors.destroy');

    // Verification Management (DIPINDAHKAN KE SINI)
    Route::get('verification', [VerificationController::class, 'index'])->name('verification');
    Route::get('verifikasi-penolakan', [VerificationController::class, 'index'])->name('verification.index');
    Route::get('verifikasi/data', [VerificationController::class, 'getRejections'])->name('verification.data');
    Route::post('verification/approve/{scheduleId}', [VerificationController::class, 'approveRejection'])->name('verification.approve');
    Route::post('verification/reject/{scheduleId}', [VerificationController::class, 'rejectRejection'])->name('verification.reject');

    // Schedule Completion Management
    Route::post('schedules/{scheduleId}/complete', [App\Http\Controllers\Admin\ScheduleCompletionController::class, 'markCompleted'])->name('schedules.complete');
    Route::get('materi/available', [App\Http\Controllers\Admin\ScheduleCompletionController::class, 'getAvailableMateri'])->name('materi.available');
    Route::get('schedules/validate-completed', [App\Http\Controllers\Admin\ScheduleCompletionController::class, 'validateCompletedSchedules'])->name('schedules.validate-completed');
    Route::post('schedules/fix-completed', [App\Http\Controllers\Admin\ScheduleCompletionController::class, 'fixCompletedSchedules'])->name('schedules.fix-completed');

    // Notification Management
    Route::get('notifications', [App\Http\Controllers\Admin\NotificationController::class, 'index'])->name('notifications.index');
    Route::get('notifications/data', [App\Http\Controllers\Admin\NotificationController::class, 'getNotifications'])->name('notifications.data');
    Route::put('notifications/{id}/read', [App\Http\Controllers\Admin\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::put('notifications/read-all', [App\Http\Controllers\Admin\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::get('notifications/stats', [App\Http\Controllers\Admin\NotificationController::class, 'getStats'])->name('notifications.stats');
    Route::post('notifications', [App\Http\Controllers\Admin\NotificationController::class, 'create'])->name('notifications.create');

    // Riwayat Pertemuan
    Route::get('riwayat', [RiwayatPertemuanController::class, 'index'])->name('riwayat.index');
    Route::get('riwayat/data', [RiwayatPertemuanController::class, 'getData'])->name('riwayat.data');

});
// =================================================================

// Member Dashboard Routes
Route::middleware(['auth', 'verified', 'role:member'])->prefix('member')->name('member.')->group(function () {
    Route::get('/dashboard', [MemberDashboardController::class, 'index'])->name('dashboard');
    
    // Jadwal Routes
    Route::get('/jadwal', [JadwalController::class, 'index'])->name('jadwal');
    Route::post('/jadwal', [JadwalController::class, 'store'])->name('jadwal.store');
    Route::delete('/jadwal/{id}', [JadwalController::class, 'destroy'])->name('jadwal.destroy');
    Route::post('/jadwal/{id}/complete', [JadwalController::class, 'markCompleted'])->name('jadwal.complete');
    
    // Riwayat Routes
    Route::get('/riwayat', [JadwalController::class, 'riwayat'])->name('riwayat');
    Route::post('/riwayat/rating', [JadwalController::class, 'storeRating'])->name('riwayat.rating');
    
    // Available mentors route
    Route::get('/jadwal/available-mentors', [JadwalController::class, 'getAvailableMentors'])->name('jadwal.available-mentors');
    
    // Notification Routes
    Route::get('/notifications', [App\Http\Controllers\Member\NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/notifications/data', [App\Http\Controllers\Member\NotificationController::class, 'getNotifications'])->name('notifications.data');
    Route::put('/notifications/{id}/read', [App\Http\Controllers\Member\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::put('/notifications/read-all', [App\Http\Controllers\Member\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::get('/notifications/stats', [App\Http\Controllers\Member\NotificationController::class, 'getStats'])->name('notifications.stats');
});

// Mentor routes
Route::middleware(['auth', 'verified', 'role:mentor'])->prefix('mentor')->name('mentor.')->group(function () {
    Route::get('/dashboard', [MentorDashboardController::class, 'index'])->name('dashboard');
    
    // Permintaan Masuk Routes
    Route::get('/permintaan-masuk', [PermintaanMasukController::class, 'index'])->name('permintaan-masuk');
    Route::post('/permintaan-masuk/{id}/accept', [PermintaanMasukController::class, 'accept'])->name('permintaan-masuk.accept');
    Route::post('/permintaan-masuk/{id}/reject', [PermintaanMasukController::class, 'reject'])->name('permintaan-masuk.reject');
    Route::post('/permintaan-masuk/{id}/complete', [PermintaanMasukController::class, 'markCompleted'])->name('permintaan-masuk.complete');
    
    // Jadwal Terkonfirmasi Routes
    Route::get('/jadwal-terkonfirmasi', [App\Http\Controllers\Mentor\JadwalTerkonfirmasiController::class, 'index'])->name('jadwal-terkonfirmasi');
    Route::post('/jadwal-terkonfirmasi/{id}/complete', [App\Http\Controllers\Mentor\JadwalTerkonfirmasiController::class, 'markCompleted'])->name('jadwal-terkonfirmasi.complete');
    
    // Laporan Routes
    Route::get('/laporan', [App\Http\Controllers\Mentor\LaporanController::class, 'index'])->name('laporan');
    Route::post('/laporan', [App\Http\Controllers\Mentor\LaporanController::class, 'store'])->name('laporan.store');
    Route::get('/laporan/topik', [App\Http\Controllers\Mentor\LaporanController::class, 'getTopikByModul'])->name('laporan.topik');
    Route::get('/laporan/sub-topik', [App\Http\Controllers\Mentor\LaporanController::class, 'getSubTopikByTopik'])->name('laporan.sub-topik');

    // Rating Mentor
    Route::get('/rating', [MentorRatingController::class, 'index'])->name('rating.index');

    // Notification Routes (Mentor)
    Route::get('/notifications', [MentorNotificationController::class, 'index'])->name('notifications.index');
    Route::get('/notifications/data', [MentorNotificationController::class, 'getNotifications'])->name('notifications.data');
    Route::put('/notifications/{id}/read', [MentorNotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::put('/notifications/read-all', [MentorNotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::get('/notifications/stats', [MentorNotificationController::class, 'getStats'])->name('notifications.stats');
});


// Profile routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';