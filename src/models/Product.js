import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['hoodie', 'blazer', 'parka', 'cardigan', 'shrug', 'skirt', 'overalls', 'blouse', 'kurta', 'dress']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Product || mongoose.model('Product', productSchema); 