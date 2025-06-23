import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to create optimized prompt for fashion generation
const createOptimizedPrompt = (productName, userPrompt, adjectives, color, referenceImages) => {
  let prompt = `Create a high-quality, professional fashion design for a ${productName}`;
  
  if (userPrompt) {
    prompt += ` with the following description: ${userPrompt}`;
  }
  
  if (adjectives) {
    prompt += `. Style: ${adjectives}`;
  }
  
  if (color) {
    prompt += `. Color scheme: ${color}`;
  }
  
  // Add fashion-specific enhancements
  prompt += `. The design should be: 
  - Fashion-forward and trendy
  - Suitable for modern clothing production
  - Clean and professional presentation
  - High-resolution with clear details
  - Front view of the garment
  - White background for clean presentation
  - Realistic fabric textures and materials
  - Professional fashion photography style`;
  
  if (referenceImages && referenceImages.length > 0) {
    prompt += `. Use the provided reference images as inspiration for style, pattern, or design elements.`;
  }
  
  return prompt;
};

// Main function to generate images
export const generateFashionImages = async (productName, userPrompt, adjectives, color, count, referenceImages = []) => {
  try {
    const optimizedPrompt = createOptimizedPrompt(productName, userPrompt, adjectives, color, referenceImages);
    
    console.log('Optimized prompt:', optimizedPrompt);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: optimizedPrompt,
      n: Math.min(count, 1), // DALL-E 3 only supports 1 image at a time
      size: "1024x1024",
      quality: "hd",
      style: "natural",
    });

    // If user requested more than 1 image, generate additional ones
    const images = [...response.data];
    
    if (count > 1) {
      for (let i = 1; i < count; i++) {
        try {
          const additionalResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: optimizedPrompt + ` (variation ${i + 1})`,
            n: 1,
            size: "1024x1024",
            quality: "hd",
            style: "natural",
          });
          
          images.push(...additionalResponse.data);
        } catch (error) {
          console.error(`Error generating additional image ${i + 1}:`, error);
          // Continue with available images
        }
      }
    }

    return {
      success: true,
      images: images.map(img => ({
        url: img.url,
        revisedPrompt: img.revised_prompt
      })),
      prompt: optimizedPrompt
    };
    
  } catch (error) {
    console.error('OpenAI generation error:', error);
    throw new Error(`Failed to generate images: ${error.message}`);
  }
};

// Function to generate variations of existing images
export const generateImageVariations = async (imageUrl, count = 1) => {
  try {
    const images = [];
    
    for (let i = 0; i < count; i++) {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Create a variation of this fashion design with subtle differences in style, pattern, or color while maintaining the same overall aesthetic`,
        n: 1,
        size: "1024x1024",
        quality: "hd",
        style: "natural",
      });
      
      images.push(...response.data);
    }

    return {
      success: true,
      images: images.map(img => ({
        url: img.url,
        revisedPrompt: img.revised_prompt
      }))
    };
    
  } catch (error) {
    console.error('OpenAI variation generation error:', error);
    throw new Error(`Failed to generate image variations: ${error.message}`);
  }
}; 