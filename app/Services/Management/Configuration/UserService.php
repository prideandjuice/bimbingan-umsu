<?php

namespace App\Services\Management\Configuration;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class UserService
{
    /**
     * Mengambil data user dengan filter dan pagination.
     */
    public function getAllUsersWithFilters(Request $request): LengthAwarePaginator
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        return User::query()
            ->with('roles')
            ->when($search, function ($query, $search) {
                $terms = explode(' ', $search);
                $query->where(function($q) use ($terms) {
                    foreach ($terms as $term) {
                        $term = trim($term);
                        if (empty($term)) continue;
                        $q->where(function($query) use ($term) {

                $query->where('name', 'ILIKE', "%{$term}%")
                    ->orWhere('email', 'ILIKE', "%{$term}%")
                    ->orWhere('username', 'ILIKE', "%{$term}%");
                                    });
                    }
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Mengambil semua roles untuk kebutuhan dropdown.
     */
    public function getAvailableRoles(): Collection
    {
        return Role::all(['id', 'name']);
    }

    public function delete(int $id)
    {
        $user = User::findOrFail($id);
        return $user->delete();
    }
}
