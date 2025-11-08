import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongoose';
import Project from '@/lib/models/Project';

// POST - Share project
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('discord_user');

    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(userCookie.value);
    const { isPublic, sharedWith } = await request.json();

    await connectDB();

    const project = await Project.findOneAndUpdate(
      { userId: user.id },
      {
        isPublic: isPublic ?? false,
        sharedWith: sharedWith ?? [],
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Generate shareable link
    const shareLink = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/shared/${project._id}`;

    return NextResponse.json({
      project,
      shareLink,
      message: 'Project sharing settings updated successfully',
    }, { status: 200 });
  } catch (error) {
    console.error('Error sharing project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
