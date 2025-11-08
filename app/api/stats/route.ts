import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongoose';
import UserStats from '@/lib/models/UserStats';
import Activity from '@/lib/models/Activity';

// GET - Fetch user statistics
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('discord_user');

    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(userCookie.value);
    await connectDB();

    // Get or create user stats
    let stats = await UserStats.findOne({ userId: user.id });

    if (!stats) {
      stats = await UserStats.create({
        userId: user.id,
        totalTimeSpent: 0,
        researchSubmissions: 0,
        activeDays: 0,
        lastActive: new Date(),
        sessions: [],
        commandStats: {
          AFK: 0,
          Tempvoice: 0,
          Highlight: 0,
        },
      });
    }

    // Get recent activities
    const recentActivities = await Activity.find({ userId: user.id })
      .sort({ timestamp: -1 })
      .limit(5);

    // Calculate weekly activity (last 7 days)
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weeklyActivity = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const daySessions = stats.sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= dayStart && sessionDate <= dayEnd;
      });

      const totalHours = daySessions.reduce((sum, session) => sum + session.duration, 0) / 60;

      weeklyActivity.push({
        day: days[date.getDay()],
        hours: parseFloat(totalHours.toFixed(1)),
      });
    }

    // Format response
    const formattedStats = {
      totalTimeSpent: (stats.totalTimeSpent / 60).toFixed(1),
      researchSubmissions: stats.researchSubmissions,
      activeDays: stats.activeDays,
      averageSessionTime: stats.sessions.length > 0
        ? ((stats.totalTimeSpent / stats.sessions.length) / 60).toFixed(1)
        : '0',
      lastActive: getTimeAgo(stats.lastActive),
      weeklyActivity,
      recentActivities: recentActivities.map(activity => ({
        id: activity._id.toString(),
        action: activity.action,
        time: getTimeAgo(activity.timestamp),
        command: activity.command,
      })),
      commandStats: {
        AFK: stats.commandStats?.AFK || 0,
        Tempvoice: stats.commandStats?.Tempvoice || 0,
        Highlight: stats.commandStats?.Highlight || 0,
      },
    };

    return NextResponse.json({ stats: formattedStats }, { status: 200 });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Update user statistics
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('discord_user');

    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(userCookie.value);
    const { sessionDuration, command } = await request.json();

    await connectDB();

    const stats = await UserStats.findOne({ userId: user.id });

    if (!stats) {
      return NextResponse.json({ error: 'Stats not found' }, { status: 404 });
    }

    // Update stats
    if (sessionDuration) {
      stats.totalTimeSpent += sessionDuration;
      stats.sessions.push({
        date: new Date(),
        duration: sessionDuration,
      });
    }

    if (command) {
      stats.researchSubmissions += 1;
      if (command in stats.commandStats) {
        stats.commandStats[command] += 1;
      }
    }

    stats.lastActive = new Date();
    stats.updatedAt = new Date();

    await stats.save();

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error('Error updating stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (secondsAgo < 60) return 'just now';
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} minutes ago`;
  if (secondsAgo < 7200) return '1 hour ago';
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hours ago`;
  if (secondsAgo < 172800) return '1 day ago';
  return `${Math.floor(secondsAgo / 86400)} days ago`;
}
