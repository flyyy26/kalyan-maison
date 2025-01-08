import { ConnectDB } from "@/app/lib/config/db";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import BlogModel from "@/app/lib/models/blogModel";

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
      description: formData.get("description") as string,
      image: imgurl,
    };

    // Validasi data
    if (!blogData.title || !blogData.description || !blogData.image) {
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
