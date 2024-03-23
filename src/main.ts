import { sleep } from '@polymedia/suits';
import dotenv from 'dotenv';
import { BotAbstract } from './BotAbstract.js';
import { BotDiscord } from './BotDiscord.js';
import { BotTelegram } from './BotTelegram.js';
import { TurbosTradeFetcher } from './TurbosTradeFetcher.js';
import { TurbosTradeFormatter } from './TurbosTradeFormatter.js';
import { APP_ENV, DISCORD, LOOP_DELAY, TELEGRAM, TURBOS } from './config.js';

/* Initialize Turbos */

const turbosTradeFetcher = new TurbosTradeFetcher(TURBOS.POOL_ID, TURBOS.NEXT_CURSOR);
const turbosTradeFormatter = new TurbosTradeFormatter(
    TURBOS.TICKER_A,
    TURBOS.TICKER_B,
    TURBOS.DECIMALS_A,
    TURBOS.DECIMALS_B
);

/* Initialize bots */

dotenv.config(); // read API credentials

const bots: BotAbstract[] = [];

if (DISCORD.ENABLED) {
    const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    if (!DISCORD_BOT_TOKEN) {
        throw new Error('Error: Missing DISCORD_BOT_TOKEN environment variable.');
    }
    const botDiscord = new BotDiscord(DISCORD_BOT_TOKEN, DISCORD.CHANNEL_ID);
    bots.push(botDiscord);
}

if (TELEGRAM.ENABLED) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (!TELEGRAM_BOT_TOKEN) {
        throw new Error('Error: Missing TELEGRAM_BOT_TOKEN environment variable.');
    }
    const botTelegram = new BotTelegram(TELEGRAM_BOT_TOKEN, TELEGRAM.GROUP_ID, TELEGRAM.THREAD_ID);
    bots.push(botTelegram);
}

/* Main loop */

async function main()
{
    // fetch new trade events
    const tradeEvents = await turbosTradeFetcher.fetchTrades();

    for (const tradeEvent of tradeEvents)
    {
        // skip small trades
        if (tradeEvent.amountB < TURBOS.MINIMUM_TRADE_SIZE_B * (10**TURBOS.DECIMALS_B)) {
            continue;
        }

        // log the trade event
        const eventStr = turbosTradeFormatter.toString(tradeEvent);
        console.debug(eventStr);

        // send the message through all bots in parallel
        const promises = bots.map(bot => {
            let message: string;
            if (bot instanceof BotDiscord) {
                message = turbosTradeFormatter.toDiscordString(tradeEvent);
            } else if (bot instanceof BotTelegram) {
                message = turbosTradeFormatter.toTelegramString(tradeEvent);
            } else {
                message = eventStr;
            }
            return bot.sendMessage(message)
        });
        await Promise.all(promises); // errors are handled by BotAbstract
    }
}

/* Start main loop */

void (async () => {
    console.log(`Starting in ${APP_ENV} mode with: ${bots.map(bot => bot.constructor.name).join(', ')}`);
    while (true) { // eslint-disable-line
        await main();
        await sleep(LOOP_DELAY);
    }
})();
