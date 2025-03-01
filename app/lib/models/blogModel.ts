import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    titleEn:{
        type:String,
        required:true
    },
    slugEn:{
        type:String,
        required:true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    video:{
        type:String,
        required:false
    },
    author:{
        type:String,
        required:true
    },
    tags: { 
        type: [String], 
        required: false 
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

const BlogModel = mongoose.models.blog || mongoose.model('blog', Schema);

export default BlogModel;