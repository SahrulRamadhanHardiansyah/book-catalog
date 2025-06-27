# 📖 Katalog Buku Interaktif

Sebuah aplikasi web katalog buku interaktif yang memungkinkan pengguna untuk mencari buku menggunakan Google Books API, mengelola rak buku pribadi, dan melakukan autentikasi menggunakan Supabase. Dibangun dengan tumpukan teknologi modern yang berfokus pada pengalaman developer dan performa.

-----

## Daftar Isi

  - [Pratinjau](https://www.google.com/search?q=%23pratinjau)
  - [Fitur Utama](https://www.google.com/search?q=%23fitur-utama)
  - [Tumpukan Teknologi](https://www.google.com/search?q=%23tumpukan-teknologi)
  - [Instalasi & Menjalankan Lokal](https://www.google.com/search?q=%23instalasi--menjalankan-lokal)
      - [1. Prasyarat](https://www.google.com/search?q=%231-prasyarat)
      - [2. Clone Repositori](https://www.google.com/search?q=%232-clone-repositori)
      - [3. Instalasi Dependensi](https://www.google.com/search?q=%233-instalasi-dependensi)
      - [4. Pengaturan Supabase](https://www.google.com/search?q=%234-pengaturan-supabase)
      - [5. Variabel Lingkungan (.env)](https://www.google.com/search?q=%235-variabel-lingkungan-env)
      - [6. Jalankan Aplikasi](https://www.google.com/search?q=%236-jalankan-aplikasi)
  - [Pengembangan Selanjutnya](https://www.google.com/search?q=%23pengembangan-selanjutnya)
  - [Lisensi](https://www.google.com/search?q=%23lisensi)

-----

## Pratinjau

Berikut adalah beberapa tangkapan layar dari aplikasi:

**Halaman Utama & Pencarian**
*Desain hero section yang modern dengan latar belakang aurora yang dinamis.*

![image](https://github.com/user-attachments/assets/672205ce-eb6f-4173-8672-dbbf5beca531)

**Halaman Detail Buku**
*Tata letak yang bersih dan informatif, lengkap dengan dukungan dark mode dan informasi metadata yang rapi.*

![image](https://github.com/user-attachments/assets/7f4aa98b-a271-4df8-bda1-b0a23384c91f)

**Rak Buku Pribadi**
*Tampilan koleksi buku pribadi yang konsisten dengan halaman pencarian, lengkap dengan interaksi hapus.*

![image](https://github.com/user-attachments/assets/936b935c-195a-48ca-9fb1-71748d9a27c2)

-----

## Fitur Utama

  - **👤 Autentikasi Pengguna:** Login dan registrasi yang aman menggunakan Supabase Auth.
      - Dukungan Social Login (OAuth) untuk Google, GitHub, dan Facebook.
      - Manajemen sesi pengguna dengan avatar dan menu dropdown di navbar.
  - **🔍 Pencarian Buku Real-time:** Memanfaatkan Google Books API untuk mencari jutaan buku berdasarkan judul atau penulis.
  - **📚 Rak Buku Pribadi:**
      - Rute terproteksi (`/my-bookshelf`) yang hanya bisa diakses setelah login.
      - Kemampuan untuk **menambah** buku ke rak pribadi dari halaman detail.
      - Kemampuan untuk **menghapus** buku dari rak dengan konfirmasi.
  - **🖼️ UI Modern & Responsif:**
      - Dibangun dengan Tailwind CSS untuk antarmuka yang bersih dan modern.
      - Dukungan penuh untuk **Dark Mode** di seluruh aplikasi.
      - Animasi dan transisi yang halus untuk pengalaman pengguna yang lebih baik.
  - **💡 Penanganan State yang Cerdas:**
      - Menampilkan pesan dan UI yang sesuai untuk kondisi loading, error, atau saat data kosong (misalnya rak buku kosong).
      - Tombol "Tambah ke Rak" secara cerdas disembunyikan jika buku sudah ada di rak pengguna.

-----

## Tumpukan Teknologi

  - **Framework:** [Next.js](https://nextjs.org/) 14+ (dengan App Router)
  - **Backend & Autentikasi:** [Supabase](https://supabase.com/)
  - **Styling:** [Tailwind CSS](https://tailwindcss.com/)
  - **Sumber Data:** [Google Books API](https://developers.google.com/books)
  - **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
  - **Deployment:** [Vercel](https://vercel.com/) (Direkomendasikan)

-----

## Instalasi & Menjalankan Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di mesin lokal Anda.

### 1\. Prasyarat

  - [Node.js](https://nodejs.org/) (v18 atau lebih baru)
  - [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/)
  - Akun [Supabase](https://supabase.com/)
  - Akun [Google Cloud](https://console.cloud.google.com/) untuk mendapatkan kunci API Google Books.

### 2\. Clone Repositori

```bash
git clone https://github.com/NAMA_PENGGUNA_ANDA/NAMA_REPOSITORI_ANDA.git
cd NAMA_REPOSITORI_ANDA
```

### 3\. Instalasi Dependensi

```bash
npm install
```

### 4\. Pengaturan Supabase

1.  **Buat Proyek:** Buka [dasbor Supabase](https://www.google.com/search?q=https://app.supabase.com) dan buat proyek baru.
2.  **Dapatkan Kunci API:** Salin `Project URL` dan `anon public key` dari **Settings \> API**.
3.  **Konfigurasi OAuth:**
      - Buka **Authentication \> Providers**.
      - Aktifkan Google, GitHub, dan Facebook. Ikuti petunjuk untuk mendapatkan `Client ID` dan `Client Secret` dari masing-masing platform.
      - Pastikan Anda menambahkan **Callback URL** dari Supabase ke pengaturan aplikasi OAuth Anda di setiap platform.
4.  **Buat Tabel Database:**
      - Buka **SQL Editor** di dasbor Supabase.
      - Jalankan skrip SQL berikut untuk membuat tabel `user_bookshelves` dan mengaktifkan RLS (Row Level Security).
    <!-- end list -->
    ```sql
    -- Membuat tabel untuk rak buku pengguna
    CREATE TABLE public.user_bookshelves (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      book_id TEXT NOT NULL,
      book_title TEXT,
      book_cover_url TEXT,
      created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
      CONSTRAINT unique_user_book UNIQUE (user_id, book_id)
    );

    -- Mengaktifkan Row Level Security
    ALTER TABLE public.user_bookshelves ENABLE ROW LEVEL SECURITY;

    -- Menambahkan Kebijakan (Policies)
    CREATE POLICY "Allow users to view their own bookshelf" ON public.user_bookshelves FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Allow users to add books to their own bookshelf" ON public.user_bookshelves FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Allow users to delete books from their own bookshelf" ON public.user_bookshelves FOR DELETE USING (auth.uid() = user_id);
    ```

### 5\. Variabel Lingkungan (.env)

Buat file bernama `.env.local` di root proyek. Salin konten dari `.env.example` (jika ada) atau gunakan templat di bawah ini dan isi dengan nilai yang sesuai.

```bash
# .env.local

# Kunci dari dasbor Supabase Anda
NEXT_PUBLIC_SUPABASE_URL=URL_PROYEK_SUPABASE_ANDA
NEXT_PUBLIC_SUPABASE_ANON_KEY=KUNCI_ANON_PUBLIK_SUPABASE_ANDA

# Kunci dari Google Cloud Console
GOOGLE_BOOKS_API_KEY=KUNCI_API_GOOGLE_BOOKS_ANDA
```

### 6\. Jalankan Aplikasi

Setelah semua pengaturan selesai, jalankan server pengembangan:

```bash
npm run dev
```

Buka [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) di browser Anda untuk melihat hasilnya.

-----

## Pengembangan Selanjutnya

Proyek ini memiliki banyak potensi untuk dikembangkan lebih lanjut, di antaranya:

  - [ ] **Paginasi atau Infinite Scroll:** Menambahkan fitur "Load More" pada halaman hasil pencarian untuk menampilkan lebih banyak buku.
  - [ ] **Status Buku:** Menambahkan beberapa status pada rak buku (misalnya, "Ingin Dibaca", "Sedang Dibaca", "Selesai Dibaca").
  - [ ] **Ulasan & Rating:** Memungkinkan pengguna untuk memberikan rating dan menulis ulasan singkat untuk buku yang ada di rak mereka.
  - [ ] **Halaman Profil:** Membuat halaman profil pengguna yang lebih detail.
  - [ ] **Optimistic UI:** Memberikan feedback instan di UI saat menambah atau menghapus buku, tanpa harus menunggu server merespons.
