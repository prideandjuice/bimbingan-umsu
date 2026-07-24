<?php

namespace App\Http\Controllers\Management\Configuration;

use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\User\UserRequest;
use App\Models\Role;
use App\Models\User;
use App\Services\Management\Configuration\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserController extends Controller
{

    public function __construct(
        protected UserService $userService
    ) {}
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('management/configuration/users/index', [
            'users'    => $this->userService->getAllUsersWithFilters($request),
            'allRoles' => $this->userService->getAvailableRoles(),
            'filters'  => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        $user = User::create([
            ...$request->validated(),
            'password' => bcrypt($request->password),
            'email_verified_at' => now(),
        ]);

        $user->syncRoles($request->role_ids);

        return back()->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, User $user)
    {
        $user->update($request->only('name', 'email', 'username'));
        $user->syncRoles($request->role_ids); // Spatie sync by names or IDs

        return back()->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $this->userService->delete($user->id);
        return back()->with('success', 'User deleted successfully.');
    }

    public function approve(User $user)
    {
        // if (!$user->hasVerifiedEmail()) {
        //     return response()->json(['errors' => "User {$user->name} has not verified their email yet."], 422);
        // }

        $user->update(['is_verified' => true]);

        return back()->with('success', 'User approved successfully');
    }

    public function destroySessions(Request $request, $email)
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            return back()->with('error', 'User not found.');
        }

        DB::table('user_sessions')->where('user_id', $user->id)->delete();

        return back()->with('success', 'User sessions deleted successfully.');
    }
}
