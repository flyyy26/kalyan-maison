import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    title:{
        type:String,
        required:true
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