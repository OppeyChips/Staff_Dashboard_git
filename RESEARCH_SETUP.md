# Research & Development Feature Setup

## Overview
The Research & Development page allows staff to document and submit research findings directly to Discord channels.

## Features
- 5 text areas for different categories: Commands, Module, Suggestions, Workflow, Ideas
- Discord markdown support (bold, italic, headings, etc.)
- Direct Discord channel submission
- Purple/black gradient theme
- Real-time submission feedback

## Setup Instructions

### 1. Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application (or create a new one)
3. Go to **Bot** section
4. Copy the **Bot Token** and add it to your `.env.local`:
   ```
   DISCORD_BOT_TOKEN=your_bot_token_here
   ```

### 2. Bot Permissions

Your bot needs these permissions:
- **Send Messages** (required)
- **Embed Links** (required)
- **Read Message History** (optional)

Permission Integer: `2147485696`

### 3. Invite Bot to Server

Use this URL format to invite your bot:
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2147485696&scope=bot
```

Replace `YOUR_CLIENT_ID` with your Discord Application Client ID.

### 4. Get Channel ID

1. Enable Developer Mode in Discord (User Settings → Advanced → Developer Mode)
2. Right-click on the channel you want to send research to
3. Click "Copy Channel ID"
4. Use this ID when submitting research

## Guild ID
The research server is configured for Guild ID: `1410277010575724697`

## Supported Discord Markdown

- `*italic*` or `_italic_` - Italic text
- `**bold**` - Bold text
- `***bold italic***` - Bold and italic
- `__underline__` - Underline
- `~~strikethrough~~` - Strikethrough
- `# Heading` - Large heading
- `## Subheading` - Subheading
- `### Small heading` - Small heading
- `` `code` `` - Inline code
- ` ```code block``` ` - Code block

## Usage

1. Log in to the staff dashboard
2. Navigate to "Research & Dev" in the sidebar
3. Fill in the relevant sections with your research data
4. Enter the Discord Channel ID where you want to send the data
5. Click "Send"
6. The bot will create a formatted embed message in the specified channel

## Troubleshooting

### "Failed to send message to Discord"
- Check that your bot token is correct
- Verify the bot is in the server (Guild ID: 1410277010575724697)
- Ensure the bot has permissions to send messages in the channel
- Verify the channel ID is correct

### "Unauthorized"
- Make sure you're logged in
- Your session may have expired - try logging out and back in

### Bot not responding
- Restart your development server after adding the bot token
- Check that the bot token starts with the correct format
- Verify the bot is online in Discord
