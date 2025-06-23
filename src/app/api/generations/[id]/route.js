import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Generation from '@/models/Generation';

export async function GET(request, { params }) {
  console.log(`\n[API] /api/generations/[id]: Received request for ID: ${params.id}`);
  try {
    await connectDB();
    console.log('[API] /api/generations/[id]: Database connected.');
    
    const { id } = params;
    
    const generation = await Generation.findById(id);
    
    if (!generation) {
      console.log(`[API] /api/generations/[id]: Generation with ID ${id} not found.`);
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      );
    }
    
    console.log(`[API] /api/generations/[id]: Successfully fetched generation ${id}.`);
    return NextResponse.json(generation);
    
  } catch (error) {
    console.error(`[API] /api/generations/[id]: Error fetching generation ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch generation' },
      { status: 500 }
    );
  }
}