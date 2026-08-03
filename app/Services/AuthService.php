<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AuthService
{
    protected string $baseUrl;

    public function __construct()
    {
        $url = env('API_UMSU') ?: config('services.umsu.api_url');
        if (!$url) {
            $url = 'https://api.umsu.ac.id';
        }
        if (!str_starts_with($url, 'http://') && !str_starts_with($url, 'https://')) {
            $url = 'https://' . $url;
        }
        $this->baseUrl = rtrim($url, '/');
    }

    /**
     * Login ke SIMAKAD UMSU API
     *
     * @param string $npm
     * @param string $password
     * @return array
     */
    public function loginSimakad(string $npm, string $password): array
    {
        $endpoint = $this->baseUrl . '/Simakad/login';

        try {
            $response = Http::withoutVerifying()
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])->post($endpoint, [
                    'npm'      => $npm,
                    'password' => $password,
                ]);

            $json = $response->json() ?? [];
            Log::info('SIMAKAD API Response:', ['status' => $response->status(), 'body' => $json]);

            // Cek sukses berdasarkan status HTTP 2xx atau flag di JSON
            $hasSuccessFlag = isset($json['status']) && ($json['status'] === true || strtolower((string)$json['status']) === 'success' || $json['status'] === 200);
            $hasTokenOrData = isset($json['token']) || isset($json['data']) || isset($json['user']);

            if ($response->successful() && ($hasSuccessFlag || $hasTokenOrData || empty($json['error']))) {
                return [
                    'success' => true,
                    'status'  => $response->status(),
                    'data'    => $json,
                ];
            }

            return [
                'success' => false,
                'status'  => $response->status(),
                'message' => $json['message'] ?? $json['msg'] ?? $json['error'] ?? 'Gagal otentikasi SIMAKAD UMSU',
                'data'    => $json,
            ];
        } catch (\Throwable $e) {
            Log::error('AuthService loginSimakad error: ' . $e->getMessage());

            return [
                'success' => false,
                'status'  => 500,
                'message' => 'Terjadi kesalahan koneksi ke API UMSU: ' . $e->getMessage(),
            ];
        }
    }
}
