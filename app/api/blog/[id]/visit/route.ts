import { NextRequest, NextResponse } from "next/server";
import BlogModel from "@/app/lib/models/blogModel";
import { ConnectDB } from "@/app/lib/config/db";

interface Context {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, context: Context) {
  await ConnectDB();

  const { id } = await context.params;

  try {
    const blog = await BlogModel.findById(id);
    if (!blog) {
      return NextResponse.json({ success: false, msg: "Press tidak ditemukan." }, { status: 404 });
    }

    blog.visitCount += 1;
    await blog.save();

    return NextResponse.json({ success: true, msg: "Visit count updated." });
  } catch (error) {
    console.error("Error updating visit count:", error);
    return NextResponse.json(
      { success: false, msg: "Terjadi kesalahan saat mengupdate visit count." },
      { status: 500 }
    );
  }
}