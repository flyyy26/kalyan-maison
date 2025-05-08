import { ConnectDB } from "@/app/lib/config/db";
import { NextRequest, NextResponse } from "next/server";
import ReservationModel from "@/app/lib/models/reserveModel";

const LoadDB = async () => {
    await ConnectDB();
};

LoadDB();

export async function GET() {
    const reserves = await ReservationModel.find({});
    console.log("Reserve GET Hit");
    return NextResponse.json({ reserves });
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        // Siapkan data reservasi
        const reservationData = {
            name: formData.get('name') as string,
            phoneNumber: formData.get('phoneNumber') as string,
            lounge: formData.get('lounge') as string,
            space: formData.get('space') as string,
            date: formData.get('date') as string,
            time: formData.get('time') as string,
            duration: formData.get('duration') as string,
            person: formData.get('person') as string,
        };

        // Cek field mana yang kosong
        const emptyFields = Object.entries(reservationData)
            .filter(([, value]) => !value) // Filter yang kosong
            .map(([key, ]) => key); // Ambil nama field

        if (emptyFields.length > 0) {
            console.warn("Field kosong:", emptyFields); // Log untuk debugging
            return NextResponse.json(
                { success: false, msg: `Field berikut wajib diisi: ${emptyFields.join(", ")}` },
                { status: 400 }
            );
        }

        // Simpan data reservasi ke database
        await ReservationModel.create(reservationData);

        return NextResponse.json({ success: true, msg: "Reservasi Berhasil ditambahkan" });
    } catch (error) {
        console.error("Error saat menyimpan reservasi:", error);
        return NextResponse.json(
            { success: false },
            { status: 500 }
        );
    }
}


export async function DELETE(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
        return NextResponse.json({ success: false, msg: "ID tidak ditemukan." }, { status: 400 });
    }

    try {
        const reservation = await ReservationModel.findByIdAndDelete(id);
        if (!reservation) {
            return NextResponse.json({ success: false, msg: "Reservasi tidak ditemukan." }, { status: 404 });
        }

        return NextResponse.json({ success: true, msg: "Reservasi terhapus." });
    } catch (error) {
        console.error("Error saat menghapus reservasi:", error);
        return NextResponse.json({ success: false, msg: "Terjadi kesalahan saat menghapus reservasi." }, { status: 500 });
    }
}