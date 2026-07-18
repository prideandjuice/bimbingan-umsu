<?php

namespace App\Traits;

use App\Models\Configuration\Menu;
use App\Models\Permission;

trait HasMenuPermission
{
    public function attachMenuPermission(Menu $menu, array | null $permissions, array | null $roles)
    {
        if (!is_array($permissions)) {
            $permissions = ['create', 'read', 'update', 'delete'];
        }

        foreach ($permissions as $item) {
            $permission = Permission::firstOrCreate([
                'name' => "{$item} {$menu->url}",
                'guard_name' => 'web',
            ]);
            
            // Check if already attached to avoid duplicates
            if (!$permission->menus()->where('menu_id', $menu->id)->exists()) {
                $permission->menus()->attach($menu);
            }

            if ($roles) {
                $permission->assignRole($roles);
            }
        }
    }
}
