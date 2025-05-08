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

export async function GET() {
  try {
    const galleries = await GalleryModel.find().sort({ createdAt: -1 }); // terbaru duluan
    return NextResponse.json({ success: true, data: galleries });
  } catch (error) {
    console.error("Error fetching galleries:", error);
    return NextResponse.json({ success: false, msg: "Gagal mengambil data galeri." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Parse JSON data dari form
    let imageGallery = JSON.parse(formData.get("imageGallery") as string);
    const imageGalleryFiles = formData.getAll("imageGalleries") as File[];
    const videoGalleryFiles = formData.getAll("videoGalleries") as File[];

    // 🔹 Upload gambar ke Cloudinary
    imageGallery = await Promise.all(
      imageGalleryFiles.map(async (file: File) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
        const uploadResult = await cloudinary.uploader.upload(base64, {
          folder: "gallery/image",
        });
        return uploadResult.secure_url;
      })
    );

    // 🔹 Fungsi helper untuk upload video via stream
    async function uploadVideoFileToCloudinary(file: File): Promise<string> {
      const buffer = Buffer.from(await file.arrayBuffer());

      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "gallery/video",
          },
          (error, result) => {
            if (error) {
              console.error("❌ Cloudinary upload error:", error);
              reject(error);
            } else if (!result?.secure_url) {
              reject(
                new Error(`❌ Upload video gagal atau tidak mengembalikan secure_url: ${file.name}`)
              );
            } else {
              console.log("✅ Cloudinary video uploaded:", result.secure_url);
              resolve(result.secure_url);
            }
          }
        );

        streamifier.createReadStream(buffer).pipe(stream);
      });
    }

    // 🔹 Upload semua video via streaming
    const uploadedVideoUrls = await Promise.all(
      videoGalleryFiles.map(uploadVideoFileToCloudinary)
    );

    console.log("✅ Image URLs:", imageGallery);
    console.log("✅ Video URLs:", uploadedVideoUrls);

    // 🔹 Simpan ke MongoDB
    await GalleryModel.create({
      imageGallery,
      videoGallery: uploadedVideoUrls,
    });

    return NextResponse.json({
      success: true,
      msg: "Galeri berhasil ditambahkan",
    });
  } catch (error) {
    console.error("❌ Error saat menyimpan galeri:", error);
    return NextResponse.json(
      { success: false, msg: "Terjadi kesalahan saat menambahkan galeri." },
      { status: 500 }
    );
  }
}

function extractPublicId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    
    // Remove version part (e.g., v1746391430)
    const uploadIndex = pathParts.indexOf("upload");
    const publicIdParts = pathParts.slice(uploadIndex + 2); // skip 'upload' and 'vXXX'
    
    const filename = publicIdParts.join("/").replace(/\.[^/.]+$/, ""); // Remove file extension
    return filename;
  } catch {
    return null;
  }
}


export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ msg: "ID tidak diberikan" }, { status: 400 });
    }

    const gallery = await GalleryModel.findById(id);
    if (!gallery) {
      return NextResponse.json({ msg: "Gallery tidak ditemukan" }, { status: 404 });
    }

    // 🔹 Hapus gambar menu (array of string)
    if (Array.isArray(gallery.imageGallery)) {
      await Promise.all(
        gallery.imageGallery.map(async (imageUrl: string) => {
          const publicId = extractPublicId(imageUrl);
          if (publicId) await cloudinary.uploader.destroy(publicId);
        })
      );
    }

    // 🔹 (Opsional) Jika ada otherImages dan juga bertipe string[]
    if (Array.isArray(gallery.videoGallery)) {
      await Promise.all(
        gallery.videoGallery.map(async (imageUrl: string) => {
          const publicId = extractPublicId(imageUrl);
          if (publicId) await cloudinary.uploader.destroy(publicId);
        })
      );
    }

    // 🔹 Hapus data gallery dari database
    await GalleryModel.findByIdAndDelete(id);

    return NextResponse.json({ msg: "gallery terhapus" });
  } catch (error) {
    console.error("Gagal menghapus gallery:", error);
    return NextResponse.json(
      { msg: "Terjadi kesalahan saat menghapus gallery." },
      { status: 500 }
    );
  }
}
