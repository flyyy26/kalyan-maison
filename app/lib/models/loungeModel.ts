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
        name: { type: String, required: true }, 
        image: { type: String, required: true } 
    }],
    menu:[{ 
        name: { type: String, required: true }, 
        description: { type: String, required: true }, 
        image: { type: String, required: true } 
    }],
    spaces: [{ 
        name: { type: String, required: true }, 
        image: { type: String, required: true } 
    }],
    date:{
        type:Date,
        default:Date.now()
    }
})

const LoungeModel = mongoose.models.lounge || mongoose.model('lounge', LoungeSchema);

export default LoungeModel;