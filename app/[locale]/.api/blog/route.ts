// import { ConnectDB } from "@/app/[locale]/lib/config/db";
// import { NextRequest, NextResponse } from "next/server";
// import { writeFile } from "fs/promises";
// import BlogModel from "@/app/[locale]/lib/models/blogModel";
// import fs from 'fs';

// const LoadDB = async () => {
//   await ConnectDB();
// };

// LoadDB();

// export async function GET() {
//   const blogs = await BlogModel.find({});
//   console.log("Blog GET Hit");
//   return NextResponse.json({ blogs });
// }

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();
//     const timestamp = Date.now();

//     // Ambil file gambar
//     const image = formData.get("image") as File | null;
//     if (!image) {
//       return NextResponse.json(
//         { success: false, msg: "Gambar tidak ditemukan dalam form data." },
//         { status: 400 }
//       );
//     }

//     const video = formData.get("video") as File | null;

//     // Jika video tidak ada, abaikan proses penyimpanan video
//     let videourl = null;
//     if (video) {
//       const videoByteData = await video.arrayBuffer();
//       const bufferVideo = Buffer.from(videoByteData);
    
//       // Tentukan path dan URL video
//       const pathVideo = `./public/${timestamp}_${video.name}`;
//       await writeFile(pathVideo, bufferVideo);
//       videourl = `/${timestamp}_${video.name}`;
//     } else {
//       console.log("Video tidak ditemukan, tetapi ini tidak wajib.");
//     }


//     const imageByteData = await image.arrayBuffer();
//     const buffer = Buffer.from(imageByteData);

//     // Tentukan path dan URL gambar
//     const path = `./public/${timestamp}_${image.name}`;
//     await writeFile(path, buffer);
//     const imgurl = `/${timestamp}_${image.name}`;

//     // const videoByteData = await video.arrayBuffer();
//     // const bufferVideo = Buffer.from(videoByteData);

//     // // Tentukan path dan URL gambar
//     // const pathVideo = `./public/${timestamp}_${video.name}`;
//     // await writeFile(pathVideo, bufferVideo);
//     // const videourl = `/${timestamp}_${video.name}`;

//     // Siapkan data blog
//     const blogData = {
//       title: formData.get("title") as string,
//       description: formData.get("description") as string,
//       author: formData.get("author") as string,
//       tags: JSON.parse(formData.get('tags') as string),
//       image: imgurl,
//       video:videourl,
//     };

//     // Validasi data
//     if (!blogData.title || !blogData.description || !blogData.image || !blogData.author || blogData.tags.length === 0 ) {
//       return NextResponse.json(
//         { success: false, msg: "Semua field wajib diisi." },
//         { status: 400 }
//       );
//     }

//     // Simpan data blog ke database
//     await BlogModel.create(blogData);
//     console.log("Blog Tersimpan:", blogData);

//     return NextResponse.json({ success: true, msg: "Blog Berhasil ditambahkan" });
//   } catch (error) {
//     console.error("Error saat menyimpan blog:", error);
//     return NextResponse.json(
//       { success: false, msg: "Terjadi kesalahan saat menambahkan blog." },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(request: NextRequest){
//   const id = await request.nextUrl.searchParams.get('id');
//   const blog = await BlogModel.findById(id);
//   fs.unlink(`./public${blog.image}`, ()=> {})
//   fs.unlink(`./public${blog.video}`, ()=> {})
//   await BlogModel.findByIdAndDelete(id);
//   return NextResponse.json({msg: "Blog terhapus"});
// }