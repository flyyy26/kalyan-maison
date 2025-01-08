import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany();
    return NextResponse.json(blogs);
  } catch {
    return NextResponse.json({ status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Create a new blog in the database
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        date: body.date,
        image: body.image,
      },
    });

    return new Response(JSON.stringify(blog), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    return new Response('Failed to create blog', {
      status: 500,
    });
  }
}
