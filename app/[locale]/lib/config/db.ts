import mongoose from "mongoose";

export const ConnectDB = async () => {
    await mongoose.connect('mongodb+srv://rafliuser:mhmdrfli09@cluster0.lzj09.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('db connected')
}