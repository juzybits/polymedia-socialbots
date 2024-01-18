import { sleep } from '@polymedia/suits';
import { DISCORD_BOT_TOKEN } from './.auth.js';
import { DISCORD_CHANNEL_ID, LOOP_DELAY, TURBOS } from './.config.js';
import { BotDiscord } from './BotDiscord.js';
import { TurbosEventFetcher } from './TurbosEventFetcher.js';

const eventFetcher = new TurbosEventFetcher(TURBOS.POOL_ID, TURBOS.DECIMALS_A, TURBOS.DECIMALS_B);
const botDiscord = new BotDiscord(DISCORD_BOT_TOKEN, DISCORD_CHANNEL_ID);

async function main() {
    const tradeEvents = await eventFetcher.fetchTradeEvents();
    for (const tradeEvent of tradeEvents) {
        const eventStr = eventFetcher.formatTradeEvent(tradeEvent);
        botDiscord.sendMessage(eventStr)
        console.debug(eventStr);
    }
    // console.debug(`(main) events.length: ${tradeEvents.length}\n`);
}

(async () => {
    console.log('Starting...');
    console.log(`LOOP_DELAY: ${LOOP_DELAY}`);
    console.log(`TURBOS.POOL_ID: ${TURBOS.POOL_ID}\n`);
    while (true) {
        await main();
        await sleep(LOOP_DELAY);
    }
})();
