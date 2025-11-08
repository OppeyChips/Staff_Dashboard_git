import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongoose';
import Project from '@/lib/models/Project';

// GET - Fetch user's project
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('discord_user');

    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(userCookie.value);
    await connectDB();

    // Get user's project (or create a default one)
    let project = await Project.findOne({ userId: user.id });

    if (!project) {
      // Create default project for new users
      project = await Project.create({
        userId: user.id,
        title: 'Discord Bot Feature Development',
        status: 'In Progress',
        assignees: [{
          name: user.global_name || user.username,
          avatarUrl: user.avatar
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
            : 'https://i.pravatar.cc/150?u=default',
          userId: user.id,
        }],
        dateRange: {
          start: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        },
        tags: [
          { label: 'Research', variant: 'destructive' },
          { label: 'Development', variant: 'secondary' },
        ],
        description: 'Working on implementing and documenting new Discord bot commands including AFK status, temporary voice channels, and message highlighting features. This involves research, testing, and comprehensive documentation.',
        attachments: [
          { name: 'Command_Specifications.pdf', size: '2.3 Mb', type: 'pdf' },
          { name: 'UI_Mockups.fig', size: '8.7 Mb', type: 'figma' },
        ],
        subTasks: [
          {
            task: 'Research AFK command functionality',
            category: 'Research',
            status: 'Completed',
            dueDate: 'Nov 5, 2025',
          },
          {
            task: 'Document Tempvoice implementation',
            category: 'Documentation',
            status: 'In Progress',
            dueDate: 'Nov 8, 2025',
          },
          {
            task: 'Test Highlight command workflow',
            category: 'Testing',
            status: 'Pending',
            dueDate: 'Nov 12, 2025',
          },
        ],
        breadcrumbs: [
          { label: 'Staff Tasks', href: '#' },
          { label: 'Current Assignment', href: '#' },
        ],
      });
    }

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update project
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('discord_user');

    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(userCookie.value);
    const body = await request.json();

    await connectDB();

    const project = await Project.findOneAndUpdate(
      { userId: user.id },
      {
        ...body,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
