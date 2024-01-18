import { sleep } from '@polymedia/suits';
import { TurbosEventFetcher } from './TurbosEventFetcher.js';
import { TURBOS_POOL_ID } from './.config.js';

const FREQUENCY = 5_000;
const EVENT_TYPE = '0x91bfbc386a41afcfd9b2533058d7e915a1d3829089cc268ff4333d54d6339ca1::pool::SwapEvent';

const eventFetcher = new TurbosEventFetcher(EVENT_TYPE, TURBOS_POOL_ID);

async function main() {
    const events = await eventFetcher.fetchEvents();
    console.log(`(main) events.length: ${events.length}\n`);
}

(async () => {
    console.log('Starting watch-trades...');
    console.log(`FREQUENCY: ${FREQUENCY}`);
    console.log(`EVENT_TYPE: ${EVENT_TYPE}`);
    console.log(`POOL_ID: ${TURBOS_POOL_ID}\n`);
    while (true) {
        await main();
        await sleep(FREQUENCY);
    }
})();
