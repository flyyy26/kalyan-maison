import { NextRequest, NextResponse } from "next/server";
import LoungeModel from "@/app/lib/models/loungeModel";
import { ConnectDB } from "@/app/lib/config/db";
import { v2 as cloudinary } from 'cloudinary';
import { extractPublicId } from "@/app/lib/utils/cloudinary";

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
        return NextResponse.json({ message: "Invalid lounge ID" }, { status: 400 });
    }

    try {
        const lounge = await LoungeModel.findById(id);
        if (!lounge) {
            return NextResponse.json({ message: "Lounge not found" }, { status: 404 });
        }
        return NextResponse.json(lounge, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const loungeId = formData.get("_id");

    if (!loungeId) {
      return NextResponse.json(
        { success: false, msg: "ID lounge diperlukan." },
        { status: 400 }
      );
    }

    const lounge = await LoungeModel.findById(loungeId);
    if (!lounge) {
      return NextResponse.json(
        { success: false, msg: "Lounge tidak ditemukan." },
        { status: 404 }
      );
    }

    // 🔹 Handle Banner Upload
    const banner = formData.get("banner");
    let bannerUrl = lounge.banner;

    if (banner instanceof File) {
      const buffer = Buffer.from(await banner.arrayBuffer());
      const base64 = `data:${banner.type};base64,${buffer.toString("base64")}`;

      // Hapus banner lama dari Cloudinary jika ada
      if (lounge.banner) {
        const oldPublicId = extractPublicId(lounge.banner);
        if (oldPublicId) await cloudinary.uploader.destroy(oldPublicId);
      }

      // Upload baru
      const result = await cloudinary.uploader.upload(base64, {
        folder: 'lounges/banner',
      });
      bannerUrl = result.secure_url;
    }

    // 🔹 Handle Logo Upload
    const logo = formData.get("logo");
    let logoUrl = lounge.logo;

    if (logo instanceof File) {
      const buffer = Buffer.from(await logo.arrayBuffer());
      const base64 = `data:${logo.type};base64,${buffer.toString("base64")}`;

      // Hapus logo lama dari Cloudinary jika ada
      if (lounge.logo) {
        const oldPublicId = extractPublicId(lounge.logo);
        if (oldPublicId) await cloudinary.uploader.destroy(oldPublicId);
      }

      // Upload baru
      const result = await cloudinary.uploader.upload(base64, {
        folder: 'lounges/logo',
      });
      logoUrl = result.secure_url;
    }

    const menuImagesRaw = formData.get("menuImages");
    const otherImagesRaw = formData.get("otherImages");

    const parsedMenuImages = menuImagesRaw ? JSON.parse(menuImagesRaw as string) : [];
    const parsedOtherImages = otherImagesRaw ? JSON.parse(otherImagesRaw as string) : [];

    const imageMenuFiles = formData.getAll("imageMenu") as File[];
    const otherImagesFiles = formData.getAll("otherImageItem") as File[];

    // === Menu Images ===
    let newMenuImages: string[] = [];
    let menuFileIndex = 0;

    newMenuImages = await Promise.all(
      parsedMenuImages.map(async (item: string) => {
        if (item.startsWith("__file__")) {
          const file = imageMenuFiles[menuFileIndex++];
          if (!file) throw new Error("File menu tidak ditemukan pada index yang diharapkan");
    
          const buffer = Buffer.from(await file.arrayBuffer());
          const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
          const uploadResult = await cloudinary.uploader.upload(base64, {
            folder: "lounges/menu",
          });
          return uploadResult.secure_url;
        } else {
          return item;
        }
      })
    );

    // Hapus gambar lama yang tidak digunakan lagi
    const unusedMenuImages = lounge.menuImages.filter((old: string) => !newMenuImages.includes(old));
    await Promise.all(
      unusedMenuImages.map(async (url: string) => {
        const publicId = extractPublicId(url);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      })
    );

    // === Other Images ===
    let newOtherImages: string[] = [];
    let fileUploadIndex = 0;

    newOtherImages = await Promise.all(
      parsedOtherImages.map(async (item: string) => {
        if (item.startsWith("__file__")) {
          const file = otherImagesFiles[fileUploadIndex++];
          if (!file) throw new Error("File tidak ditemukan pada index yang diharapkan");
    
          const buffer = Buffer.from(await file.arrayBuffer());
          const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
          const uploadResult = await cloudinary.uploader.upload(base64, {
            folder: "lounges/other-image",
          });
          return uploadResult.secure_url;
        } else {
          return item;
        }
      })
    );

    // Hapus gambar lama yang tidak digunakan
    const unusedOtherImages = lounge.otherImages.filter((old: string) => !newOtherImages.includes(old));
    await Promise.all(
      unusedOtherImages.map(async (url: string) => {
        const publicId = extractPublicId(url);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      })
    );


    // 🔹 Update data lain
    lounge.name = formData.get("name") as string;
    lounge.maps = formData.get("maps") as string;
    lounge.youtube = formData.get("youtube") as string;
    lounge.instagram = formData.get("instagram") as string;
    lounge.facebook = formData.get("facebook") as string;
    lounge.email = formData.get("email") as string;
    lounge.whatsapp = formData.get("whatsapp") as string;
    lounge.slug = formData.get("slug") as string;
    lounge.phone = formData.get("phone") as string;
    lounge.city = formData.get("city") as string;
    lounge.day = formData.get("day") as string;
    lounge.time = formData.get("time") as string;
    lounge.spaces = JSON.parse(formData.get("spaces") as string);
    lounge.banner = bannerUrl;
    lounge.logo = logoUrl;
    lounge.menuImages = newMenuImages;
    lounge.otherImages = newOtherImages;

    await lounge.save();

    return NextResponse.json({
      success: true,
      msg: "Lounge Berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error saat memperbarui lounge:", error);
    const errorMessage = (error as Error).message;
    return NextResponse.json(
      { success: false, msg: `Terjadi kesalahan: ${errorMessage}` },
      { status: 500 }
    );
  }
}