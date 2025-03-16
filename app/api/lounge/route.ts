import { ConnectDB } from "@/app/lib/config/db";
import { NextRequest, NextResponse } from "next/server";
import { unlink, writeFile } from "fs/promises";
import LoungeModel from "@/app/lib/models/loungeModel";
import CityModel from "@/app/lib/models/cityModel"
import fs from 'fs';
import { promisify } from "util";
import path from "path";
const unlinkAsync = promisify(fs.unlink);

const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cityName = searchParams.get("city");

    console.log("City Name:", cityName);

    let lounges;

    if (cityName) {
      // Jika ada cityName, cari kota di database
      const city = await CityModel.findOne({ name: new RegExp(`^${cityName}$`, "i") });

      console.log("Found City:", city);

      if (!city) {
        return NextResponse.json({ success: false, msg: "City not found" }, { status: 404 });
      }

      lounges = await LoungeModel.find({ city: city._id });
    } else {
      // Jika tidak ada cityName, ambil semua lounge
      lounges = await LoungeModel.find({});
    }

    console.log("Found Lounges:", lounges);

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
  
      // Parse imageSlide
      let imageSlide = JSON.parse(formData.get("imageSlide") as string);
      let spaces = JSON.parse(formData.get("spaces") as string);
      let menu = JSON.parse(formData.get("menu") as string);
  
      // 🔹 Proses gambar banner utama
      const banner = formData.get("banner") as File | null;
      if (!banner) {
        return NextResponse.json(
          { success: false, msg: "Gambar banner tidak ditemukan." },
          { status: 400 }
        );
      }
  
      const bannerByteData = await banner.arrayBuffer();
      const buffer = Buffer.from(bannerByteData);
      const path = `./public/${timestamp}_${banner.name}`;
      await writeFile(path, buffer);
      const bannerUrl = `/${timestamp}_${banner.name}`;
  
      // 🔹 Proses taglineBanner
      const taglineBanner = formData.get("taglineBanner") as File | null;
      if (!taglineBanner) {
        return NextResponse.json(
          { success: false, msg: "Gambar tagline banner tidak ditemukan." },
          { status: 400 }
        );
      }
  
      const taglineBannerByteData = await taglineBanner.arrayBuffer();
      const bufferTagline = Buffer.from(taglineBannerByteData);
      const pathTagline = `./public/${timestamp}_${taglineBanner.name}`;
      await writeFile(pathTagline, bufferTagline);
      const taglineBannerUrl = `/${timestamp}_${taglineBanner.name}`;
  
      // 🔹 Proses gambar imageSlide
      const imageSlideFiles = formData.getAll("imageSlides") as File[];
  
      imageSlide = imageSlide.map((slide: { name: string; image: string }, index: number) => {
        if (imageSlideFiles[index]) {
          const file = imageSlideFiles[index];
          const filePath = `./public/${timestamp}_${file.name}`;
  
          // Simpan gambar
          return file.arrayBuffer().then((buffer) => {
            return writeFile(filePath, Buffer.from(buffer)).then(() => {
              return {
                name: slide.name,
                image: `/${timestamp}_${file.name}`, // Simpan path di DB
              };
            });
          });
        }
        return { name: slide.name, image: "" };
      });
  
      // Tunggu semua proses penyimpanan gambar selesai
      imageSlide = await Promise.all(imageSlide);

      const imageSpaceFiles = formData.getAll("imageSpaces") as File[];
  
      spaces = spaces.map((space: { name: string; image: string }, index: number) => {
        if (imageSpaceFiles[index]) {
          const fileSpace = imageSpaceFiles[index];
          const filePathSpace = `./public/${timestamp}_${fileSpace.name}`;
  
          // Simpan gambar
          return fileSpace.arrayBuffer().then((bufferSpaces) => {
            return writeFile(filePathSpace, Buffer.from(bufferSpaces)).then(() => {
              return {
                name: space.name,
                image: `/${timestamp}_${fileSpace.name}`, // Simpan path di DB
              };
            });
          });
        }
        return { name: space.name, image: "" };
      });
  
      // Tunggu semua proses penyimpanan gambar selesai
      spaces = await Promise.all(spaces);

      const imageMenuFiles = formData.getAll("imageMenu") as File[];
  
      menu = menu.map((menu: { name: string; image: string; description: string }, index: number) => {
        if (imageMenuFiles[index]) {
          const fileMenu = imageMenuFiles[index];
          const filePathMenu = `./public/${timestamp}_${fileMenu.name}`;
  
          // Simpan gambar
          return fileMenu.arrayBuffer().then((bufferMenus) => {
            return writeFile(filePathMenu, Buffer.from(bufferMenus)).then(() => {
              return {
                name: menu.name,
                image: `/${timestamp}_${fileMenu.name}`, // Simpan path di DB
                description: menu.description,
              };
            });
          });
        }
        return { name: menu.name, image: "", description: "" };
      });
  
      // Tunggu semua proses penyimpanan gambar selesai
      menu = await Promise.all(menu);
  
      // 🔹 Simpan data lounge ke database
      const loungeData = {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        phone: formData.get("phone") as string,
        address: formData.get("address") as string,
        day: formData.get("day") as string,
        time: formData.get("time") as string,
        city: formData.get("city") as string,
        taglineId: formData.get("taglineId") as string,
        taglineEn: formData.get("taglineEn") as string,
        imageSlide,
        menu,
        spaces,
        banner: bannerUrl,
        taglineBanner: taglineBannerUrl,
      };
  
      // Validasi data
      if (!loungeData.name || !loungeData.slug || !loungeData.address || !loungeData.phone || !loungeData.city || !loungeData.taglineId || !loungeData.taglineEn || !loungeData.banner || !loungeData.day || !loungeData.time || !loungeData.taglineBanner) {
        return NextResponse.json(
          { success: false, msg: "Semua field wajib diisi." },
          { status: 400 }
        );
      }
  
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
  

  export async function DELETE(request: NextRequest) {
    const id = request.nextUrl.searchParams.get("id");
    const lounge = await LoungeModel.findById(id);
  
    if (!lounge) {
      return NextResponse.json({ msg: "Lounge tidak ditemukan" }, { status: 404 });
    }
  
    fs.unlink(`./public${lounge.banner}`, () => {});
    fs.unlink(`./public${lounge.taglineBanner}`, () => {});
  
    await Promise.all([
      lounge.banner && unlinkAsync(`./public${lounge.banner}`).catch(() => {}),
      lounge.taglineBanner && unlinkAsync(`./public${lounge.taglineBanner}`).catch(() => {}),
    ]);
  
    // Hapus semua gambar dalam imageSlideFiles
    if (Array.isArray(lounge.imageSlide)) {
      await Promise.all(
        lounge.imageSlide.map((slide: { name: string; image: string }) =>
          slide.image ? unlinkAsync(`./public${slide.image}`).catch(() => {}) : null
        )
      );
    }

    // Hapus semua gambar dalam imageSlideFiles
    if (Array.isArray(lounge.spaces)) {
      await Promise.all(
        lounge.spaces.map((space: { name: string; image: string }) =>
          space.image ? unlinkAsync(`./public${space.image}`).catch(() => {}) : null
        )
      );
    }

    if (Array.isArray(lounge.menu)) {
      await Promise.all(
        lounge.menu.map((menu: { name: string; image: string; description: string }) =>
          menu.image ? unlinkAsync(`./public${menu.image}`).catch(() => {}) : null
        )
      );
    }

    if (Array.isArray(lounge.imageSlide)) {
      console.log("🔎 lounge.imageSlide:", lounge.imageSlide);
    
      await Promise.all(
        lounge.imageSlide.map(async (slide: { name: string; image: string }) => {
          if (slide.image) {
            const filePath = path.resolve(`./public${slide.image}`);
            try {
              await unlink(filePath);
              console.log(`✅ File terhapus: ${filePath}`);
            } catch (err) {
              if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
                console.error(`❌ Gagal menghapus file: ${filePath}`, err);
              }
            }
          }
        })
      );
    }
  
    await LoungeModel.findByIdAndDelete(id);
    return NextResponse.json({ msg: "Lounge terhapus" });
  }

  