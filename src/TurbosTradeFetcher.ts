import { SuiClient, SuiEvent } from "@mysten/sui/client";
import { SuiEventFetcher } from "@polymedia/suitcase-core";
import { TurbosConfig } from "./config.js";

const TURBOS_SWAP_EVENT = "0x91bfbc386a41afcfd9b2533058d7e915a1d3829089cc268ff4333d54d6339ca1::pool::SwapEvent";

/**
 * Selected Turbos swap event data.
 */
export type TurbosTrade = {
    txn: string;
    sender: string;
    kind: "buy"|"sell";
    amountA: number;
    amountB: number;
    date: Date;
};

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
};

/**
 * Fetch the latest Turbos trades for a given pool.
 * @see TurbosTradeFetcher.fetchTrades
 */
export class TurbosTradeFetcher {
    private poolId: string;
    private suiEventFetcher: SuiEventFetcher<TurbosTrade>;

    constructor(suiClient: SuiClient, config: TurbosConfig) {
        this.poolId = config.POOL_ID;
        this.suiEventFetcher = new SuiEventFetcher<TurbosTrade>(
            suiClient,
            TURBOS_SWAP_EVENT,
            this.parseTurbosEvent.bind(this),
            config.NEXT_CURSOR,
        );
    }

    /**
     * Fetch the latest Turbos trades for a given pool. Every time the function
     * is called it looks for events that took place since the last call.
     */
    public async fetchTrades(): Promise<TurbosTrade[]> {
        return this.suiEventFetcher.fetchEvents();
    }

    private parseTurbosEvent(suiEvent: SuiEvent): TurbosTrade|null {
        const turbosEventData = suiEvent.parsedJson as TurbosSwapEventData;
        if (turbosEventData.pool !== this.poolId) {
            return null;
        }
        const trade: TurbosTrade =  {
            txn: suiEvent.id.txDigest,
            sender: suiEvent.sender,
            kind: turbosEventData.a_to_b ? "sell" : "buy",
            amountA: Number(turbosEventData.amount_a),
            amountB: Number(turbosEventData.amount_b),
            date: new Date(Number(suiEvent.timestampMs)),
        };
        return trade;
    }
}
