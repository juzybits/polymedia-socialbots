# Polymedia SocialBots

Fetch Sui onchain events and post messages to social media.

![Polymedia SocialBots](https://assets.polymedia.app/img/socialbots/open-graph.webp?x=1)

It monitors trades on Turbos Finance and posts messages to Discord and Telegram, but can be extended to support other onchain events and social media platforms.

## Bot setup

### Discord

1. Create a Discord bot, copy the bot API token, and add it to `.env`.<br/>
https://discord.com/developers/applications

2. Add the bot to your Discord server by visiting this URL. It only needs the "send messages" permission.<br/>
https://discord.com/api/oauth2/authorize?client_id=YOUR_APPLICATION_ID&permissions=2048&scope=bot

3. Find the Discord channel ID where you want the bot to send messages. To do this, enable Discord developer mode, right click on the Discord channel, and click `Copy Channel ID`.

4. Open `src/config.ts` and set `DISCORD.CHANNEL_ID` accordingly.

### Telegram

1. Create a Telegram bot, copy the bot API token, and add it to `.env`.<br/>
https://t.me/botfather

2. Add the bot to your Telegram group.

3. Find the Telegram group name and thread ID where you want the bot to send messages. To do this, right click on a message and click "Copy Message Link", which gives you something like `https://t.me/yourgroup/69/420`.

4. Open `src/config.ts` and set `TELEGRAM.GROUP_ID: '@yourgroup'` and `TELEGRAM.THREAD_ID: '69'`.

## Installation

```bash
# Install required NPM packages globally:
npm add -g pnpm pm2

# Clone and install the repo:
git clone https://github.com/juzybits/polymedia-socialbots.git
cd polymedia-socialbots
pnpm install

# Add your authentication credentials (see 'Bot setup' section)
cp .env.example .env

# Modify the configuration (see 'Bot setup' section)
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
