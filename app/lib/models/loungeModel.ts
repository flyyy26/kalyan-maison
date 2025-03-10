import mongoose, { Schema } from "mongoose";

const LoungeSchema  = new mongoose.Schema({
    name:{
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
    imageSlide: { 
        type: [String], 
        required: false 
    },
    menu: { 
        type: [String], 
        required: false 
    },
    spaces: { 
        type: [String], 
        required: false 
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

const LoungeModel = mongoose.models.lounge || mongoose.model('lounge', LoungeSchema);

export default LoungeModel;