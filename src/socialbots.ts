import { sleep } from '@polymedia/suits';
import { DISCORD_BOT_TOKEN } from './.auth.js';
import {
    DISCORD_CHANNEL_ID,
    TURBOS_DECIMALS_A,
    TURBOS_DECIMALS_B,
    TURBOS_POOL_ID,
    TURBOS_WATCH_FREQUENCY
} from './.config.js';
import { BotDiscord } from './BotDiscord.js';
import { TurbosEventFetcher } from './TurbosEventFetcher.js';

const eventFetcher = new TurbosEventFetcher(TURBOS_POOL_ID, TURBOS_DECIMALS_A, TURBOS_DECIMALS_B);
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
    console.log(`TURBOS_WATCH_FREQUENCY: ${TURBOS_WATCH_FREQUENCY}`);
    console.log(`TURBOS_POOL_ID: ${TURBOS_POOL_ID}\n`);
    while (true) {
        await main();
        await sleep(TURBOS_WATCH_FREQUENCY);
    }
})();
