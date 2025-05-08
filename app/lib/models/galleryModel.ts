// models/Gallery.ts
import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
  imageGallery: {
    type: [String],
    default: [],
  },
  videoGallery: {
    type: [String],
    default: [],
  },
});

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);