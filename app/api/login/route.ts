// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcrypt';

// const prisma = new PrismaClient();

// export async function POST(request: Request) {
//   try {
//     const { email, password } = await request.json();

//     // Check if admin exists
//     const admin = await prisma.admin.findUnique({
//       where: { email },
//     });

//     if (!admin) {
//       return new Response('Invalid email or password', { status: 400 });
//     }

//     // Compare the entered password with the stored hashed password
//     const isPasswordValid = await bcrypt.compare(password, admin.password);

//     if (!isPasswordValid) {
//       return new Response('Invalid email or password', { status: 400 });
//     }

//     // If valid, return a success response
//     return new Response(JSON.stringify({ message: 'Login successful' }), {
//       status: 200,
//     });
//   } catch (error) {
//     return new Response('An error occurred', { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Cari admin berdasarkan username
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Admin tidak ditemukan' }, { status: 404 });
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Password salah' }, { status: 401 });
    }

    // Return data admin tanpa password
    const { password: _, ...adminData } = admin;
    return NextResponse.json(adminData);
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}
