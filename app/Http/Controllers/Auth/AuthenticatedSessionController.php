<?php
// app/Http/Controllers/Auth/AuthenticatedSessionController.php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
{
    $request->authenticate();

    $request->session()->regenerate();

    $user = $request->user();
    
    // Simple status check
    if (method_exists($user, 'isActive') && !$user->isActive()) {
        Auth::logout();
        return back()->withErrors([
            'email' => 'Your account is not active. Please contact administrator.',
        ]);
    }

    // Update last login time
    try {
        if (\Schema::hasColumn('users', 'last_login_at')) {
            $user->update(['last_login_at' => now()]);
        }
    } catch (\Exception $e) {
        // ignore
    }

    // Log login activity (opsional)
    try {
        if (method_exists($user, 'logActivity')) {
            $user->logActivity('login', 'User successfully logged in');
        }
    } catch (\Exception $e) {
        // ignore
    }

    // 🚀 Redirect sesuai role
    if ($user->isAdmin()) {
        return redirect()->intended(route('admin.dashboard'));
    } elseif ($user->isMentor()) {
        return redirect()->intended(route('mentor.dashboard'));
    } elseif ($user->isMember()) {
        return redirect()->intended(route('member.dashboard'));
    }

    // fallback terakhir
    return redirect()->route('welcome');
}


    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

    return redirect()->route('login');
 // 👈 pastikan ada redirect
    }
}