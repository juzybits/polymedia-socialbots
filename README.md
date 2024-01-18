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

Create and modify `.auth.js`:

```
cp src/.auth.example.ts src/.auth.ts
```

## Usage
```
pnpm start-watch-trades # production, runs with 'pm2'
pnpm start-watch-trades-dev # develompent, runs with 'node'

pm2 logs watch-trades

pm2 stop watch-trades
```
