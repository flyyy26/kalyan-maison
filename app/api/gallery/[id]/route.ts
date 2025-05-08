import { ConnectDB } from "@/app/lib/config/db";
import { NextRequest, NextResponse } from "next/server";
import GalleryModel from "@/app/lib/models/galleryModel"
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params; // Tambahkan `await` sebelum `context.params`

    if (!id) {
        return NextResponse.json({ message: "Invalid blog ID" }, { status: 400 });
    }

    try {
        const blog = await GalleryModel.findById(id);
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
  
      const galleryId = formData.get("_id") as string;
      const imageGallery = JSON.parse(formData.get("imageGallery") as string);
      const videoGallery = JSON.parse(formData.get("videoGallery") as string);
  
      const imageGalleryFiles = formData.getAll("imageGalleries") as File[];
      const videoGalleryFiles = formData.getAll("videoGalleries") as File[];
  
      // 🔹 Upload image files
      const newImageUrls = await Promise.all(
        imageGalleryFiles.map(async (file) => {
          const buffer = Buffer.from(await file.arrayBuffer());
          const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
          const uploadResult = await cloudinary.uploader.upload(base64, {
            folder: "gallery/image",
          });
          return uploadResult.secure_url;
        })
      );
  
      // 🔹 Upload video files via streaming
      async function uploadVideoFileToCloudinary(file: File): Promise<string> {
        const buffer = Buffer.from(await file.arrayBuffer());
  
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: "video",
              folder: "gallery/video",
            },
            (error, result) => {
              if (error || !result?.secure_url) {
                reject(
                  new Error(
                    `❌ Gagal upload video: ${file.name} | ${error?.message}`
                  )
                );
              } else {
                resolve(result.secure_url);
              }
            }
          );
  
          streamifier.createReadStream(buffer).pipe(stream);
        });
      }
  
      const newVideoUrls = await Promise.all(
        videoGalleryFiles.map(uploadVideoFileToCloudinary)
      );
  
      // 🔹 Combine URL lama dan baru
      const finalImageGallery = [
        ...imageGallery.filter((item: string) => !!item),
        ...newImageUrls,
      ];
  
      const finalVideoGallery = [
        ...videoGallery.filter((item: string) => item && !item.startsWith("__file__")),
        ...newVideoUrls,
      ];
  
      // 🔹 Update ke MongoDB
      const updated = await GalleryModel.findByIdAndUpdate(
        galleryId,
        {
          imageGallery: finalImageGallery,
          videoGallery: finalVideoGallery,
        },
        { new: true }
      );
  
      if (!updated) {
        throw new Error("Galeri tidak ditemukan");
      }
  
      return NextResponse.json({
        success: true,
        msg: "Galeri berhasil diperbarui",
      });
    } catch (error) {
      console.error("❌ Error saat update galeri:", error);
      return NextResponse.json(
        { success: false, msg: "Gagal memperbarui galeri." },
        { status: 500 }
      );
    }
  }