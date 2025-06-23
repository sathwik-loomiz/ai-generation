import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Generation from '@/models/Generation';
import mongoose from 'mongoose';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { generateFashionImages } from '@/lib/openai';

export async function POST(request) {
  console.log('\n[API] /api/generate: Received new generation request.');
  const startTime = Date.now();
  let generation; // To hold the generation document
  
  try {
    await connectDB();
    console.log('[API] /api/generate: Database connected.');
    
    const formData = await request.formData();
    
    // Extract form data
    const productIdValue = formData.get('productId');
    const productName = formData.get('productName');
    const prompt = formData.get('prompt');
    const adjectives = formData.get('adjectives') || '';
    const color = formData.get('color') || '';
    const count = parseInt(formData.get('count')) || 1;
    
    // Validate required fields
    if (!productName || !prompt) {
      return NextResponse.json(
        { error: 'Product name and prompt are required' },
        { status: 400 }
      );
    }
    
    const generationData = {
      productName,
      prompt,
      adjectives,
      color,
      count,
      status: 'processing'
    };

    if (mongoose.Types.ObjectId.isValid(productIdValue)) {
      generationData.productId = productIdValue;
    }
    
    // Create generation record
    generation = new Generation(generationData);
    
    await generation.save();
    console.log(`[API] /api/generate: Created initial generation record with ID: ${generation._id}`);
    
    // Handle reference images upload
    const referenceImages = [];
    const imageFiles = formData.getAll('referenceImages');
    
    if (imageFiles && imageFiles.length > 0) {
      console.log(`[API] /api/generate: Found ${imageFiles.length} reference images to upload.`);
      for (const file of imageFiles) {
        if (file instanceof File && file.size > 0) {
          try {
            // Convert file to base64 for Cloudinary
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;
            
            console.log(`[API] /api/generate: Uploading ${file.name} to Cloudinary...`);
            const uploadResult = await uploadToCloudinary(base64String, 'reference-images');
            console.log(`[API] /api/generate: Successfully uploaded ${file.name} to Cloudinary.`);
            
            referenceImages.push({
              originalName: file.name,
              cloudinaryUrl: uploadResult.url,
              cloudinaryPublicId: uploadResult.publicId
            });
          } catch (error) {
            console.error('[API] /api/generate: Error uploading a reference image:', error);
            // Continue with other images
          }
        }
      }
    }
    
    // Update generation with reference images
    generation.referenceImages = referenceImages;
    await generation.save();
    console.log('[API] /api/generate: Updated generation record with reference image URLs.');
    
    // Generate images with OpenAI
    console.log('[API] /api/generate: Sending request to OpenAI...');
    const generationResult = await generateFashionImages(
      productName,
      prompt,
      adjectives,
      color,
      count,
      referenceImages.map(img => img.cloudinaryUrl)
    );
    console.log('[API] /api/generate: Received response from OpenAI.');
    
    // Upload generated images to Cloudinary
    const generatedImages = [];
    console.log(`[API] /api/generate: Uploading ${generationResult.images.length} generated images to Cloudinary.`);
    for (const image of generationResult.images) {
      try {
        const uploadResult = await uploadToCloudinary(image.url, 'generated-images');
        console.log('[API] /api/generate: Uploaded a generated image to Cloudinary.');
        
        generatedImages.push({
          cloudinaryUrl: uploadResult.url,
          cloudinaryPublicId: uploadResult.publicId,
          prompt: image.revisedPrompt || generationResult.prompt
        });
      } catch (error) {
        console.error('[API] /api/generate: Error uploading a generated image:', error);
        // Store original URL if Cloudinary upload fails
        generatedImages.push({
          cloudinaryUrl: image.url,
          cloudinaryPublicId: null,
          prompt: image.revisedPrompt || generationResult.prompt
        });
      }
    }
    
    // Update generation with results
    generation.generatedImages = generatedImages;
    generation.status = 'completed';
    generation.openaiResponse = generationResult;
    generation.processingTime = Date.now() - startTime;
    
    await generation.save();
    console.log(`[API] /api/generate: Finalized generation record ${generation._id}. Status: completed.`);
    
    return NextResponse.json({
      success: true,
      generationId: generation._id,
      images: generatedImages.map(img => img.cloudinaryUrl),
      processingTime: generation.processingTime
    });
    
  } catch (error) {
    console.error('[API] /api/generate: An error occurred during the generation process:', error);
    
    if (generation) {
      try {
        generation.status = 'failed';
        generation.error = error.message;
        generation.processingTime = Date.now() - startTime;
        await generation.save();
        console.log(`[API] /api/generate: Updated generation record ${generation._id} to status: failed.`);
      } catch (updateError) {
        console.error('[API] /api/generate: CRITICAL - Failed to update generation status to failed:', updateError);
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to generate images', details: error.message },
      { status: 500 }
    );
  }
} 