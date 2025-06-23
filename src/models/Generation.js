import mongoose from 'mongoose';

const generationSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
  productName: {
    type: String,
    required: true
  },
  prompt: {
    type: String,
    required: true,
    trim: true
  },
  adjectives: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  count: {
    type: Number,
    required: true,
    min: 1,
    max: 6,
    default: 1
  },
  referenceImages: [{
    originalName: String,
    cloudinaryUrl: String,
    cloudinaryPublicId: String
  }],
  generatedImages: [{
    cloudinaryUrl: String,
    cloudinaryPublicId: String,
    prompt: String
  }],
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  openaiResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  error: {
    type: String
  },
  processingTime: {
    type: Number // in milliseconds
  },
  regenerations: [
    {
      prompt: String,
      referenceImages: [{
        cloudinaryUrl: String,
        originalName: String,
        cloudinaryPublicId: String
      }],
      generatedImages: [{
        cloudinaryUrl: String,
        cloudinaryPublicId: String,
        prompt: String
      }],
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, {
  timestamps: true
});

// Index for better query performance
generationSchema.index({ createdAt: -1 });
generationSchema.index({ status: 1 });
generationSchema.index({ productId: 1 });

export default mongoose.models.Generation || mongoose.model('Generation', generationSchema); 