import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
    instagram: { type: String, required: false },
    facebook: { type: String, required: false },
    whatsapp: { type: String, required: false },
    tiktok: { type: String, required: false },
});

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);