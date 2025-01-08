import { ConnectDB } from "@/app/lib/config/db"
import { NextResponse } from "next/server"
import { writeFile } from "fs/promises";
import BlogModel from "@/app/lib/models/blogModel";

const LoadDB = async () => {
  await ConnectDB();
}

LoadDB();

export async function GET(){
  const blogs = await BlogModel.find({});
  console.log("Blog GET Hit")
  return NextResponse.json({blogs})
}

export async function POST(request: { formData: () => any; }){
  const formData = await request.formData();
  const timestamp = Date.now();

  const image = formData.get('image');
  const imageByteData = await image.arrayBuffer();
  const buffer = Buffer.from(imageByteData);

  const path = `./public/${timestamp}_${image.name}`;
  await writeFile(path, buffer);
  const imgurl = `/${timestamp}_${image.name}`;

    const blogData = {
      title: `${formData.get('title')}`,
      description: `${formData.get('description')}`,
      image: `${imgurl}`,
    }

    await BlogModel.create(blogData);
    console.log('Blog Tersimpan')

  console.log(imgurl)
  return NextResponse.json({success: true, msg: "Blog Berhasil ditambahkan"})
}