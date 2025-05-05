import mongoose from "mongoose";

const Schema = new mongoose.Schema({
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
    descriptionEn:{
        type:String,
        required:true
    },
    titleCn:{
        type:String,
        required:true
    },
    slugCn:{
        type:String,
        required:true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    descriptionCn:{
        type:String,
        required:true
    },
    titleRs:{
        type:String,
        required:true
    },
    slugRs:{
        type:String,
        required:true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    descriptionRs:{
        type:String,
        required:true
    },
    source:{
        type:String,
        required:false
    },
    image:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    visitCount:{
        type:Number,
        default:0
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