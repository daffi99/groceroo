# 🛒 Groceroo — Smart Pantry & Grocery Manager

A modern, offline-first Progressive Web App (PWA) tailored for iPhone & mobile to solve grocery forgetfulness with category-based stock tracking (🔴 Habis, 🟡 Menipis, 🟢 Aman), in-store shopping checklist, 6-digit PIN security, and cloud sync via **Neon Serverless Postgres** deployed on **Vercel**.

![Groceroo Logo](./public/logo_groceroo.png)

## ✨ Fitur Utama

- **Pantry Stock Management**: Pelacakan persediaan dapur per kategori (Bumbu & Dapur, Kulkas & Protein, Sayur & Buah, Bahan Pokok, Kamar Mandi & Cuci, Camilan).
- **1-Tap Status Switch**: Beralih instan antara `Habis`, `Menipis`, dan `Aman` dengan animasi spring membal dan tactile haptics.
- **In-Store Shopping Mode**: Otomatis mengumpulkan barang yang habis/menipis per lorong supermarket. Saat dicentang di kasir, status barang otomatis kembali menjadi `Aman`.
- **Halaman CRUD Mandiri**: Tambah, edit nama/kategori, atau hapus barang di tab **Kelola**.
- **6-Digit PIN Protection**: Proteksi akses dapur keluarga dengan keypad gaya iOS.
- **Offline-First (PWA)**: Berfungsi 100% saat berada di basement supermarket tanpa sinyal melalui `localStorage` dan Service Worker.
- **Neon Postgres Backend**: Sinkronisasi cloud otomatis di background saat kembali online.

---

## 🚀 Deploy ke Vercel

1. Import repository ini ke **Vercel** (`https://vercel.com/new`).
2. Di **Project Settings > Environment Variables**, tambahkan 2 variabel berikut:

| Nama Variabel | Contoh Nilai | Keterangan |
|---|---|---|
| `DATABASE_URL` | `postgres://user:pass@ep-xyz-pooler.neon.tech/neondb?sslmode=require` | Connection string dari [Neon Console](https://console.neon.tech) |
| `PANTRY_PIN` | `123456` | 6-digit PIN rahasia untuk membuka dapur Anda |

3. Klik **Deploy**! 
   - Tabel database `categories` dan `inventory_items` akan dibuat dan di-seed otomatis pada pemanggilan pertama.

---

## 🛠️ Menjalankan Lokal

```bash
# Install dependencies
npm install

# Jalankan dev server
npm run dev

# Build untuk production
npm run build
```

---

## 📱 Pasang di iPhone (PWA)
1. Buka URL deployment di **Safari** pada iPhone.
2. Ketuk tombol **Bagikan (Share) ⬆️**.
3. Pilih **Tambah ke Layar Utama (Add to Home Screen) ➕**.
