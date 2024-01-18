# Polymedia SocialBots

Bots for Twitter, Telegram, Discord.

## Installation

Install required tools:

```
npm add -g pnpm pm2
```

Clone and install the repo:

```
git clone https://github.com/juzybits/polymedia-commando.git
cd polymedia-commando
pnpm install
```

Create and modify `src/.auth.ts`:

```
cp src/.auth.example.ts src/.auth.ts
```

Modify `src/.config.ts`.

## Usage
```
pnpm start-socialbots # production, runs with 'pm2'
pnpm start-socialbots-dev # develompent, runs with 'node'

pm2 logs socialbots

pm2 stop socialbots
```

## Adding the bots

### Discord

https://discord.com/api/oauth2/authorize?client_id=1197621113585410078&permissions=2048&scope=bot
