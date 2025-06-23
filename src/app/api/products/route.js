import { NextResponse } from 'next/server';

export async function GET() {
  console.log('\n[API] /api/products: Request received for product list.');
  try {
    // Return default products without database connection
    const defaultProducts = [
      { id: 1, name: 'Hoodie', image: '/ProductTypeHooide.svg', category: 'hoodie' },
      { id: 2, name: 'Blazer', image: '/ProductTypeBlazer.svg', category: 'blazer' },
      { id: 3, name: 'Parka', image: '/ProductTypeParka.svg', category: 'parka' },
      { id: 4, name: 'Cardigan', image: '/ProductTypeCardigan.svg', category: 'cardigan' },
      { id: 5, name: 'Shrug', image: '/ProductTypeShurg.svg', category: 'shrug' },
      { id: 6, name: 'Skirt', image: '/ProductTypeSkirt.svg', category: 'skirt' },
      { id: 7, name: 'Overalls', image: '/ProductTypeOveralls.svg', category: 'overalls' },
      { id: 8, name: 'Blouse', image: '/ProductTypeBlouse.svg', category: 'blouse' },
      { id: 9, name: 'Kurta', image: '/ProductTypeKurta.svg', category: 'kurta' },
      { id: 10, name: 'Dress', image: '/ProductTypeDress.svg', category: 'dress' },
    ];
    
    console.log('[API] /api/products: Successfully returned default product list.');
    return NextResponse.json(defaultProducts);
    
  } catch (error) {
    console.error('[API] /api/products: Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  console.log('\n[API] /api/products: Received POST request (currently mocked).');
  try {
    const body = await request.json();
    console.log('[API] /api/products: Request body:', body);
    const { name, image, category } = body;
    
    if (!name || !image || !category) {
      return NextResponse.json(
        { error: 'Name, image, and category are required' },
        { status: 400 }
      );
    }
    
    // Since we're not using database for products, just return success
    console.log('[API] /api/products: Mocked successful response.');
    return NextResponse.json({ 
      success: true, 
      message: 'Product would be created in database if needed' 
    }, { status: 201 });
    
  } catch (error) {
    console.error('[API] /api/products: Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 