# Workiva Field Guide

Website pembelajaran mandiri berbahasa Indonesia tentang Workiva Wdata, Chains, Data Prep, finance reporting, dan audit data.

## Jalankan

- **Termudah:** buka `index.html` melalui Chrome/Edge.
- **Dengan server lokal (direkomendasikan):** di folder ini, jalankan `python -m http.server 8080`, lalu buka `http://localhost:8080`.
- **Deploy:** unggah seluruh isi folder ke static hosting (Vercel, Netlify, GitHub Pages). Tidak perlu build step atau instalasi dependencies.

## Konten

1. Overview dan arsitektur end-to-end.
2. Wdata tables, fact/dimension, queries, views, parameters.
3. Chain Builder, connectors, runners, logs, dan error handling.
4. Data Prep, mapping dan validation.
5. Financial TB, reporting consolidation vs accounting consolidation, audit controls.
6. Connected reporting dan refresh.
7. Lab interaktif: query/reconciliation, Chain simulator, quiz.
8. UI Workiva nyata: tautan screenshot dokumentasi resmi dan 2 video YouTube tutorial UI Wdata.
9. PGL presenter notes (12 menit), glossary, dan daftar sumber.

## Ketersediaan media

- **Screenshot resmi** dimuat melalui remote image URLs milik `support.workiva.com`, bukan disimpan dalam paket ini. Hotlink mungkin dibatasi oleh server sumber. Selalu ada tautan sumber resmi di kartu masing-masing.
- **Tutorial video** menggunakan iframe YouTube dan membutuhkan koneksi internet serta jaringan yang mengizinkannya. Tersedia tautan buka video asli.
- Konten teks, demo query, Chain simulator, quiz dan progress checklist bekerja offline.

## Data demo

Semua nama entitas, angka dan alur run simulator adalah **fiktif**, tidak memuat data/identitas klien. Contoh file latihan tersedia dalam `samples/`.

## Status

Research snapshot: **4 November 2026** (Asia/Jakarta). Situs ini bukan produk atau dokumentasi resmi Workiva ataupun PwC. Buka sumber yang ditautkan untuk kebijakan terbaru dan detail konfigurasi workstation.

## Website online

https://nazwansm.github.io/workiva-field-guide/

Versi ini menyertakan dark/light mode yang mengikuti pengaturan perangkat, preferensi tersimpan, dan 18 topik lanjutan pada Wdata, Chains, serta Data Prep. Source website berada di root repository; GitHub Pages menerbitkan branch main dari root. File .nojekyll menjaga hosting tetap statis tanpa proses build tambahan.
