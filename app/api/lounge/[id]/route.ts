import { writeFile, unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import LoungeModel from "@/app/lib/models/loungeModel";
import { ConnectDB } from "@/app/lib/config/db";
import path from "path";
import fs from "fs/promises";

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

    const timestamp = Date.now();
    const banner = formData.get("banner");
    let bannerUrl = lounge.banner;

    // Cek apakah banner adalah file sebelum diproses
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

    const logo = formData.get("logo");
    let logoUrl = lounge.logo;

    // Cek apakah logo adalah file sebelum diproses
    if (logo instanceof File) {
      const logoByteData = await logo.arrayBuffer();
      const buffer = Buffer.from(logoByteData);
      const newPath = `./public/${timestamp}_${logo.name}`;
      await writeFile(newPath, buffer);
      logoUrl = `/${timestamp}_${logo.name}`;

      // Hapus gambar lama jika ada
      if (lounge.logo) {
        const oldLoungePath = `./public${lounge.logo}`;
        await unlink(oldLoungePath).catch(() => {});
      }
    }

    const taglineBanner = formData.get("taglineBanner");
    let taglineBannerUrl = lounge.taglineBanner;

    // Cek apakah taglineBanner adalah file sebelum diproses
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


    const slides = lounge.imageSlide || [];

    const slidesString = formData.get("imageSlide") as string;
    let newSlides = slidesString ? JSON.parse(slidesString) : [];
    const imageSlideFiles = formData.getAll("imageSlide[]") as File[];

    console.log("🔍 Data yang diterima:", newSlides);
    console.log("📂 File yang diupload:", imageSlideFiles.map((file) => file.name));

    // 🔹 Buat mapping file berdasarkan indeks "__file__X"
    const fileIndexMapSlide: { [key: number]: File } = {};
    newSlides.forEach((slide: { image: string }) => {
      if (slide.image.startsWith("__file__")) {
        const fileIndex = parseInt(slide.image.replace("__file__", ""), 10);
        const file = imageSlideFiles.shift();
        if (file) {
          fileIndexMapSlide[fileIndex] = file;
        }
      }
    });

    newSlides = await Promise.all(
      newSlides.map(async (slide: { image: string }, index: number) => {
        if (typeof slide.image === "string" && slide.image.startsWith("__file__")) {
          const file = fileIndexMapSlide[index]; // Ambil file berdasarkan index yang sesuai

          if (file) {
            const filePath = `/${timestamp}_${file.name}`;
            const buffer = Buffer.from(await file.arrayBuffer());

            // 🔹 Hapus file lama jika ada
            if (slides[index]?.image && slides[index].image.startsWith("/")) {
              const oldFilePath = path.join(process.cwd(), "public", slides[index].image);
              try {
                await fs.unlink(oldFilePath);
                console.log(`🗑️ File lama dihapus: ${oldFilePath}`);
              } catch (err) {
                if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
                  console.error(`❌ Gagal menghapus file lama: ${oldFilePath}`, err);
                }
              }
            }

            // 🔹 Simpan file baru
            await fs.writeFile(path.join(process.cwd(), "public", filePath), buffer);
            console.log(`✅ File baru disimpan: ${filePath}`);

            return { ...slide, image: filePath }; // Update dengan path file baru
          } else {
            console.warn(`⚠️ File tidak ditemukan untuk index ${index}.`);
          }
        }

        return slide;
      })
    );

    // INI UNTUK SPACES
    
    const spaces = lounge.spaces || [];

    const spacesString = formData.get("spaces") as string;
    let newSpaces = spacesString ? JSON.parse(spacesString) : [];
    const imageSpaceFiles = formData.getAll("imageSpaces[]") as File[];

    console.log("🔍 Data yang diterima:", newSpaces);
    console.log("📂 File yang diupload:", imageSpaceFiles.map((file) => file.name));

    // 🔹 Buat mapping file berdasarkan indeks "__file__X"
    const fileIndexMap: { [key: number]: File } = {};
    newSpaces.forEach((space: { image: string }) => {
      if (space.image.startsWith("__file__")) {
        const fileIndex = parseInt(space.image.replace("__file__", ""), 10);
        const file = imageSpaceFiles.shift();
        if (file) {
          fileIndexMap[fileIndex] = file;
        }
      }
    });

    newSpaces = await Promise.all(
      newSpaces.map(async (space: { image: string }, index: number) => {
        if (typeof space.image === "string" && space.image.startsWith("__file__")) {
          const file = fileIndexMap[index]; // Ambil file berdasarkan index yang sesuai

          if (file) {
            const filePath = `/${timestamp}_${file.name}`;
            const buffer = Buffer.from(await file.arrayBuffer());

            // 🔹 Hapus file lama jika ada
            if (spaces[index]?.image && spaces[index].image.startsWith("/")) {
              const oldFilePath = path.join(process.cwd(), "public", spaces[index].image);
              try {
                await fs.unlink(oldFilePath);
                console.log(`🗑️ File lama dihapus: ${oldFilePath}`);
              } catch (err) {
                if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
                  console.error(`❌ Gagal menghapus file lama: ${oldFilePath}`, err);
                }
              }
            }

            // 🔹 Simpan file baru
            await fs.writeFile(path.join(process.cwd(), "public", filePath), buffer);
            console.log(`✅ File baru disimpan: ${filePath}`);

            return { ...space, image: filePath }; // Update dengan path file baru
          } else {
            console.warn(`⚠️ File tidak ditemukan untuk index ${index}.`);
          }
        }

        return space;
      })
    );

    const menu = lounge.menu || [];

    const menuString = formData.get("menu") as string;
    let newMenu = menuString ? JSON.parse(menuString) : [];
    const imageMenuFiles = formData.getAll("menu[]") as File[];

    console.log("🔍 Data yang diterima:", newMenu);
    console.log("📂 File yang diupload:", imageMenuFiles.map((file) => file.name));

    // 🔹 Buat mapping file berdasarkan indeks "__file__X"
    const fileIndexMapMenu: { [key: number]: File } = {};
    newMenu.forEach((item: { image: string }) => {
      if (item.image.startsWith("__file__")) {
        const fileIndex = parseInt(item.image.replace("__file__", ""), 10);
        const file = imageMenuFiles.shift();
        if (file) {
          fileIndexMapMenu[fileIndex] = file;
        }
      }
    });

    newMenu = await Promise.all(
      newMenu.map(async (item: { image: string }, index: number) => {
        if (typeof item.image === "string" && item.image.startsWith("__file__")) {
          const file = fileIndexMapMenu[index]; // Ambil file berdasarkan index yang sesuai

          if (file) {
            const filePath = `/${timestamp}_${file.name}`;
            const buffer = Buffer.from(await file.arrayBuffer());

            // 🔹 Hapus file lama jika ada
            if (menu[index]?.image && menu[index].image.startsWith("/")) {
              const oldFilePath = path.join(process.cwd(), "public", menu[index].image);
              try {
                await fs.unlink(oldFilePath);
                console.log(`🗑️ File lama dihapus: ${oldFilePath}`);
              } catch (err) {
                if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
                  console.error(`❌ Gagal menghapus file lama: ${oldFilePath}`, err);
                }
              }
            }

            // 🔹 Simpan file baru
            await fs.writeFile(path.join(process.cwd(), "public", filePath), buffer);
            console.log(`✅ File baru disimpan: ${filePath}`);

            return { ...item, image: filePath }; // Update dengan path file baru
          } else {
            console.warn(`⚠️ File tidak ditemukan untuk index ${index}.`);
          }
        }

        return item;
      })
    );


    // Update lounge dengan data baru
    lounge.name = formData.get("name") as string;
    lounge.slug = formData.get("slug") as string;
    lounge.phone = formData.get("phone") as string;
    lounge.city = formData.get("city") as string;
    lounge.day = formData.get("day") as string;
    lounge.time = formData.get("time") as string;
    lounge.taglineId = formData.get("taglineId") as string;
    lounge.taglineEn = formData.get("taglineEn") as string;
    lounge.imageSlide = newSlides;
    lounge.spaces = newSpaces;
    lounge.menu = newMenu;
    lounge.banner = bannerUrl;
    lounge.logo = logoUrl;
    lounge.taglineBanner = taglineBannerUrl;

    await lounge.save();

    return NextResponse.json({
      success: true,
      msg: "Lounge Berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error saat memperbarui lounge:", error);
    const errorMessage = (error as Error).message;
    return NextResponse.json(
      { success: false, msg: `Terjadi kesalahan saat memperbarui lounge: ${errorMessage}` },
      { status: 500 }
    );
  }
}
