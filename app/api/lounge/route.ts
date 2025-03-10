import { ConnectDB } from "@/app/lib/config/db";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import LoungeModel from "@/app/lib/models/loungeModel";
import CityModel from "@/app/lib/models/cityModel"
import fs from 'fs';

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
        // Jika cityName ada, ambil lounge berdasarkan city
        const city = await CityModel.findOne({ name: cityName });
        if (!city) {
          return NextResponse.json({ success: false, msg: "City not found" }, { status: 404 });
        }
  
        lounges = await LoungeModel.find({ city: city._id }).populate("city");
      } else {
        // Jika tidak ada cityName, ambil semua lounge
        lounges = await LoungeModel.find({});
      }
  
      console.log("Lounge GET Hit");
      return NextResponse.json({ success: true, data: lounges });
    } catch (error) {
      console.error("Error fetching lounges:", error);
      return NextResponse.json({ success: false, msg: "Internal Server Error" }, { status: 500 });
    }
  }

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const timestamp = Date.now();

    // Ambil file gambar
    const banner = formData.get("banner") as File | null;
    if (!banner) {
      return NextResponse.json(
        { success: false, msg: "Gambar tidak ditemukan dalam form data." },
        { status: 400 }
      );
    }

    const bannerByteData = await banner.arrayBuffer();
    const buffer = Buffer.from(bannerByteData);

    // Tentukan path dan URL gambar
    const path = `./public/${timestamp}_${banner.name}`;
    await writeFile(path, buffer);
    const bannerUrl = `/${timestamp}_${banner.name}`;

    const taglineBanner = formData.get("taglineBanner") as File | null;
    if (!taglineBanner) {
      return NextResponse.json(
        { success: false, msg: "Gambar tidak ditemukan dalam form data." },
        { status: 400 }
      );
    }

    const taglineBannerByteData = await taglineBanner.arrayBuffer();
    const bufferTagline = Buffer.from(taglineBannerByteData);

    // Tentukan path dan URL gambar
    const pathTagline = `./public/${timestamp}_${taglineBanner.name}`;
    await writeFile(pathTagline, bufferTagline);
    const taglineBannerUrl = `/${timestamp}_${taglineBanner.name}`;

    // Siapkan data lounge
    const loungeData = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      phone: formData.get("phone") as string,
      city: formData.get("city") as string,
      taglineId: formData.get("taglineId") as string,
      taglineEn: formData.get("taglineEn") as string,
      imageSlide: JSON.parse(formData.get('imageSlide') as string),
      menu: JSON.parse(formData.get('imageSlide') as string),
      spaces: JSON.parse(formData.get('imageSlide') as string),
      banner: bannerUrl,
      taglineBanner: taglineBannerUrl,
    };

    // Validasi data
    if (!loungeData.name || !loungeData.slug || !loungeData.phone || !loungeData.city || !loungeData.taglineId || !loungeData.taglineEn || !loungeData.banner || !loungeData.taglineBanner) {
      return NextResponse.json(
        { success: false, msg: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    // Simpan data lounge ke database
    await LoungeModel.create(loungeData);
    console.log("Lounge Tersimpan:", loungeData);

    return NextResponse.json({ success: true, msg: "Lounge Berhasil ditambahkan" });
  } catch (error) {
    console.error("Error saat menyimpan lounge:", error);
    return NextResponse.json(
      { success: false, msg: "Terjadi kesalahan saat menambahkan lounge." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest){
  const id = await request.nextUrl.searchParams.get('id');
  const lounge = await LoungeModel.findById(id);
  fs.unlink(`./public${lounge.banner}`, ()=> {})
  await LoungeModel.findByIdAndDelete(id);
  return NextResponse.json({msg: "Lounge terhapus"});
}