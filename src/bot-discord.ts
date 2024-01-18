import { DISCORD_BOT_TOKEN } from './.auth.js'
import { sleep } from '@polymedia/suits';

const FREQUENCY = 5_000;

async function main() {
    console.log("HI");

}

(async () => {
    console.log('Starting bot-discord...');
    console.log(`DISCORD_BOT_TOKEN: ${DISCORD_BOT_TOKEN.substring(0, 1)}...${DISCORD_BOT_TOKEN.slice(-1)}`);
    while (true) {
        await main();
        await sleep(FREQUENCY);
    }
})();
