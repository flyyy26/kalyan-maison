import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    image:{
        type:String
    }
})

const MediaModel = mongoose.models.media || mongoose.model('media', Schema);

export default MediaModel;