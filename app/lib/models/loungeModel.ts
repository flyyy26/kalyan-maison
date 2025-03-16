import mongoose, { Schema } from "mongoose";

const LoungeSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    address:{
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
    banner:{
        type:String,
        required:true
    },
    day: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    phone:{
        type:String,
        required:true,
    },
    city:{
        type: Schema.Types.ObjectId,
        required:true,
        ref: "City",
    },
    taglineId:{
        type:String,
        required:false
    },
    taglineEn:{
        type:String,
        required:false
    },
    taglineBanner:{
        type:String,
        required:false
    },
    imageSlide: [{ 
        name: { type: String, required: false }, 
        image: { type: String, required: false } 
    }],
    menu:[{ 
        name: { type: String, required: false }, 
        description: { type: String, required: false }, 
        image: { type: String, required: false } 
    }],
    spaces: [{ 
        name: { type: String, required: false }, 
        image: { type: String, required: false } 
    }],
    date:{
        type:Date,
        default:Date.now()
    }
})

const LoungeModel = mongoose.models.lounge || mongoose.model('lounge', LoungeSchema);

export default LoungeModel;