# Polymedia SocialBots

Fetch Sui onchain events and post messages to social media.

![Polymedia SocialBots](https://assets.polymedia.app/img/socialbots/open-graph.webp)

It monitors Turbos Finance trades and posts messages to Discord, but can be extended to support other onchain events and social media platforms.

## Enable API access

### Discord

1. Create a Discord bot and copy the bot token (you'll need it for `.env`).<br/>
https://discord.com/developers/applications

2. Add the bot to your Discord server by visiting this URL. It only needs the "send messages" permission.<br/>
https://discord.com/api/oauth2/authorize?client_id=YOUR_APPLICATION_ID&permissions=2048&scope=bot

3. Enable Discord developer mode, right click on the Discord channel where you want the bot to send messages, and click `Copy Channel ID` (you'll need it for `src/config.ts`).

## Installation

```bash
# Install required NPM packages globally:
npm add -g pnpm pm2

# Clone and install the repo:
git clone https://github.com/juzybits/polymedia-socialbots.git
cd polymedia-socialbots
pnpm install

# Add your authentication credentials:
cp .env.example .env

# Modify the configuration (add your Discord channel ID, your Turbos pool, etc):
src/config.ts
```

## Usage

```bash
# start the app
pnpm start-dev  # development, runs with 'pm2'
pnpm start-node # development, runs with 'node'
pnpm start-prod # production,  runs with 'pm2'

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

# Set up pm2 to restart the app on server reboots
pm2 startup

# Save the pm2 process list
pm2 save
```

## Updating in prod

One-liner to update and restart the bot in your server with minimal downtime:

```
git pull && pnpm i && pm2 stop socialbots && pm2 flush && pnpm start-prod && pm2 save
```
