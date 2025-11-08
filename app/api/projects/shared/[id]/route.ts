import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Project from '@/lib/models/Project';

// GET - Fetch shared project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if project is public or shared
    if (!project.isPublic) {
      return NextResponse.json(
        { error: 'This project is private' },
        { status: 403 }
      );
    }

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error('Error fetching shared project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
