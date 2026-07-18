<?php

namespace App\Services\Management\Configuration;

use App\Models\Configuration\Menu;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class MenuService
{
    /**
     * Mengambil menu dengan pencarian dinamis.
     */
    public function getPaginatedMenus(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', config('custom.per_page'));

        return Menu::query()
            ->whereNull('main_menu_id')
            ->with(['subMenus' => function ($q) use ($search) {
                $q->orderBy('orders', 'asc');
                $q->when($search, function ($subQ) use ($search) {
                    $terms = explode(' ', $search);
                    $subQ->where(function ($subQGroup) use ($terms) {
                        foreach ($terms as $term) {
                            $term = trim($term);
                            if (empty($term)) continue;
                            $subQGroup->where(function ($query) use ($term) {
                                $query->where('name', 'ILIKE', "%{$term}%");
                            });
                        }
                    });
                });
            }])
            ->when($search, function ($query) use ($search) {
                $terms = explode(' ', $search);
                $query->where(function ($qGroup) use ($terms) {
                    foreach ($terms as $term) {
                        $term = trim($term);
                        if (empty($term)) continue;
                        $qGroup->where(function ($q) use ($term) {
                            $q->where('name', 'ILIKE', "%{$term}%")
                                ->orWhere('category', 'ILIKE', "%{$term}%")
                                ->orWhereHas('subMenus', function ($subQ) use ($term) {
                                    $subQ->where('name', 'ILIKE', "%{$term}%");
                                });
                        });
                    }
                });
            })
            ->orderBy('orders', 'asc')
            ->paginate($perPage) // Gunakan variabel perPage
            ->withQueryString();
    }

    public function deleteMenu(int $id)
    {
        $menu = Menu::findOrFail($id);

        if ($menu->subMenus()->exists()) {
            $menu->subMenus()->delete();
        }

        return $menu->delete();
    }
}
