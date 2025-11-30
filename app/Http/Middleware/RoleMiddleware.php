<?php
// app/Http/Middleware/RoleMiddleware.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        if (!in_array($request->user()->role, $roles)) {
            abort(403, 'Unauthorized access.');
        }

        return $next($request);
    }
}

// app/Http/Middleware/CheckUserStatus.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserStatus
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->status !== 'active') {
            auth()->logout();
            return redirect()->route('login')->with('error', 'Your account is not active. Please contact administrator.');
        }

        return $next($request);
    }
}

// app/Http/Middleware/RedirectBasedOnRole.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectBasedOnRole
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()) {
            $user = $request->user();
            
            // Update last login
            $user->update(['last_login_at' => now()]);
            
            // Log login activity
            $user->logActivity('login', 'User logged into the system');
            
            // Redirect based on role
            $currentRoute = $request->route()->getName();
            
            if ($user->isAdmin() && !str_starts_with($currentRoute, 'admin.')) {
                return redirect()->route('admin.dashboard');
            } elseif ($user->isMentor() && !str_starts_with($currentRoute, 'mentor.')) {
                return redirect()->route('mentor.dashboard');
            } elseif ($user->isMember() && !str_starts_with($currentRoute, 'member.')) {
                return redirect()->route('member.dashboard');
            }
        }

        return $next($request);
    }
}