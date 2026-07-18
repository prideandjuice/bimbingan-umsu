<?php

namespace App\Services\Management\Configuration;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class RoleService
{
    public function getPaginatedRoles(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        return Role::query()
            ->when($search, function ($query) use ($search) {
                $terms = explode(' ', $search);
                $query->where(function($q) use ($terms) {
                    foreach ($terms as $term) {
                        $term = trim($term);
                        if (empty($term)) continue;
                        $q->where(function($query) use ($term) {

                $query->where('name', 'ILIKE', "%{$term}%")
                    ->orWhere('guard_name', 'ILIKE', "%{$term}%");
                                    });
                    }
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function delete(Role $role)
    {
        $protectedRoles = ['super-admin', 'admin'];

        if (in_array(strtolower($role->name), $protectedRoles)) {
            throw ValidationException::withMessages([
                'message' => "Role '{$role->name}' adalah role sistem dan tidak dapat dihapus."
            ]);
        }

        return $role->delete();
    }
}
