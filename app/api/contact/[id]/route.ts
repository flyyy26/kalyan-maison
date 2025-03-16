import { NextRequest, NextResponse } from "next/server";
import ContactModel from "@/app/lib/models/contactModel";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params; // Tambahkan `await` sebelum `context.params`

    if (!id) {
        return NextResponse.json({ message: "Invalid blog ID" }, { status: 400 });
    }

    try {
        const blog = await ContactModel.findById(id);
        if (!blog) {
            return NextResponse.json({ message: "Blog not found" }, { status: 404 });
        }
        return NextResponse.json(blog, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
      const formData = await request.formData();
      const blogId = formData.get("_id");
  
      if (!blogId) {
        return NextResponse.json({ success: false, msg: "ID blog diperlukan." }, { status: 400 });
      }
  
      const blog = await ContactModel.findById(blogId);
      if (!blog) {
        return NextResponse.json({ success: false, msg: "Blog tidak ditemukan." }, { status: 404 });
      }
  
      // Perbarui data blog
      blog.facebook = formData.get("facebook") as string;
      blog.instagram = formData.get("instagram") as string;
      blog.tiktok = formData.get("tiktok") as string;
      blog.whatsapp = formData.get("whatsapp") as string;
  
      await blog.save();
  
      return NextResponse.json({ success: true, msg: "contact Berhasil diperbarui" });
    } catch (error) {
      console.error("Error saat memperbarui contact:", error);
      return NextResponse.json(
        { success: false, msg: "Terjadi kesalahan saat memperbarui contact." },
        { status: 500 }
      );
    }
  }
  
