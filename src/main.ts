import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { sleep } from '@polymedia/suits';
import dotenv from 'dotenv';
import { BotAbstract } from './BotAbstract.js';
import { BotDiscord } from './BotDiscord.js';
import { BotTelegram } from './BotTelegram.js';
import { PriceFetcher } from './PriceFetcher.js';
import { TurbosTradeFetcher } from './TurbosTradeFetcher.js';
import { TurbosTradeFormatter } from './TurbosTradeFormatter.js';
import { APP_ENV, DISCORD_CONFIG, LOOP_DELAY, TELEGRAM_CONFIG, TURBOS_CONFIG } from './config.js';

/* Initialize Turbos */

const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet')});
const turbosTradeFetcher = new TurbosTradeFetcher(suiClient, TURBOS_CONFIG);
const turbosTradeFormatter = new TurbosTradeFormatter(TURBOS_CONFIG);

/* Initialize bots */

dotenv.config(); // read API credentials

const bots: BotAbstract[] = [];

if (DISCORD_CONFIG.ENABLED !== 'none') {
    const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    if (!DISCORD_BOT_TOKEN) {
        throw new Error('Error: Missing DISCORD_BOT_TOKEN environment variable.');
    }
    const botDiscord = new BotDiscord(DISCORD_BOT_TOKEN, DISCORD_CONFIG);
    bots.push(botDiscord);
}

if (TELEGRAM_CONFIG.ENABLED !== 'none') {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (!TELEGRAM_BOT_TOKEN) {
        throw new Error('Error: Missing TELEGRAM_BOT_TOKEN environment variable.');
    }
    const botTelegram = new BotTelegram(TELEGRAM_BOT_TOKEN, TELEGRAM_CONFIG);
    bots.push(botTelegram);
}

/* Initialize PriceFetcher */

const priceFetcher = new PriceFetcher(TURBOS_CONFIG.POOL_ID);

/* Main loop */

async function main()
{
    // fetch new trade events
    const tradeEvents = await turbosTradeFetcher.fetchTrades();
    if (tradeEvents.length === 0) {
        return;
    }

    // fetch USD price
    const priceUsd = await priceFetcher.fetchPriceUsd();
    if (!priceUsd) {
        return;
    }

    for (const tradeEvent of tradeEvents)
    {
        // skip small trades
        const minB = TURBOS_CONFIG.MINIMUM_TRADE_SIZE_B;
        const minBScaled = minB * (10**TURBOS_CONFIG.DECIMALS_B);
        const isSmallTrade = (minB > 0) && (tradeEvent.amountB < minBScaled);
        if (isSmallTrade) {
            continue;
        }

        // format the trade event message
        const eventStr = turbosTradeFormatter.toString(tradeEvent, priceUsd);
        console.debug(eventStr);

        // send the message through all bots in parallel
        const promises = bots
            .filter(bot => {
                const enabled = bot.getEnabledStatus();
                return enabled === 'all'
                    || (enabled === 'buys' && tradeEvent.kind === 'buy')
                    || (enabled === 'sells' && tradeEvent.kind === 'sell');
            })
            .map(bot => {
                return bot.sendMessage(eventStr);
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
