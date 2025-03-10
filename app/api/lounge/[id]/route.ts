import { writeFile, unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import LoungeModel from "@/app/lib/models/loungeModel";

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
        return NextResponse.json({ success: false, msg: "ID lounge diperlukan." }, { status: 400 });
      }
  
      const lounge = await LoungeModel.findById(loungeId);
      if (!lounge) {
        return NextResponse.json({ success: false, msg: "Lounge tidak ditemukan." }, { status: 404 });
      }
  
      const timestamp = Date.now();
      const banner = formData.get("banner");
      let bannerUrl = lounge.banner;
  
      // Cek apakah banner adalah File sebelum memprosesnya
      if (banner instanceof File) {
        const bannerByteData = await banner.arrayBuffer();
        const buffer = Buffer.from(bannerByteData);
        const newPath = `./public/${timestamp}_${banner.name}`;
        await writeFile(newPath, buffer);
        bannerUrl = `/${timestamp}_${banner.name}`;
  
        // Hapus gambar lama jika ada
        if (lounge.banner) {
          const oldLoungePath = `./public${lounge.banner}`;
          await unlink(oldLoungePath).catch(() => {});
        }
      }
      
      const taglineBanner = formData.get("taglineBanner");
      let taglineBannerUrl = lounge.taglineBanner;
  
      // Cek apakah taglineBanner adalah File sebelum memprosesnya
      if (taglineBanner instanceof File) {
        const taglineBannerByteData = await taglineBanner.arrayBuffer();
        const bufferTagline = Buffer.from(taglineBannerByteData);
        const pathTagline = `./public/${timestamp}_${taglineBanner.name}`;
        await writeFile(pathTagline, bufferTagline);
        taglineBannerUrl = `/${timestamp}_${taglineBanner.name}`;
  
        // Hapus gambar lama jika ada
        if (lounge.taglineBanner) {
          const oldLoungePath = `./public${lounge.taglineBanner}`;
          await unlink(oldLoungePath).catch(() => {});
        }
      }
  
      // Perbarui data blog
      lounge.name= formData.get("name") as string;
      lounge.slug= formData.get("slug") as string;
      lounge.phone= formData.get("phone") as string;
      lounge.city= formData.get("city") as string;
      lounge.taglineId= formData.get("taglineId") as string;
      lounge.taglineEn= formData.get("taglineEn") as string;
      lounge.imageSlide= JSON.parse(formData.get('imageSlide') as string);
      lounge.menu= JSON.parse(formData.get('menu') as string);
      lounge.spaces= JSON.parse(formData.get('spaces') as string);
      lounge.banner= bannerUrl;
      lounge.taglineBanner= taglineBannerUrl;
  
      await lounge.save();
  
      return NextResponse.json({ success: true, msg: "Blog Berhasil diperbarui" });
    } catch (error) {
      console.error("Error saat memperbarui blog:", error);
      return NextResponse.json(
        { success: false, msg: "Terjadi kesalahan saat memperbarui blog." },
        { status: 500 }
      );
    }
  }
  
