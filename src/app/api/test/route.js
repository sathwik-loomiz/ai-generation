import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    // Test database connection
    await connectDB();
    
    return NextResponse.json({
      success: true,
      message: 'Backend is working correctly!',
      services: {
        database: 'Connected',
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Backend test failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 