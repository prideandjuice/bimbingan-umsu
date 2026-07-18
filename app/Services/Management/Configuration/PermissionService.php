<?php

namespace App\Services\Management\Configuration;

use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionService
{
    public function getPaginatedPermissions(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        return Permission::query()
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
}
