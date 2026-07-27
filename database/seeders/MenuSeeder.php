<?php

namespace Database\Seeders;

use App\Models\Configuration\Menu;
use App\Traits\HasMenuPermission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;

class MenuSeeder extends Seeder
{
    use HasMenuPermission;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Cache::forget('menus');

        // =========================================================================
        // 1. KATEGORI MANAGEMENT (ACM)
        // =========================================================================
        $mmConfig = Menu::updateOrCreate(['url' => 'configuration'], [
            'name' => 'Configuration',
            'category' => 'MANAGEMENT',
            'icon' => 'Settings',
            'active' => 1,
            'orders' => 1
        ]);
        $this->attachMenuPermission($mmConfig, ['read'], ['admin']);

        // Sub Menu Configuration
        $sm = $mmConfig->subMenus()->updateOrCreate(['url' => $mmConfig->url . '/menu'], [
            'name' => 'Menu',
            'category' => $mmConfig->category,
            'icon' => 'LayoutList',
            'active' => 1,
            'orders' => 1
        ]);
        $this->attachMenuPermission($sm, ['read', 'create', 'update', 'delete', 'sort'], ['admin']);

        $sm = $mmConfig->subMenus()->updateOrCreate(['url' => $mmConfig->url . '/roles'], [
            'name' => 'Roles',
            'category' => $mmConfig->category,
            'icon' => 'ShieldCheck',
            'active' => 1,
            'orders' => 2
        ]);
        $this->attachMenuPermission($sm, ['read', 'create', 'update', 'delete'], ['admin']);

        $sm = $mmConfig->subMenus()->updateOrCreate(['url' => $mmConfig->url . '/permissions'], [
            'name' => 'Permission',
            'category' => $mmConfig->category,
            'icon' => 'Key',
            'active' => 1,
            'orders' => 3
        ]);
        $this->attachMenuPermission($sm, ['read', 'create', 'update', 'delete'], ['admin']);

        $sm = $mmConfig->subMenus()->updateOrCreate(['url' => $mmConfig->url . '/access-role'], [
            'name' => 'Access Role',
            'category' => $mmConfig->category,
            'icon' => 'UserCog',
            'active' => 1,
            'orders' => 4
        ]);
        $this->attachMenuPermission($sm, ['read', 'update'], ['admin']);

        $sm = $mmConfig->subMenus()->updateOrCreate(['url' => $mmConfig->url . '/access-user'], [
            'name' => 'Access User',
            'category' => $mmConfig->category,
            'icon' => 'UserCheck',
            'active' => 1,
            'orders' => 5
        ]);
        $this->attachMenuPermission($sm, ['read', 'update'], ['admin']);

        $sm = $mmConfig->subMenus()->updateOrCreate(['url' => $mmConfig->url . '/users'], [
            'name' => 'Users',
            'category' => $mmConfig->category,
            'icon' => 'Users',
            'active' => 1,
            'orders' => 6
        ]);
        $this->attachMenuPermission($sm, ['read', 'create', 'update', 'delete', 'approve'], ['admin']);

        // =========================================================================
        // 2. KATEGORI MAHASISWA (Pindah Navigasi ke Sidebar Page)
        // =========================================================================
        $mmMahasiswa = Menu::updateOrCreate(['url' => 'mahasiswa'], [
            'name' => 'Akademik Mahasiswa',
            'category' => 'MAHASISWA',
            'icon' => 'UserGraduation',
            'active' => 0,
            'orders' => 2
        ]);
        $this->attachMenuPermission($mmMahasiswa, ['read'], ['student']);

        $sm = $mmMahasiswa->subMenus()->updateOrCreate(['url' => $mmMahasiswa->url . '/pengajuan-judul'], [
            'name' => 'Pengajuan Judul',
            'category' => $mmMahasiswa->category,
            'icon' => 'FilePlus',
            'active' => 1,
            'orders' => 1
        ]);
        $this->attachMenuPermission($sm, ['read', 'create'], ['student']);

        $sm = $mmMahasiswa->subMenus()->updateOrCreate(['url' => $mmMahasiswa->url . '/status-judul'], [
            'name' => 'Status Persetujuan',
            'category' => $mmMahasiswa->category,
            'icon' => 'Clock',
            'active' => 1,
            'orders' => 2
        ]);
        $this->attachMenuPermission($sm, ['read'], ['student']);

        $sm = $mmMahasiswa->subMenus()->updateOrCreate(['url' => $mmMahasiswa->url . '/log-bimbingan'], [
            'name' => 'Log Bimbingan',
            'category' => $mmMahasiswa->category,
            'icon' => 'BookOpen',
            'active' => 1,
            'orders' => 3
        ]);
        $this->attachMenuPermission($sm, ['read', 'create'], ['student']);

        $sm = $mmMahasiswa->subMenus()->updateOrCreate(['url' => $mmMahasiswa->url . '/booking-jadwal'], [
            'name' => 'Booking Jadwal',
            'category' => $mmMahasiswa->category,
            'icon' => 'CalendarPlus',
            'active' => 1,
            'orders' => 4
        ]);
        $this->attachMenuPermission($sm, ['read', 'create'], ['student']);


        // =========================================================================
        // 3. KATEGORI DOSEN PEMBIMBING (Navigasi Samping Sidebar Page)
        // =========================================================================
        $mmDosen = Menu::updateOrCreate(['url' => 'dosen'], [
            'name' => 'Portal Dosen',
            'category' => 'DOSEN',
            'icon' => 'Briefcase',
            'active' => 0,
            'orders' => 3
        ]);
        $this->attachMenuPermission($mmDosen, ['read'], ['lecturer']);

        $sm = $mmDosen->subMenus()->updateOrCreate(['url' => $mmDosen->url . '/mahasiswa-bimbingan'], [
            'name' => 'Mahasiswa Bimbingan',
            'category' => $mmDosen->category,
            'icon' => 'Users',
            'active' => 1,
            'orders' => 1
        ]);
        $this->attachMenuPermission($sm, ['read'], ['lecturer']);

        $sm = $mmDosen->subMenus()->updateOrCreate(['url' => $mmDosen->url . '/ketersediaan-waktu'], [
            'name' => 'Ketersediaan Waktu',
            'category' => $mmDosen->category,
            'icon' => 'Clock',
            'active' => 1,
            'orders' => 2
        ]);
        $this->attachMenuPermission($sm, ['read', 'create', 'update', 'delete'], ['lecturer']);

        $sm = $mmDosen->subMenus()->updateOrCreate(['url' => $mmDosen->url . '/persetujuan-jadwal'], [
            'name' => 'Persetujuan Jadwal',
            'category' => $mmDosen->category,
            'icon' => 'CalendarCheck',
            'active' => 1,
            'orders' => 3
        ]);
        $this->attachMenuPermission($sm, ['read', 'approve', 'reject'], ['lecturer']);


        // =========================================================================
        // 4. KATEGORI KAPRODI / ADMIN
        // =========================================================================
        $mmAdmin = Menu::updateOrCreate(['url' => 'kaprodi'], [
            'name' => 'Kaprodi & Admin',
            'category' => 'ADMINISTRATOR',
            'icon' => 'Shield',
            'active' => 1,
            'orders' => 4
        ]);
        $this->attachMenuPermission($mmAdmin, ['read'], ['admin', 'prodi', 'superadmin']);

        $sm = $mmAdmin->subMenus()->updateOrCreate(['url' => $mmAdmin->url . '/seleksi-judul'], [
            'name' => 'Seleksi Judul',
            'category' => $mmAdmin->category,
            'icon' => 'FileCheck',
            'active' => 1,
            'orders' => 1
        ]);
        $this->attachMenuPermission($sm, ['read', 'approve', 'reject'], ['admin', 'prodi', 'superadmin']);

        $sm = $mmAdmin->subMenus()->updateOrCreate(['url' => $mmAdmin->url . '/tunjuk-dosen'], [
            'name' => 'Penunjukan Dosen',
            'category' => $mmAdmin->category,
            'icon' => 'UserPlus',
            'active' => 1,
            'orders' => 2
        ]);
        $this->attachMenuPermission($sm, ['read', 'assign'], ['admin', 'prodi', 'superadmin']);

        $sm = $mmAdmin->subMenus()->updateOrCreate(['url' => $mmAdmin->url . '/tesis-aktif'], [
            'name' => 'Skripsi Aktif',
            'category' => $mmAdmin->category,
            'icon' => 'Library',
            'active' => 1,
            'orders' => 3
        ]);
        $this->attachMenuPermission($sm, ['read'], ['admin', 'prodi', 'superadmin']);
    }
}
