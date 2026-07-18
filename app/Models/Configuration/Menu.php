<?php

namespace App\Models\Configuration;

use App\Models\Permission;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Guarded(['id'])]
class Menu extends Model
{
    use HasFactory;

    public function subMenus()
    {
        return $this->hasMany(Menu::class, 'main_menu_id');
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'menu_permission', 'menu_id', 'permission_id');
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
}
