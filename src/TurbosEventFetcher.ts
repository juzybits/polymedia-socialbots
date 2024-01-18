import { EventId, SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { formatNumber, sleep } from '@polymedia/suits';

const TURBOS_SWAP_EVENT = '0x91bfbc386a41afcfd9b2533058d7e915a1d3829089cc268ff4333d54d6339ca1::pool::SwapEvent';

export type TradeEvent = {
    txn: string;
    sender: string;
    kind: 'buy'|'sell';
    amountA: number;
    amountB: number;
    date: Date;
}

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

export class TurbosEventFetcher {
    private poolId: string;
    private suiClient: SuiClient;
    private eventCursor: EventId|null;
    private rateLimitDelay = 334; // how long to sleep between RPC requests, in milliseconds

    constructor(poolId: string) {
        this.poolId = poolId;
        this.suiClient = new SuiClient({ url: getFullnodeUrl('mainnet')});
        this.eventCursor = null;
    }

    public async fetchTradeEvents(): Promise<TradeEvent[]> {
        try {
            if (!this.eventCursor) { // 1st run
                await this.fetchLastEventAndUpdateCursor();
                return [];
            } else {
                return await this.fetchEventsFromCursor();
            }
        } catch(error) {
            console.error(`[TurbosEventFetcher] ${error}`);
            return [];
        }
    }

    private async fetchLastEventAndUpdateCursor(): Promise<void>
    {
        console.debug(`--- [TurbosEventFetcher] fetchLastEventAndUpdateCursor()`);

        // fetch last event
        const suiEvents = await this.suiClient.queryEvents({
            query: { MoveEventType: TURBOS_SWAP_EVENT },
            limit: 1,
            order: 'descending',
        });

        // update cursor
        if (!suiEvents.nextCursor) {
            console.error(`[TurbosEventFetcher] unexpected missing cursor`);
        } else {
            this.eventCursor = suiEvents.nextCursor;
            // this.eventCursor = {
            //     txDigest: '3TqbCXKaNHDNvQatYas2D4cx2rqfVUhNtA3kPEK2JXUN',
            //     eventSeq: '0',
            // }
        }
    }

    private async fetchEventsFromCursor(): Promise<TradeEvent[]>
    {
        console.debug(`--- [TurbosEventFetcher] fetchEventsFromCursor()`);

        // fetch events from cursor
        const suiEvents = await this.suiClient.queryEvents({
            query: { MoveEventType: TURBOS_SWAP_EVENT },
            cursor: this.eventCursor,
            order: 'ascending',
            // limit: 10,
        });

        // update cursor
        if (!suiEvents.nextCursor) {
            console.error(`[TurbosEventFetcher] unexpected missing cursor`);
            return [];
        }
        this.eventCursor = suiEvents.nextCursor;

        // parse events
        const tradeEvents: TradeEvent[] = [];
        for (const suiEvent of suiEvents.data) {
            const turbosEventData = suiEvent.parsedJson as TurbosSwapEventData;
            if (turbosEventData.pool !== this.poolId) {
                continue;
            }
            const tradeEvent: TradeEvent =  {
                txn: suiEvent.id.txDigest,
                sender: suiEvent.sender,
                kind: turbosEventData.a_to_b ? 'sell' : 'buy',
                amountA: Number(turbosEventData.amount_a),
                amountB: Number(turbosEventData.amount_b),
                date: new Date(Number(suiEvent.timestampMs)),
            };
            tradeEvents.push(tradeEvent);
        }
        // console.debug('suiEvents.data.length:', suiEvents.data.length)
        // console.debug('hasNextPage:', suiEvents.hasNextPage);
        // console.debug('nextCursor:', suiEvents.nextCursor ? suiEvents.nextCursor.txDigest : 'none');

        // call this function recursively if there's newer events that didn't fit in the page
        if (suiEvents.hasNextPage) {
            // console.debug(`[TurbosEventFetcher] has next page, will fetching recursively`);
            await sleep(this.rateLimitDelay);
            const nextEvents = await this.fetchEventsFromCursor();
            tradeEvents.push(...nextEvents);
        }

        return tradeEvents;
    }
}
