# AI Fashion Generation App

A Next.js application that generates AI-powered fashion designs using OpenAI's DALL-E, with MongoDB for data storage and Cloudinary for image management.

## Features

- **Product Selection**: Choose from various clothing types (Hoodie, Blazer, Parka, etc.)
- **AI Image Generation**: Generate fashion designs using OpenAI DALL-E 3
- **Reference Images**: Upload up to 5 reference images for inspiration
- **Custom Prompts**: Add detailed descriptions, adjectives, and color preferences
- **Image Regeneration**: Regenerate selected images with new prompts
- **Cloud Storage**: All images stored securely on Cloudinary
- **Database**: MongoDB for storing generation history and metadata

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **AI**: OpenAI DALL-E 3
- **Image Storage**: Cloudinary
- **File Upload**: FormData with multipart handling

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key
- Cloudinary account

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd ai-generation
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ai-fashion-generation
# or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/ai-fashion-generation

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Application Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Get API Keys

#### OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env.local` file

#### Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Create a free account
3. Go to Dashboard → Settings → Access Keys
4. Copy your Cloud Name, API Key, and API Secret
5. Add them to your `.env.local` file

#### MongoDB Setup

**Option A: Local MongoDB**

1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/ai-fashion-generation`

**Option B: MongoDB Atlas (Recommended)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Replace `<password>` with your actual password

### 4. Database Setup

The application will automatically create the necessary collections when you first run it. However, you can optionally seed the database with default products:

```bash
# Optional: Seed database with default products
npm run seed
```

### 5. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Products

- `GET /api/products` - Fetch all available product types
- `POST /api/products` - Create a new product type

### Generation

- `POST /api/generate` - Generate new fashion designs
- `POST /api/regenerate` - Regenerate images with new prompts
- `GET /api/generations/[id]` - Fetch specific generation results

## Usage Flow

1. **Home Page**: Click "Start Now" to begin
2. **Product Selection**: Choose a clothing type (Hoodie, Blazer, etc.)
3. **Product Description**:
   - Enter a detailed prompt describing your design
   - Upload reference images (optional, max 5)
   - Add adjectives and color preferences
   - Select number of images to generate (1-6)
   - Click "Generate"
4. **Results**: View generated images with options to:
   - Download individual images
   - Select images for regeneration
   - Navigate to 3D prototype (future feature)

## File Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── generate/           # Main generation endpoint
│   │   ├── regenerate/         # Regeneration endpoint
│   │   ├── products/           # Product management
│   │   └── generations/        # Generation results
│   ├── component/              # Reusable components
│   ├── FirstGeneration/        # Results display page
│   ├── productDescription/     # Generation form page
│   ├── productType/            # Product selection page
│   ├── Regenrate/              # Regeneration form page
│   └── RegeneratedImages/      # Regeneration results page
├── lib/                        # Utility libraries
│   ├── mongodb.js              # Database connection
│   ├── cloudinary.js           # Cloudinary configuration
│   └── openai.js               # OpenAI service
└── models/                     # MongoDB schemas
    ├── Product.js              # Product schema
    └── Generation.js           # Generation schema
```

## Database Schema

### Product Schema

```javascript
{
  name: String,           // Product name (e.g., "Hoodie")
  image: String,          // Product icon URL
  category: String,       // Product category
  isActive: Boolean       // Active status
}
```

### Generation Schema

```javascript
{
  productId: ObjectId,    // Reference to Product
  productName: String,    // Product name
  prompt: String,         // User prompt
  adjectives: String,     // Style adjectives
  color: String,          // Color preferences
  count: Number,          // Number of images
  referenceImages: Array, // Uploaded reference images
  generatedImages: Array, // Generated images
  status: String,         // pending/processing/completed/failed
  openaiResponse: Mixed,  // OpenAI API response
  error: String,          // Error message if failed
  processingTime: Number  // Processing time in ms
}
```

## Error Handling

The application includes comprehensive error handling:

- **API Errors**: Proper HTTP status codes and error messages
- **File Upload**: Validation for file types and sizes
- **Database Errors**: Connection and query error handling
- **OpenAI Errors**: Rate limiting and API error handling
- **Cloudinary Errors**: Upload and storage error handling

## Performance Optimizations

- **Image Optimization**: Cloudinary transformations for optimal delivery
- **Database Indexing**: Indexed fields for faster queries
- **Caching**: MongoDB connection caching
- **Error Recovery**: Graceful fallbacks for failed operations

## Security Considerations

- **Environment Variables**: Sensitive data stored in `.env.local`
- **File Validation**: Image type and size validation
- **API Rate Limiting**: Consider implementing rate limiting for production
- **Input Sanitization**: All user inputs are validated and sanitized

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Check your MongoDB URI in `.env.local`
   - Ensure MongoDB is running (if local)
   - Verify network access (if Atlas)

2. **OpenAI API Errors**

   - Verify your API key is correct
   - Check your OpenAI account balance
   - Ensure you have access to DALL-E 3

3. **Cloudinary Upload Errors**

   - Verify your Cloudinary credentials
   - Check your Cloudinary plan limits
   - Ensure proper folder permissions

4. **Image Generation Fails**
   - Check OpenAI API response for content policy violations
   - Verify prompt doesn't contain inappropriate content
   - Ensure reference images are valid

### Debug Mode

Enable debug logging by adding to `.env.local`:

```env
DEBUG=true
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:

- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation
