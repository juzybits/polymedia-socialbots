# Polymedia SocialBots

Fetch Sui on-chain events and post messages to Discord, Telegram, Twitter.

Currently it only looks at Turbos Finance trades and only posts to Discord.

## Set up API access

### Discord

1. Create a Discord bot and copy the bot token (you'll need it for `src/.auth.ts`).<br/>
https://discord.com/developers/applications

2. Add the bot to your Discord server by visiting this URL. It only needs the "send messages" permission.<br/>
https://discord.com/api/oauth2/authorize?client_id=YOUR_APPLICATION_ID&permissions=2048&scope=bot

3. Enable Discord developer mode. Then, right click on the Discord channel where you want the bot to send messages and click `Copy Channel ID` (you'll need it for `src/.config.ts`).

## Installation

```bash
# Install required NPM packages globally:
npm add -g pnpm pm2

# Clone and install the repo:
git clone https://github.com/juzybits/polymedia-socialbots.git
cd polymedia-socialbots
pnpm install

# Create and modify `src/.auth.ts` (add your Discord bot token, etc):
cp src/.auth.example.ts src/.auth.ts

# Modify `src/.config.ts` (add your Discord channel ID, etc):
```

## Usage

```bash
# start the app
pnpm start-dev  # development, runs with 'pm2'
pnpm start-prod # production,  runs with 'pm2'
pnpm start-node # development, runs with 'node'

# check if the app is running
pm2 ls

# check app logs
pm2 logs socialbots

# stop the app
pm2 stop socialbots
```

## Server setup

Here is how you can provision an Ubuntu server and keep the app running.

```bash
# Access your server
ssh user@your_server_ip

# Update and upgrade packages
sudo apt update && sudo apt upgrade -y
sudo reboot

# Install Node.js and npm
sudo apt install nodejs npm -y

# Follow the steps in the 'Installation' section

# Start the app
pnpm start-prod

# Set up pm2 to restart your app on server reboots
pm2 startup

# Save the pm2 process list
pm2 save
```
