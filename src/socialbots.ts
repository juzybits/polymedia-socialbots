import { DiscordBot, TelegramBot, TwitterBot } from './bots.js';
import { getEvents } from './getEvents.js';

console.log('Starting @polymedia/socialbots...');

const twitterBot = new TwitterBot();
const telegramBot = new TelegramBot();
const discordBot = new DiscordBot();

setInterval(() => {
    const events = getEvents();
    twitterBot.sendMsg(JSON.stringify(events));
    telegramBot.sendMsg(JSON.stringify(events));
    discordBot.sendMsg(JSON.stringify(events));
}, 3000);
