import { ConnectDB } from "@/app/lib/config/db";
import { NextRequest, NextResponse } from "next/server";
import LoungeModel from "@/app/lib/models/loungeModel";
import CityModel from "@/app/lib/models/cityModel"
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cityName = searchParams.get("city");

    let lounges;

    if (cityName) {
      // Jika ada cityName, cari kota di database
      const city = await CityModel.findOne({ name: new RegExp(`^${cityName}$`, "i") });

      if (!city) {
        return NextResponse.json({ success: false, msg: "City not found" }, { status: 404 });
      }

      lounges = await LoungeModel.find({ city: city._id });
    } else {
      // Jika tidak ada cityName, ambil semua lounge
      lounges = await LoungeModel.find({});
    }

    return NextResponse.json({ success: true, data: lounges });
  } catch (error) {
    console.error("Error fetching lounges:", error);
    return NextResponse.json({ success: false, msg: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    let menuImages = JSON.parse(formData.get("menuImages") as string);
    let otherImages = JSON.parse(formData.get("otherImages") as string);

    // === Handle Banner Upload to Cloudinary ===
    const banner = formData.get("banner") as File | null;
    if (!banner) {
      return NextResponse.json(
        { success: false, msg: "Gambar banner tidak ditemukan." },
        { status: 400 }
      );
    }
    const bannerBuffer = Buffer.from(await banner.arrayBuffer());
    const bannerBase64 = `data:${banner.type};base64,${bannerBuffer.toString("base64")}`;
    const bannerUpload = await cloudinary.uploader.upload(bannerBase64, {
      folder: "lounges/banner",
    });

    // === Handle Logo Upload to Cloudinary ===
    const logo = formData.get("logo") as File | null;
    if (!logo) {
      return NextResponse.json(
        { success: false, msg: "Gambar logo tidak ditemukan." },
        { status: 400 }
      );
    }
    const logoBuffer = Buffer.from(await logo.arrayBuffer());
    const logoBase64 = `data:${logo.type};base64,${logoBuffer.toString("base64")}`;
    const logoUpload = await cloudinary.uploader.upload(logoBase64, {
      folder: "lounges/logo",
    });

    // === Handle Menu Images ===
    const imageMenuFiles = formData.getAll("imageMenu") as File[];

    menuImages = await Promise.all(
      imageMenuFiles.map(async (file: File) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
        const uploadResult = await cloudinary.uploader.upload(base64, {
          folder: "lounges/menu",
        });
        return uploadResult.secure_url; // ⬅️ Langsung kembalikan URL string saja
      })
    );    

    const otherImagesFiles = formData.getAll("otherImageItem") as File[];

    otherImages = await Promise.all(
      otherImagesFiles.map(async (file: File) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
        const uploadResult = await cloudinary.uploader.upload(base64, {
          folder: "lounges/other-image",
        });
        return uploadResult.secure_url; // ⬅️ Langsung kembalikan URL string saja
      })
    );    

    // === Save Lounge Data ===
    const loungeData = {
      name: formData.get("name") as string,
      maps: formData.get("maps") as string,
      instagram: formData.get("instagram") as string,
      facebook: formData.get("facebook") as string,
      email: formData.get("email") as string,
      whatsapp: formData.get("whatsapp") as string,
      youtube: formData.get("youtube") as string,
      slug: formData.get("slug") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      day: formData.get("day") as string,
      time: formData.get("time") as string,
      city: formData.get("city") as string,
      spaces: JSON.parse(formData.get('spaces') as string),
      menuImages,
      otherImages,
      banner: bannerUpload.secure_url,
      logo: logoUpload.secure_url,
    };

    if (!loungeData.name || !loungeData.slug || !loungeData.address || !loungeData.phone || !loungeData.city || !loungeData.banner || !loungeData.logo || !loungeData.day || !loungeData.time) {
      return NextResponse.json(
        { success: false, msg: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    await LoungeModel.create(loungeData);

    return NextResponse.json({ success: true, msg: "Lounge Berhasil ditambahkan" });
  } catch (error) {
    console.error("Error saat menyimpan lounge:", error);
    return NextResponse.json(
      { success: false, msg: "Terjadi kesalahan saat menambahkan lounge." },
      { status: 500 }
    );
  }
}
  

function extractPublicId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/"); // ['','image','upload','v1746391430','lounges','menu','filename.png']
    
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

    const lounge = await LoungeModel.findById(id);
    if (!lounge) {
      return NextResponse.json({ msg: "Lounge tidak ditemukan" }, { status: 404 });
    }

    // 🔹 Hapus banner dari Cloudinary
    if (lounge.banner) {
      const publicId = extractPublicId(lounge.banner);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    // 🔹 Hapus logo dari Cloudinary
    if (lounge.logo) {
      const publicId = extractPublicId(lounge.logo);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    // 🔹 Hapus gambar menu (array of string)
    if (Array.isArray(lounge.menuImages)) {
      await Promise.all(
        lounge.menuImages.map(async (imageUrl: string) => {
          const publicId = extractPublicId(imageUrl);
          if (publicId) await cloudinary.uploader.destroy(publicId);
        })
      );
    }

    // 🔹 (Opsional) Jika ada otherImages dan juga bertipe string[]
    if (Array.isArray(lounge.otherImages)) {
      await Promise.all(
        lounge.otherImages.map(async (imageUrl: string) => {
          const publicId = extractPublicId(imageUrl);
          if (publicId) await cloudinary.uploader.destroy(publicId);
        })
      );
    }

    // 🔹 Hapus data lounge dari database
    await LoungeModel.findByIdAndDelete(id);

    return NextResponse.json({ msg: "Lounge terhapus" });
  } catch (error) {
    console.error("Gagal menghapus lounge:", error);
    return NextResponse.json(
      { msg: "Terjadi kesalahan saat menghapus lounge." },
      { status: 500 }
    );
  }
}
