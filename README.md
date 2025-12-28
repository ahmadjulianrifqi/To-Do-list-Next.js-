📝 To-Do List App (Next.js + Prisma)

Aplikasi To-Do List berbasis Next.js App Router yang memungkinkan pengguna mengelola tugas secara real-time, persisten ke database PostgreSQL, dan siap production menggunakan Vercel + Neon.

 Project ini dibuat dengan fokus pada:
- Struktur kode yang rapi (component-based)
- UX yang nyaman
- Integrasi backend modern (API Route + Prisma)
- Siap untuk deployment production

🚀 Tech Stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL (Neon)
- Vercel (Deployment)

✨ Fitur Utama

✅ Tambah todo dengan judul & deadline

✏️ Edit todo (judul & deadline) 

❌ Hapus todo

☑️ Tandai todo selesai / belum selesai

🔍 Filter todo:

      - All

      - Active

      - Completed

🔃 Sorting todo:

      - Terbaru

      - Deadline terdekat

⚡ Optimistic UI (checkbox langsung berubah tanpa reload)

⏳ Loading state

⚠️ Error handling

📭 Empty state (saat todo kosong)

🔔 Penanda deadline mendekati (warna merah)

📱 Responsive layout (mobile–desktop)

📂 Struktur Folder

.
├── app

│   ├── api

│   │   └── todos

│   │       └── route.ts

│   ├── components

│   │   └── TodoItem.tsx

│   └── page.tsx

├── prisma

│   └── schema.prisma

├── .env

├── package.json

└── README.md

🧠 Arsitektur Singkat

1. Frontend

     Menggunakan App Router (app/page.tsx)

    UI dipecah ke komponen TodoItem

    State dikelola dengan React Hooks

    Optimistic UI untuk interaksi checkbox

2. Backend

     API menggunakan Next.js Route Handler

    Database di-handle Prisma ORM

    PostgreSQL sebagai storage utama

⚙️ Setup & Installation (Local)

1️⃣ Clone repository

    git clone https://github.com/ahmadjulianrifqi
    /To-Do-list-Next.js.git

    cd todo-app

2️⃣ Install dependencies

    npm install

3️⃣ Setup environment variable

Buat file .env:

    DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"

4️⃣ Sync database

    npx prisma db push

5️⃣ Jalankan development server

    npm run dev

Akses di:

👉 http://localhost:3000

🌍 Deployment

Aplikasi ini siap dideploy ke Vercel dengan database PostgreSQL Neon.

Langkah singkat:

- Push ke GitHub

- Import project ke Vercel

- Set Environment Variable:

   DATABASE_URL

- Deploy 🚀

📌 Catatan Penting

Tidak menggunakan reload halaman

State UI dan database tetap sinkron

Kode sudah di-refactor agar mudah dikembangkan

Cocok sebagai:

    - Project portfolin

    - Latihan fullstack Next.js

    - Dasar aplikasi CRUD production-ready

👨‍💻 Author

    Ahmad Julian Rifqi | Junior Fullstack Dev

    Mahasiswa & Web Developer

    Fokus pada Fullstack JavaScript & Web Modern 🚀
    
