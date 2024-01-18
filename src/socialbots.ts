import { sleep } from '@polymedia/suits';
import { TurbosEventFetcher } from './TurbosEventFetcher.js';
import {
    TURBOS_DECIMALS_A,
    TURBOS_DECIMALS_B,
    TURBOS_POOL_ID,
    TURBOS_WATCH_FREQUENCY
} from './.config.js';

const eventFetcher = new TurbosEventFetcher(TURBOS_POOL_ID, TURBOS_DECIMALS_A, TURBOS_DECIMALS_B);

async function main() {
    const events = await eventFetcher.fetchEvents();
    console.log(`(main) events.length: ${events.length}\n`);
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
