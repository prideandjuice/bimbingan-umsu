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
                'name' => 'Superadmin',
                'username' => 'superadmin',
                'email' => 'superadmin@umsu.ac.id',
                'role' => 'superadmin',
                'department' => null,
                'is_verified' => true,
            ],
            [
                'name' => 'prodi',
                'username' => 'prodi',
                'email' => 'prodi@umsu.ac.id',
                'role' => 'prodi',
                'department' => 'Magister Ilmu Komunikasi',
                'is_verified' => true,
            ],
            [
                'name' => 'lecturer',
                'username' => 'lecturer',
                'email' => 'lecturer@umsu.ac.id',
                'role' => 'lecturer',
                'nidn' => '0012345678',
                'department' => 'Magister Ilmu Komunikasi',
                'is_verified' => true,
            ],
            [
                'name' => 'student',
                'username' => 'student',
                'email' => 'student@umsu.ac.id',
                'role' => 'student',
                'npm' => '2210000001',
                'department' => 'Magister Ilmu Komunikasi',
                'is_verified' => true,
            ],
            [
                'name' => 'guest',
                'username' => 'guest',
                'email' => 'guest@umsu.ac.id',
                'role' => 'guest',
                'department' => null,
                'is_verified' => true,
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
