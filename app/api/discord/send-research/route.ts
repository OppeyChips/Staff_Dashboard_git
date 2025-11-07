import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface ResearchData {
  commands: string;
  module: string;
  suggestions: string;
  workflow: string;
  ideas: string;
  tags: string[];
  channelId: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('discord_user');

    if (!userCookie) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in again' },
        { status: 401 }
      );
    }

    const user = JSON.parse(userCookie.value);

    // Parse request body (FormData for file uploads)
    const formData = await request.formData();

    const commands = formData.get('commands') as string || '';
    const module = formData.get('module') as string || '';
    const suggestions = formData.get('suggestions') as string || '';
    const workflow = formData.get('workflow') as string || '';
    const ideas = formData.get('ideas') as string || '';
    const tagsString = formData.get('tags') as string || '[]';
    const tags = JSON.parse(tagsString) as string[];
    const channelId = formData.get('channelId') as string;

    // Get image files
    const commandsImage = formData.get('commands_image') as File | null;
    const moduleImage = formData.get('module_image') as File | null;
    const suggestionsImage = formData.get('suggestions_image') as File | null;
    const workflowImage = formData.get('workflow_image') as File | null;
    const ideasImage = formData.get('ideas_image') as File | null;

    if (!channelId) {
      return NextResponse.json(
        { error: 'Channel ID is required' },
        { status: 400 }
      );
    }

    // Check if bot token is configured
    if (!process.env.DISCORD_BOT_TOKEN) {
      return NextResponse.json(
        { error: 'Discord bot token is not configured. Please add DISCORD_BOT_TOKEN to your .env.local file' },
        { status: 500 }
      );
    }

    // Check if guild ID is configured (optional - for documentation purposes)
    const guildId = process.env.DISCORD_GUILD_ID || '1410277010575724697';
    if (!process.env.DISCORD_GUILD_ID) {
      console.warn('DISCORD_GUILD_ID not set in .env.local, using default guild ID');
    }

    // Build the Discord message content with markdown
    let messageContent = '';

    // Add sections that have content
    if (commands) {
      messageContent += `## Commands\n${commands}\n\n`;
    }

    if (module) {
      messageContent += `## Module\n${module}\n\n`;
    }

    if (suggestions) {
      messageContent += `## Suggestions\n${suggestions}\n\n`;
    }

    if (workflow) {
      messageContent += `## Workflow\n${workflow}\n\n`;
    }

    if (ideas) {
      messageContent += `## Ideas\n${ideas}\n\n`;
    }

    // Create main embed with author info and tags
    const mainEmbed: any = {
      title: '📊 Research & Development Report',
      description: `Submitted by **${user.username}**`,
      color: 0xA855F7, // Purple
      timestamp: new Date().toISOString(),
      footer: {
        text: 'R.O.T.I Staff Dashboard',
      },
    };

    // Add tags field to embed if tags are selected
    if (tags.length > 0) {
      mainEmbed.fields = [
        {
          name: '🏷️ Tags',
          value: tags.map(tag => `\`${tag}\``).join(' • '),
          inline: false,
        },
      ];
    }

    // Prepare FormData for Discord API (to support file uploads)
    const discordFormData = new FormData();

    // Add payload_json with message content and embeds
    discordFormData.append('payload_json', JSON.stringify({
      content: messageContent || 'No content provided',
      embeds: [mainEmbed],
    }));

    // Add image files if they exist
    const imageFiles = [
      { file: commandsImage, name: 'commands' },
      { file: moduleImage, name: 'module' },
      { file: suggestionsImage, name: 'suggestions' },
      { file: workflowImage, name: 'workflow' },
      { file: ideasImage, name: 'ideas' },
    ];

    let fileIndex = 0;
    for (const { file, name } of imageFiles) {
      if (file) {
        const buffer = await file.arrayBuffer();
        const blob = new Blob([buffer], { type: file.type });
        discordFormData.append(`files[${fileIndex}]`, blob, `${name}_${file.name}`);
        fileIndex++;
      }
    }

    // Send message to Discord
    const discordResponse = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
        body: discordFormData,
      }
    );

    if (!discordResponse.ok) {
      const errorData = await discordResponse.json();
      console.error('Discord API error:', errorData);

      // Provide specific error messages based on status code
      let errorMessage = 'Failed to send message to Discord';

      if (discordResponse.status === 401) {
        errorMessage = 'Invalid bot token. Please check your DISCORD_BOT_TOKEN in .env.local';
      } else if (discordResponse.status === 403) {
        errorMessage = 'Bot lacks permissions. Ensure the bot has "Send Messages" and "Embed Links" permissions in this channel';
      } else if (discordResponse.status === 404) {
        errorMessage = 'Channel not found. Please verify the channel ID is correct';
      } else if (errorData.message) {
        errorMessage = `Discord API Error: ${errorData.message}`;
      }

      return NextResponse.json(
        { error: errorMessage, details: errorData },
        { status: discordResponse.status }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Research data sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending research data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
