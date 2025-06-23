import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Generation from '@/models/Generation';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { generateFashionImages } from '@/lib/openai';

export async function POST(request) {
  const startTime = Date.now();
  let generation;
  try {
    await connectDB();
    const body = await request.json();
    const { generationId, selectedImages, newPrompt, count = 1, productName } = body;
    if (!generationId) {
      return NextResponse.json(
        { error: 'generationId is required for regeneration' },
        { status: 400 }
      );
    }
    if (!selectedImages || selectedImages.length === 0) {
      return NextResponse.json(
        { error: 'At least one image must be selected for regeneration' },
        { status: 400 }
      );
    }
    if (!newPrompt) {
      return NextResponse.json(
        { error: 'New prompt is required for regeneration' },
        { status: 400 }
      );
    }
    // Find the existing generation document
    generation = await Generation.findById(generationId);
    if (!generation) {
      return NextResponse.json(
        { error: 'Original generation not found' },
        { status: 404 }
      );
    }
    // Generate new images with the new prompt and selected images as references
    const generationResult = await generateFashionImages(
      productName || generation.productName || 'Fashion Item',
      newPrompt,
      '', // adjectives
      '', // color
      count,
      selectedImages // Use selected images as reference
    );
    // Upload generated images to Cloudinary
    const generatedImages = [];
    for (const image of generationResult.images) {
      try {
        const uploadResult = await uploadToCloudinary(image.url, 'regenerated-images');
        generatedImages.push({
          cloudinaryUrl: uploadResult.url,
          cloudinaryPublicId: uploadResult.publicId,
          prompt: image.revisedPrompt || generationResult.prompt
        });
      } catch (error) {
        generatedImages.push({
          cloudinaryUrl: image.url,
          cloudinaryPublicId: null,
          prompt: image.revisedPrompt || generationResult.prompt
        });
      }
    }
    // Push the regeneration entry to the regenerations array
    generation.regenerations.push({
      prompt: newPrompt,
      referenceImages: selectedImages.map(url => ({ cloudinaryUrl: url })),
      generatedImages,
      createdAt: new Date()
    });
    generation.status = 'completed';
    generation.processingTime = Date.now() - startTime;
    await generation.save();
    return NextResponse.json({
      success: true,
      generationId: generation._id,
      images: generatedImages.map(img => img.cloudinaryUrl),
      processingTime: generation.processingTime
    });
  } catch (error) {
    if (generation) {
      try {
        generation.status = 'failed';
        generation.error = error.message;
        generation.processingTime = Date.now() - startTime;
        await generation.save();
      } catch {}
    }
    return NextResponse.json(
      { error: 'Failed to regenerate images', details: error.message },
      { status: 500 }
    );
  }
} 