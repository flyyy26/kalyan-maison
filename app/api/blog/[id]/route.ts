import { writeFile, unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import BlogModel from "@/app/lib/models/blogModel";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params; // Tambahkan `await` sebelum `context.params`

    if (!id) {
        return NextResponse.json({ message: "Invalid blog ID" }, { status: 400 });
    }

    try {
        const blog = await BlogModel.findById(id);
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
  
      const blog = await BlogModel.findById(blogId);
      if (!blog) {
        return NextResponse.json({ success: false, msg: "Blog tidak ditemukan." }, { status: 404 });
      }
  
      const timestamp = Date.now();
      const image = formData.get("image");
      let imgurl = blog.image;
  
      // Cek apakah image adalah File sebelum memprosesnya
      if (image instanceof File) {
        const imageByteData = await image.arrayBuffer();
        const buffer = Buffer.from(imageByteData);
        const newPath = `./public/${timestamp}_${image.name}`;
        await writeFile(newPath, buffer);
        imgurl = `/${timestamp}_${image.name}`;
  
        // Hapus gambar lama jika ada
        if (blog.image) {
          const oldImagePath = `./public${blog.image}`;
          await unlink(oldImagePath).catch(() => {});
        }
      }
  
      // Perbarui data blog
      blog.title = formData.get("title") as string;
      blog.slug = formData.get("slug") as string;
      blog.titleEn = formData.get("titleEn") as string;
      blog.slugEn = formData.get("slugEn") as string;
      blog.description = formData.get("description") as string;
      blog.descriptionEn = formData.get("descriptionEn") as string;
      blog.author = formData.get("author") as string;
      blog.tags = JSON.parse(formData.get("tags") as string);
      blog.image = imgurl;
  
      await blog.save();
  
      return NextResponse.json({ success: true, msg: "Blog Berhasil diperbarui" });
    } catch (error) {
      console.error("Error saat memperbarui blog:", error);
      return NextResponse.json(
        { success: false, msg: "Terjadi kesalahan saat memperbarui blog." },
        { status: 500 }
      );
    }
  }
  
