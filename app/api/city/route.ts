import { ConnectDB } from "@/app/lib/config/db";
import { NextRequest, NextResponse } from "next/server";
import CityModel from "@/app/lib/models/cityModel";

const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

export async function GET() {
  const cities = await CityModel.find({});
  console.log("City GET Hit");
  return NextResponse.json({ cities });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Siapkan data blog
    const cityData = {
      name: formData.get("name") as string,
    };

    // Validasi data
    if (!cityData.name) {
      return NextResponse.json(
        { success: false, msg: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    // Simpan data blog ke database
    await CityModel.create(cityData);
    console.log("City Tersimpan:", cityData);

    return NextResponse.json({ success: true, msg: "City Berhasil ditambahkan" });
  } catch (error) {
    console.error("Error saat menyimpan city:", error);
    return NextResponse.json(
      { success: false, msg: "Terjadi kesalahan saat menambahkan city." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest){
  const id = await request.nextUrl.searchParams.get('id');
  await CityModel.findByIdAndDelete(id);
  return NextResponse.json({msg: "City terhapus"});
}