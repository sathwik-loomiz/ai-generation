const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Define Product Schema
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

const Product = mongoose.model('Product', productSchema);

// Default products data
const defaultProducts = [
  { name: 'Hoodie', image: '/ProductTypeHooide.svg', category: 'hoodie' },
  { name: 'Blazer', image: '/ProductTypeBlazer.svg', category: 'blazer' },
  { name: 'Parka', image: '/ProductTypeParka.svg', category: 'parka' },
  { name: 'Cardigan', image: '/ProductTypeHooide.svg', category: 'cardigan' },
  { name: 'Shrug', image: '/ProductTypeHooide.svg', category: 'shrug' },
  { name: 'Skirt', image: '/ProductTypeHooide.svg', category: 'skirt' },
  { name: 'Overalls', image: '/ProductTypeHooide.svg', category: 'overalls' },
  { name: 'Blouse', image: '/ProductTypeHooide.svg', category: 'blouse' },
  { name: 'Kurta', image: '/ProductTypeHooide.svg', category: 'kurta' },
  { name: 'Dress', image: '/ProductTypeHooide.svg', category: 'dress' },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert default products
    const products = await Product.insertMany(defaultProducts);
    console.log(`Inserted ${products.length} products`);

    // Display inserted products
    console.log('\nInserted products:');
    products.forEach(product => {
      console.log(`- ${product.name} (${product.category})`);
    });

    console.log('\nDatabase seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeder
seedDatabase(); 