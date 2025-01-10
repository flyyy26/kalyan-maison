// app/api/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import Admin from '../../lib/models/admin';
import { ConnectDB } from '@/app/[locale]/lib/config/db';

// Konfigurasi MongoDB

const LoadDB = async () => {
  await ConnectDB();
}

LoadDB();

export async function POST(request: Request) {
  try {

    const { username, password } = await request.json();

    // Validasi input
    if (!username || !password) {
      return NextResponse.json(
        { status: 400, error: 'Username dan password harus diisi.' },
        { status: 400 }
      );
    }

    // Cek apakah username sudah terdaftar
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return NextResponse.json(
        { status: 400, error: 'Username sudah terdaftar.' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat admin baru
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
    });

    await newAdmin.save();

    return NextResponse.json({ status: 201, message: 'Admin berhasil dibuat.' }, { status: 201 });

  } catch (error) {
    console.error('Error saat registrasi:', error);
    return NextResponse.json(
      { status: 500, error: 'Terjadi kesalahan pada server. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
