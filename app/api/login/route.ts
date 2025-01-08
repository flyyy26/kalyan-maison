import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { ConnectDB } from '@/app/lib/config/db';
import Admin from '../../lib/models/admin';

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

    // Cari admin berdasarkan username
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return NextResponse.json(
        { status: 404, error: 'Admin dengan username tersebut tidak ditemukan.' },
        { status: 404 }
      );
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { status: 401, error: 'Password yang Anda masukkan salah.' },
        { status: 401 }
      );
    }

    // Hapus password dari data admin sebelum mengirimkan response
    delete admin.password;

    return NextResponse.json(admin, { status: 200 });
  } catch (error) {
    console.error('Error saat login:', error);
    return NextResponse.json(
      { status: 500, error: 'Terjadi kesalahan pada server. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
