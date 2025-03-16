import { ConnectDB } from "@/app/lib/config/db";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import BlogModel from "@/app/lib/models/blogModel";
import fs from 'fs';

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
    const timestamp = Date.now();

    // Ambil file gambar
    const image = formData.get("image") as File | null;
    if (!image) {
      return NextResponse.json(
        { success: false, msg: "Gambar tidak ditemukan dalam form data." },
        { status: 400 }
      );
    }

    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);

    // Tentukan path dan URL gambar
    const path = `./public/${timestamp}_${image.name}`;
    await writeFile(path, buffer);
    const imgurl = `/${timestamp}_${image.name}`;

    // Siapkan data blog
    const blogData = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      titleEn: formData.get("titleEn") as string,
      slugEn: formData.get("slugEn") as string,
      description: formData.get("description") as string,
      descriptionEn: formData.get("descriptionEn") as string,
      author: formData.get("author") as string,
      tags: JSON.parse(formData.get('tags') as string),
      image: imgurl,
      visitCount: 0, // Inisialisasi visitCount
    };

    // Validasi data
    if (!blogData.title || !blogData.slug || !blogData.titleEn || !blogData.slugEn || !blogData.description || !blogData.descriptionEn || !blogData.image || !blogData.author || blogData.tags.length === 0 ) {
      return NextResponse.json(
        { success: false, msg: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    // Simpan data blog ke database
    await BlogModel.create(blogData);
    console.log("Blog Tersimpan:", blogData);

    return NextResponse.json({ success: true, msg: "Blog Berhasil ditambahkan" });
  } catch (error) {
    console.error("Error saat menyimpan blog:", error);
    return NextResponse.json(
      { success: false, msg: "Terjadi kesalahan saat menambahkan blog." },
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