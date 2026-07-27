<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Superadmin & Admin bypass all role checks
        if ($user->role === 'superadmin' || $user->role === 'admin' || (method_exists($user, 'hasRole') && ($user->hasRole('superadmin') || $user->hasRole('admin')))) {
            return $next($request);
        }

        // Check if user has any of the required roles (via Spatie or user->role attribute)
        $hasRole = false;
        if (method_exists($user, 'hasAnyRole')) {
            $hasRole = $user->hasAnyRole($roles);
        }

        if (!$hasRole && isset($user->role)) {
            $hasRole = in_array($user->role, $roles);
        }

        if (!$hasRole) {
            abort(403, 'Anda tidak memiliki hak akses ke halaman tersebut.');
        }

        return $next($request);
    }
}
