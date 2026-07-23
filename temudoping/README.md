# Business Process
# Aplikasi Bimbingan Akademik Online

## Gambaran Umum

Aplikasi Bimbingan Akademik Online digunakan untuk mengelola seluruh proses tugas akhir mahasiswa mulai dari pengajuan judul, persetujuan Program Studi, penentuan dosen pembimbing, penjadwalan bimbingan, hingga dokumentasi seluruh proses bimbingan secara digital.

Sistem memiliki empat aktor utama:

- Mahasiswa
- Dosen
- Program Studi
- Administrator

---

# Business Flow

```text
Mahasiswa
      │
      ▼
Mengajukan Maksimal 3 Judul
      │
      ▼
Program Studi Mereview
      │
      ▼
1 Judul Disetujui
      │
      ▼
Data Skripsi Dibuat
      │
      ▼
Admin Menentukan Pembimbing
      │
      ▼
Dosen Mengatur Jadwal
      │
      ▼
Mahasiswa Booking Jadwal
      │
      ▼
Dosen Approve / Reject / Reschedule
      │
      ▼
Pelaksanaan Bimbingan
      │
      ▼
Upload Revisi
      │
      ▼
Selesai
```

---

# Modul 1
## Pengajuan Judul

Mahasiswa dapat mengajukan maksimal tiga judul.

Tabel:

```
title_submissions
```

Flow

```text
Mahasiswa

↓

Input Judul 1

↓

Input Judul 2

↓

Input Judul 3

↓

Submit
```

Status awal

```
submitted
```

---

# Modul 2
## Review Judul

Program Studi melakukan review terhadap seluruh judul.

Kemungkinan hasil

```text
Judul 1

Approved

Judul 2

Cancelled

Judul 3

Cancelled
```

atau

```text
Semua Judul

Rejected
```

Jika satu judul disetujui maka otomatis dibuat data skripsi.

---

# Modul 3
## Pembentukan Data Skripsi

Tabel

```
theses
```

Status awal

```
waiting_supervisor
```

Data skripsi belum memiliki pembimbing.

---

# Modul 4
## Penentuan Dosen Pembimbing

Administrator menentukan pembimbing.

Informasi pembimbing tidak disimpan sebagai kolom database, tetapi pada

```
theses.metadata.supervisors.current
```

Contoh

```json
{
  "current": {
    "supervisor_1": 12,
    "supervisor_2": 18
  }
}
```

---

## Pergantian Pembimbing

Administrator dapat mengganti pembimbing kapan saja.

Setiap perubahan tidak menghapus data lama.

Riwayat disimpan pada

```
metadata.supervisors.history
```

Contoh

```text
Penetapan Awal

↓

Pembimbing Diganti

↓

Tambah Pembimbing Kedua

↓

Pembimbing Diganti Lagi
```

Seluruh histori tetap tersimpan.

---

# Modul 5
## Pengaturan Jadwal Dosen

Dosen menentukan slot bimbingan.

Tabel

```
availabilities
```

Contoh

```text
Senin

08.00-11.00

Rabu

13.00-15.00

Jumat

09.00-12.00
```

Mahasiswa hanya dapat melakukan booking pada slot tersebut.

---

# Modul 6
## Booking Jadwal

Mahasiswa memilih pembimbing aktif dari data skripsinya.

Flow

```text
Pilih Pembimbing

↓

Pilih Jadwal

↓

Pilih Online / Offline

↓

Submit
```

Data pembimbing yang dipilih disimpan pada

```
appointments.metadata.selected_supervisor
```

---

### Meeting Online

Mahasiswa memilih

```
Online
```

Dosen kemudian menambahkan

```
Google Meet

Zoom

Microsoft Teams
```

URL disimpan pada

```
meeting_url
```

---

### Meeting Offline

Mahasiswa memilih

```
Offline
```

Lokasi disimpan pada

```
meeting_location
```

Contoh

```
Ruang Dosen

Lab Komputer

Perpustakaan
```

---

# Modul 7
## Approval Booking

Status booking

```text
Pending

↓

Approved
```

atau

```text
Pending

↓

Rejected
```

atau

```text
Pending

↓

Rescheduled
```

Jika reschedule maka histori disimpan pada metadata.

---

# Modul 8
## Pelaksanaan Bimbingan

Jika appointment selesai

↓

Status menjadi

```
completed
```

↓

Sistem membuat

```
guidance_session
```

---

# Modul 9
## Upload Revisi

Mahasiswa mengunggah revisi.

Semua revisi disimpan sebagai versi.

Contoh

```text
Bab1_v1.pdf

↓

Bab1_v2.pdf

↓

Bab1_v3.pdf
```

Tidak diperlukan tabel file terpisah.

---

# Modul 10
## Catatan Bimbingan

Dosen memberikan komentar.

Mahasiswa dapat membalas komentar.

Seluruh komunikasi tersimpan pada

```
guidance_sessions.metadata.comments
```

---

# Modul 11
## Monitoring Progress

Dashboard menampilkan

- Status Judul
- Pembimbing Aktif
- Jumlah Pertemuan
- Progress Bab
- Jadwal Berikutnya
- Revisi Terakhir

Progress bab disimpan pada

```
theses.metadata.chapters
```

---

# Modul 12
## Notifikasi

Notifikasi dibuat ketika

- Judul disetujui
- Pembimbing ditentukan
- Booking dibuat
- Booking disetujui
- Jadwal diubah
- Catatan baru ditambahkan

---

# Modul 13
## Audit Log

Seluruh aktivitas dicatat.

Contoh

```text
Login

↓

Submit Judul

↓

Approve Judul

↓

Menentukan Pembimbing

↓

Mengganti Pembimbing

↓

Booking Jadwal

↓

Approve Booking

↓

Upload Revisi
```

---

# State Pengajuan Judul

```text
Draft

↓

Submitted

├── Rejected
│
└── Approved
        │
        ▼
   Thesis Created
```

---

# State Skripsi

```text
Waiting Supervisor

↓

Guidance

↓

Completed
```

---

# State Appointment

```text
Pending

├── Approved
│      │
│      ▼
│  Completed
│
├── Rejected
│
└── Rescheduled
        │
        ▼
    Approved
```

---

# Relasi Antar Modul

```text
Users
│
├── Title Submissions
│       │
│       ▼
│    Theses
│       │
│       ├── Availabilities
│       │
│       ├── Appointments
│       │
│       ▼
│ Guidance Sessions
│
├── Notifications
│
└── Activity Logs
```