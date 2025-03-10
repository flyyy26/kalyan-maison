import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    }
})

const CityModel = mongoose.models.city || mongoose.model('city', Schema);

export default CityModel;