import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// export async function GET() {
//   try {
//     // Fetch all admins from the database
//     const admins = await prisma.admin.findMany();

//     return new Response(JSON.stringify(admins), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     return new Response('Failed to fetch admins', {
//       status: 500,
//     });
//   }
// }

export async function GET() {
  try {
    const admins = await prisma.admin.findMany();
    return NextResponse.json(admins);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data admin' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create a new admin in the database
    const admin = await prisma.admin.create({
      data: {
        username: body.username,
        password: hashedPassword,
        email: body.email,
      },
    });

    return new Response(JSON.stringify(admin), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response('Failed to create admin', {
      status: 500,
    });
  }
}
