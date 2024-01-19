import { sleep } from '@polymedia/suits';
import { DISCORD_BOT_TOKEN } from './.auth.js';
import { DISCORD_CHANNEL_ID, LOOP_DELAY, TURBOS } from './.config.js';
import { BotDiscord } from './BotDiscord.js';
import { TurbosTradeFetcher } from './TurbosTradeFetcher.js';
import { TurbosTradeFormatter } from './TurbosTradeFormatter.js';

const turbosTradeFetcher = new TurbosTradeFetcher(TURBOS.POOL_ID);
const turbosTradeFormatter = new TurbosTradeFormatter(
    TURBOS.TICKER_A,
    TURBOS.TICKER_B,
    TURBOS.DECIMALS_A,
    TURBOS.DECIMALS_B
);
const botDiscord = new BotDiscord(DISCORD_BOT_TOKEN, DISCORD_CHANNEL_ID);

async function main() {
    const tradeEvents = await turbosTradeFetcher.fetchTrades();
    for (const tradeEvent of tradeEvents) {
        const eventStr = turbosTradeFormatter.toString(tradeEvent);
        botDiscord.sendMessage(eventStr)
        console.debug(eventStr);
    }
    // console.debug(`(main) events.length: ${tradeEvents.length}\n`);
}

(async () => {
    // console.log('Starting...');
    // console.log(`LOOP_DELAY: ${LOOP_DELAY}`);
    // console.log(`TURBOS.POOL_ID: ${TURBOS.POOL_ID}\n`);
    await main();
    while (true) {
        await main();
        await sleep(LOOP_DELAY);
    }
})();
