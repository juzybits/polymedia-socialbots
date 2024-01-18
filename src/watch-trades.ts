import { TurbosEventFetcher } from './TurbosEventFetcher.js';
import { sleep } from './utils.js';

const FREQUENCY = 5_000;
const EVENT_TYPE = '0x91bfbc386a41afcfd9b2533058d7e915a1d3829089cc268ff4333d54d6339ca1::pool::SwapEvent';
const POOL_ID = '';

const eventFetcher = new TurbosEventFetcher(EVENT_TYPE, POOL_ID);

async function main() {
    const events = await eventFetcher.fetchEvents();
    console.log(`(main) events.length: ${events.length}\n`);
}

(async () => {
    console.log('Starting watch-trades...');
    console.log(`FREQUENCY: ${FREQUENCY}`);
    console.log(`EVENT_TYPE: ${EVENT_TYPE}`);
    console.log(`POOL_ID: ${POOL_ID}\n`);
    while (true) {
        await main();
        await sleep(FREQUENCY);
    }
})();
