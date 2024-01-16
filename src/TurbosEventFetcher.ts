import { EventId, SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { sleep } from './utils.js';

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
    private eventType: string;
    private poolId: string;
    private suiClient: SuiClient;
    private eventCursor: EventId|null;
    private rateLimitDelay = 334; // how long to sleep between RPC requests, in milliseconds

    constructor(eventType: string, poolId: string) {
        this.eventCursor = null;
        this.eventType = eventType;
        this.poolId = poolId;
        this.suiClient = new SuiClient({ url: getFullnodeUrl('mainnet')});
    }

    public async fetchEvents(): Promise<TradeEvent[]> {
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
            query: { MoveEventType: this.eventType },
            limit: 1,
            order: 'descending',
        });

        // update cursor
        if (!suiEvents.nextCursor) {
            console.error(`[TurbosEventFetcher] unexpected missing cursor`);
        } else {
            this.eventCursor = suiEvents.nextCursor;
            // this.eventCursor = {
            //     txDigest: 'H9UHHFt2HrhprSu3aVrJSZETHkHpbLPJ5QcdmjULzz7p', // Jan 16, 02:15 GMT
            //     eventSeq: '0',
            // }
        }
    }

    private async fetchEventsFromCursor(): Promise<TradeEvent[]>
    {
        console.debug(`--- [TurbosEventFetcher] fetchEventsFromCursor()`);

        // fetch events from cursor
        const suiEvents = await this.suiClient.queryEvents({
            query: { MoveEventType: this.eventType },
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
            console.debug(
                tradeEvent.date,
                tradeEvent.sender.slice(-6),
                tradeEvent.kind,
                `https://suiexplorer.com/txblock/${tradeEvent.txn}?network=mainnet`,
                Math.trunc(tradeEvent.amountA/100_000).toLocaleString('en-US'),
                Math.trunc(tradeEvent.amountB/1_000_000_000).toLocaleString('en-US'),
            );
        }
        console.debug('suiEvents.data.length:', suiEvents.data.length)
        console.debug('hasNextPage:', suiEvents.hasNextPage);
        console.debug('nextCursor:', suiEvents.nextCursor ? suiEvents.nextCursor.txDigest : 'none');

        // call this function recursively if there's newer events that didn't fit in the page
        if (suiEvents.hasNextPage) {
            console.debug(`[TurbosEventFetcher] has next page, will fetching recursively`);
            await sleep(this.rateLimitDelay);
            const nextEvents = await this.fetchEventsFromCursor();
            tradeEvents.push(...nextEvents);
        }

        return tradeEvents;
    }
}
