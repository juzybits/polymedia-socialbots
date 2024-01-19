import { EventId, SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { sleep } from '@polymedia/suits';
import { TurbosTrade } from './types';

const TURBOS_SWAP_EVENT = '0x91bfbc386a41afcfd9b2533058d7e915a1d3829089cc268ff4333d54d6339ca1::pool::SwapEvent';

/**
 * The full Turbos swap event data in raw form.
 */
type TurbosSwapEventData = {
    a_to_b: boolean;
    amount_a: string;
    amount_b: string;
    fee_amount: string;
    is_exact_in: boolean;
    liquidity: string;
    pool: string;
    protocol_fee: string;
    recipient: string;
    sqrt_price: string;
    tick_current_index: { bits: string };
    tick_pre_index: { bits: string };
}

/**
 * Fetch the latest Turbos trades for a given pool.
 * @see TurbosTradeFetcher.fetchTrades
 */
export class TurbosTradeFetcher {
    private poolId: string;
    private suiClient: SuiClient;
    private eventCursor: EventId|null;
    private rateLimitDelay = 334; // how long to sleep between RPC requests, in milliseconds

    constructor(poolId: string, nextCursor: EventId|null = null) {
        this.poolId = poolId;
        this.suiClient = new SuiClient({ url: getFullnodeUrl('mainnet')});
        this.eventCursor = nextCursor;
    }

    /**
     * Fetch the latest Turbos trades for a given pool. Every time the function
     * is called it looks for events that took place since the last call.
     */
    public async fetchTrades(): Promise<TurbosTrade[]> {
        try {
            if (!this.eventCursor) { // 1st run
                await this.fetchLastTradeAndUpdateCursor();
                return [];
            } else {
                return await this.fetchTradesFromCursor();
            }
        } catch(error) {
            console.error(`[TurbosTradeFetcher] ${error}`);
            return [];
        }
    }

    private async fetchLastTradeAndUpdateCursor(): Promise<void>
    {
        console.debug(`--- [TurbosTradeFetcher] fetchLastTradeAndUpdateCursor()`);

        // fetch last event
        const suiEvents = await this.suiClient.queryEvents({
            query: { MoveEventType: TURBOS_SWAP_EVENT },
            limit: 1,
            order: 'descending',
        });

        // update cursor
        if (!suiEvents.nextCursor) {
            console.error(`[TurbosTradeFetcher] unexpected missing cursor`);
        } else {
            this.eventCursor = suiEvents.nextCursor;
        }
    }

    private async fetchTradesFromCursor(): Promise<TurbosTrade[]>
    {
        console.debug(`--- [TurbosTradeFetcher] fetchTradesFromCursor()`);

        // fetch events from cursor
        const suiEvents = await this.suiClient.queryEvents({
            query: { MoveEventType: TURBOS_SWAP_EVENT },
            cursor: this.eventCursor,
            order: 'ascending',
            // limit: 10,
        });

        // update cursor
        if (!suiEvents.nextCursor) {
            console.error(`[TurbosTradeFetcher] unexpected missing cursor`);
            return [];
        }
        this.eventCursor = suiEvents.nextCursor;

        // parse events
        const trades: TurbosTrade[] = [];
        for (const suiEvent of suiEvents.data) {
            const turbosEventData = suiEvent.parsedJson as TurbosSwapEventData;
            if (turbosEventData.pool !== this.poolId) {
                continue;
            }
            const trade: TurbosTrade =  {
                txn: suiEvent.id.txDigest,
                sender: suiEvent.sender,
                kind: turbosEventData.a_to_b ? 'sell' : 'buy',
                amountA: Number(turbosEventData.amount_a),
                amountB: Number(turbosEventData.amount_b),
                date: new Date(Number(suiEvent.timestampMs)),
            };
            trades.push(trade);
        }
        // console.debug('suiEvents.data.length:', suiEvents.data.length)
        // console.debug('hasNextPage:', suiEvents.hasNextPage);
        // console.debug('nextCursor:', suiEvents.nextCursor ? suiEvents.nextCursor.txDigest : 'none');

        // call this function recursively if there's newer events that didn't fit in the page
        if (suiEvents.hasNextPage) {
            // console.debug(`[TurbosTradeFetcher] has next page, will fetching recursively`);
            await sleep(this.rateLimitDelay);
            const nextTrades = await this.fetchTradesFromCursor();
            trades.push(...nextTrades);
        }

        return trades;
    }
}
