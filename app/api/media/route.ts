// import { ConnectDB } from "@/app/lib/config/db";
import { ConnectDB } from "@/app/lib/config/db";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import MediaModel from "@/app/lib/models/mediaModel";
import fs from 'fs';

const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

export async function GET() {
  const media = await MediaModel.find({});
  console.log("Media GET Hit");
  return NextResponse.json({ media });
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
  
      // Tentukan path penyimpanan
      const filename = `${timestamp}_${image.name}`;
      const path = `./public/${timestamp}_${image.name}`;
      await writeFile(path, buffer);

      const fullImageUrl = `http://localhost:3000/${filename}`;
    // const mediaData = await MediaModel.create({ image: fullImageUrl, link });
  
      // Simpan ke database
      const mediaData = await MediaModel.create({ image: fullImageUrl });
  
      return NextResponse.json({ success: true, msg: "Media berhasil ditambahkan", data: mediaData });
    } catch (error) {
      console.error("Error saat menyimpan media:", error);
      return NextResponse.json(
        { success: false, msg: "Terjadi kesalahan saat menambahkan media." },
        { status: 500 }
      );
    }
  }

export async function DELETE(request: NextRequest){
  const id = await request.nextUrl.searchParams.get('id');
  const media = await MediaModel.findById(id);
  fs.unlink(`./public${media.image}`, ()=> {})
  await MediaModel.findByIdAndDelete(id);
  return NextResponse.json({msg: "Media terhapus"});
}