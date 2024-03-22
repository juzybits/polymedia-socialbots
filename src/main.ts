import { sleep } from '@polymedia/suits';
import dotenv from 'dotenv';
import { BotDiscord } from './BotDiscord.js';
import { TurbosTradeFetcher } from './TurbosTradeFetcher.js';
import { TurbosTradeFormatter } from './TurbosTradeFormatter.js';
import { APP_ENV, DISCORD, LOOP_DELAY, TELEGRAM, TURBOS } from './config.js';
import { BotTelegram } from './BotTelegram.js';

/* Read API credentials */
dotenv.config();
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!DISCORD_BOT_TOKEN || !TELEGRAM_BOT_TOKEN) {
    throw new Error('Error: Missing required environment variables.');
}

const turbosTradeFetcher = new TurbosTradeFetcher(TURBOS.POOL_ID, TURBOS.NEXT_CURSOR);
const turbosTradeFormatter = new TurbosTradeFormatter(
    TURBOS.TICKER_A,
    TURBOS.TICKER_B,
    TURBOS.DECIMALS_A,
    TURBOS.DECIMALS_B
);
const botDiscord = new BotDiscord(DISCORD_BOT_TOKEN, DISCORD.CHANNEL_ID);
const botTelegram = new BotTelegram(TELEGRAM_BOT_TOKEN, TELEGRAM.GROUP_ID, TELEGRAM.THREAD_ID);

async function main() {
    // fetch new trade events
    const tradeEvents = await turbosTradeFetcher.fetchTrades();
    for (const tradeEvent of tradeEvents) {
        // skip small trades
        if ( tradeEvent.amountB < TURBOS.MINIMUM_TRADE_SIZE_B * (10**TURBOS.DECIMALS_B) ) {
            continue;
        }
        // post a message // TODO: handle request errors, rate limits, etc
        const eventStr = turbosTradeFormatter.toString(tradeEvent);
        if (DISCORD.ENABLED) {
            void botDiscord.sendMessage(eventStr);
        }
        if (TELEGRAM.ENABLED) {
            void botTelegram.sendMessage(eventStr);
        }
        console.debug(eventStr);
    }
    // console.debug(`(main) events.length: ${tradeEvents.length}\n`);
}

void (async () => {
    console.log(`Starting in ${APP_ENV} mode...`);
    while (true) { // eslint-disable-line
        await main();
        await sleep(LOOP_DELAY);
    }
})();

// TODO: https://api.dexscreener.com/latest/dex/pairs/sui/${TURBOS.POOL_ID}
// - Show USD value of trade
// - Show USD exchange rate
// - Show FDV or market cap
