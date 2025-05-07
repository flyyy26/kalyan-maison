import { NextRequest, NextResponse } from 'next/server';
import BlogModel from "@/app/lib/models/blogModel";
import { v2 as cloudinary } from 'cloudinary';
import { isValidObjectId } from "mongoose";
// import { extractPublicId } from "@/app/lib/utils/cloudinary";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }  // ✅ Tipe harus Promise
) {
  const { id } = await context.params; // ✅ Await diperlukan di sini

  if (!id) {
    return NextResponse.json({ message: "Invalid blog ID or slug" }, { status: 400 });
  }

  try {
    let blog = null;

    if (isValidObjectId(id)) {
      blog = await BlogModel.findById(id); // Cari berdasarkan MongoDB ObjectId
    }

    if (!blog) {
      blog = await BlogModel.findOne({ slugEn: id }); // Jika bukan ID, cari pakai slugEn
    }

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

function extractPublicId(url: string): string | null {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.(jpg|jpeg|png|webp|gif|svg)/);
    return match ? match[1] : null;
  } catch {
    return null;
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
  
      const image = formData.get("image");
      let imgUrl = blog.image;

      if (image instanceof File) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const base64 = `data:${image.type};base64,${buffer.toString("base64")}`;

        // Hapus gambar lama dari Cloudinary
        if (blog.image) {
          const oldPublicId = extractPublicId(blog.image);
          console.log("Trying to delete:", oldPublicId);
          if (oldPublicId) {
            const res = await cloudinary.uploader.destroy(oldPublicId);
            console.log("Cloudinary destroy response:", res);
          }
        }

        // Upload baru
        const result = await cloudinary.uploader.upload(base64, {
          folder: 'blog',
        });
        imgUrl = result.secure_url;
      }

      // const image = formData.get("image");
      // let imgurl = blog.image;
  
      // // Cek apakah image adalah File sebelum memprosesnya
      // if (image instanceof File) {
      //   const imageByteData = await image.arrayBuffer();
      //   const buffer = Buffer.from(imageByteData);
      //   const newPath = `./public/${timestamp}_${image.name}`;
      //   await writeFile(newPath, buffer);
      //   imgurl = `/${timestamp}_${image.name}`;
  
      //   // Hapus gambar lama jika ada
      //   if (blog.image) {
      //     const oldImagePath = `./public${blog.image}`;
      //     await unlink(oldImagePath).catch(() => {});
      //   }
      // }
  
      // Perbarui data blog
      blog.titleEn = formData.get("titleEn") as string;
      blog.source = formData.get("source") as string;
      blog.slugEn = formData.get("slugEn") as string;
      blog.descriptionEn = formData.get("descriptionEn") as string;
      blog.titleCn = formData.get("titleCn") as string;
      blog.slugCn = formData.get("slugCn") as string;
      blog.descriptionCn = formData.get("descriptionCn") as string;
      blog.titleRs = formData.get("titleRs") as string;
      blog.slugRs = formData.get("slugRs") as string;
      blog.descriptionRs = formData.get("descriptionRs") as string;
      blog.author = formData.get("author") as string;
      blog.tags = JSON.parse(formData.get("tags") as string);
      blog.image = imgUrl;
  
      await blog.save();
  
      return NextResponse.json({ success: true, msg: "Press Berhasil diperbarui" });
    } catch (error) {
      console.error("Error saat memperbarui press:", error);
      return NextResponse.json(
        { success: false, msg: "Terjadi kesalahan saat memperbarui press." },
        { status: 500 }
      );
    }
  }
  
