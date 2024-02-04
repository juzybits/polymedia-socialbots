import { sleep } from '@polymedia/suits';
import { DISCORD_BOT_TOKEN } from './.auth.js';
import { APP_ENV, DISCORD, LOOP_DELAY, TURBOS } from './.config.js';
import { BotDiscord } from './BotDiscord.js';
import { TurbosTradeFetcher } from './TurbosTradeFetcher.js';
import { TurbosTradeFormatter } from './TurbosTradeFormatter.js';

const turbosTradeFetcher = new TurbosTradeFetcher(TURBOS.POOL_ID, TURBOS.NEXT_CURSOR);
const turbosTradeFormatter = new TurbosTradeFormatter(
    TURBOS.TICKER_A,
    TURBOS.TICKER_B,
    TURBOS.DECIMALS_A,
    TURBOS.DECIMALS_B
);
const botDiscord = new BotDiscord(DISCORD_BOT_TOKEN, DISCORD.CHANNEL_ID);

async function main() {
    // fetch new trade events
    const tradeEvents = await turbosTradeFetcher.fetchTrades();
    for (const tradeEvent of tradeEvents) {
        // skip small trades
        if ( tradeEvent.amountB < TURBOS.MINIMUM_TRADE_SIZE_B * (10**TURBOS.DECIMALS_B) ) {
            continue;
        }
        // post a message
        const eventStr = turbosTradeFormatter.toString(tradeEvent);
        if (DISCORD.ENABLED) {
            botDiscord.sendMessage(eventStr); // TODO: handle rate limits
        }
        console.debug(eventStr);
    }
    // console.debug(`(main) events.length: ${tradeEvents.length}\n`);
}

(async () => {
    console.log(`Starting in ${APP_ENV} mode...`);
    while (true) {
        await main();
        await sleep(LOOP_DELAY);
    }
})();

// TODO: https://api.dexscreener.com/latest/dex/pairs/sui/${TURBOS.POOL_ID}
// - Show USD value of trade
// - Show USD exchange rate
// - Show FDV or market cap
