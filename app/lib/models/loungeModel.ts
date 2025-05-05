import mongoose, { Schema } from "mongoose";

const LoungeSchema  = new mongoose.Schema({
    logo:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    instagram:{
        type:String,
        required:false
    },
    facebook:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:false
    },
    whatsapp:{
        type:String,
        required:false
    },
    youtube:{
        type:String,
        required:false
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
    menuImages: {
        type: [String], // ⬅️ Disimpan langsung sebagai array URL
        default: []
    },
    otherImages: {
        type: [String], // ⬅️ Disimpan langsung sebagai array URL
        default: []
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

const LoungeModel = mongoose.models.lounge || mongoose.model('lounge', LoungeSchema);

export default LoungeModel;