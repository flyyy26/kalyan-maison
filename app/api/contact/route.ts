import { NextResponse } from "next/server";
import ContactModel from "@/app/lib/models/contactModel";

export async function PUT(request: Request) {
    try {
      const formData = await request.formData();
      const contactId = formData.get("_id");
  
      if (!contactId) {
        return NextResponse.json({ success: false, msg: "ID blog diperlukan." }, { status: 400 });
      }
  
      const contact = await ContactModel.findById(contactId);
      if (!contact) {
        return NextResponse.json({ success: false, msg: "contact tidak ditemukan." }, { status: 404 });
      }
  
      // Perbarui data contact
      contact.facebook = formData.get("facebook") as string;
      contact.instagram = formData.get("instagram") as string;
      contact.tiktok = formData.get("tiktok") as string;
      contact.whatsapp = formData.get("whatsapp") as string;
      contact.youtube = formData.get("youtube") as string;
      contact.email = formData.get("email") as string;
  
      await contact.save();
  
      return NextResponse.json({ success: true, msg: "Blog Berhasil diperbarui" });
    } catch (error) {
      console.error("Error saat memperbarui blog:", error);
      return NextResponse.json(
        { success: false, msg: "Terjadi kesalahan saat memperbarui blog." },
        { status: 500 }
      );
    }
  }
  
export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        // Siapkan data contact
        const reservationData = {
            facebook: formData.get('facebook') as string,
            instagram: formData.get('instagram') as string,
            tiktok: formData.get('tiktok') as string,
            whatsapp: formData.get('whatsapp') as string,
            youtube: formData.get('youtube') as string,
            email: formData.get('email') as string,
        };
        // Simpan data contact ke database
        await ContactModel.create(reservationData);

        return NextResponse.json({ success: true, msg: "Contact Berhasil ditambahkan" });
    } catch (error) {
        console.error("Error saat menyimpan Contact:", error);
        return NextResponse.json(
            { success: false, msg: "Terjadi kesalahan saat menambahkan Contact." },
            { status: 500 }
        );
    }
}