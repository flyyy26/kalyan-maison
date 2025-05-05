import { ConnectDB } from "@/app/lib/config/db";
import { NextRequest, NextResponse } from "next/server";
import BlogModel from "@/app/lib/models/blogModel";
import fs from 'fs';
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

export async function GET() {
  const blogs = await BlogModel.find({});
  console.log("Blog GET Hit");
  return NextResponse.json({ blogs });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const image = formData.get("image") as File | null;

    if (!image) {
      return NextResponse.json(
        { success: false, msg: "Gambar tidak ditemukan dalam form data." },
        { status: 400 }
      );
    }

    // 🔄 Upload ke Cloudinary
    const buffer = Buffer.from(await image.arrayBuffer());
    const base64Image = `data:${image.type};base64,${buffer.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: "blog", // 🔧 Sesuaikan folder di Cloudinary
    });

    const imgurl = uploadResult.secure_url;
    // Siapkan data blog
    const blogData = {
      titleEn: formData.get("titleEn") as string,
      slugEn: formData.get("slugEn") as string,
      descriptionEn: formData.get("descriptionEn") as string,
      titleCn: formData.get("titleCn") as string,
      slugCn: formData.get("slugCn") as string,
      descriptionCn: formData.get("descriptionCn") as string,
      titleRs: formData.get("titleRs") as string,
      slugRs: formData.get("slugRs") as string,
      descriptionRs: formData.get("descriptionRs") as string,
      author: formData.get("author") as string,
      tags: JSON.parse(formData.get('tags') as string),
      source: formData.get("source") as string,
      image: imgurl,
      visitCount: 0, // Inisialisasi visitCount
    };

    // Validasi data
    if ( !blogData.titleEn || !blogData.slugEn || !blogData.descriptionEn || !blogData.image || !blogData.author || blogData.tags.length === 0 ) {
      return NextResponse.json(
        { success: false, msg: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    // Simpan data blog ke database
    await BlogModel.create(blogData);
    console.log("Press Tersimpan:", blogData);

    return NextResponse.json({ success: true, msg: "Press Berhasil ditambahkan" });
  } catch (error) {
    console.error("Error saat menyimpan press:", error);
    return NextResponse.json(
      { success: false, msg: "Terjadi kesalahan saat menambahkan press." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest){
  const id = await request.nextUrl.searchParams.get('id');
  const blog = await BlogModel.findById(id);
  fs.unlink(`./public${blog.image}`, ()=> {})
  await BlogModel.findByIdAndDelete(id);
  return NextResponse.json({msg: "Blog terhapus"});
}

// Tambahkan endpoint untuk menginkrementasi visitCount
export async function PATCH(request: NextRequest) {
  try {
    const { id } = await request.json();
    const blog = await BlogModel.findById(id);
    if (!blog) {
      return NextResponse.json({ success: false, msg: "Blog tidak ditemukan." }, { status: 404 });
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