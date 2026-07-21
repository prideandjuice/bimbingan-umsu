<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $demoUsers = [
            [
                'name' => 'Super Admin',
                'username' => 'admin',
                'email' => 'admin@umsu.ac.id',
                'role' => 'admin',
                'department' => null,
                'is_verified' => true,
            ],
            [
                'name' => 'Dr. Prodi Kaprodi',
                'username' => 'prodi',
                'email' => 'prodi@umsu.ac.id',
                'role' => 'prodi',
                'department' => 'Magister Ilmu Komunikasi',
                'is_verified' => true,
            ],
            [
                'name' => 'Prof. Dr. Irwan, M.Si',
                'username' => 'irwan',
                'email' => 'irwan@umsu.ac.id',
                'role' => 'lecturer',
                'nidn' => '0012345678',
                'department' => 'Magister Ilmu Komunikasi',
                'is_verified' => true,
            ],
            [
                'name' => 'Mahasiswa Demo',
                'username' => 'mahasiswa',
                'email' => 'mahasiswa@umsu.ac.id',
                'role' => 'student',
                'npm' => '2210000001',
                'department' => 'Magister Ilmu Komunikasi',
                'is_verified' => true,
            ],
            [
                'name' => 'Tamu Baru',
                'username' => 'tamu',
                'email' => 'tamu@gmail.com',
                'role' => 'guest',
                'department' => null,
                'is_verified' => false,
            ]
        ];

        foreach ($demoUsers as $userData) {
            $user = User::where('email', $userData['email'])->first();
            if (!$user) {
                $user = User::create([
                    'name' => $userData['name'],
                    'username' => $userData['username'],
                    'email' => $userData['email'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'remember_token' => Str::random(10),
                    'npm' => $userData['npm'] ?? null,
                    'nidn' => $userData['nidn'] ?? null,
                    'department' => $userData['department'] ?? null,
                    'is_verified' => $userData['is_verified'],
                ]);
            } else {
                $user->update([
                    'npm' => $userData['npm'] ?? $user->npm,
                    'nidn' => $userData['nidn'] ?? $user->nidn,
                    'department' => $userData['department'] ?? $user->department,
                    'is_verified' => $userData['is_verified'],
                ]);
            }

            if (method_exists($user, 'assignRole')) {
                try {
                    $user->assignRole($userData['role']);
                } catch (\Exception $e) {
                    // Ignore if role does not exist
                }
            }
        }
    }
}
