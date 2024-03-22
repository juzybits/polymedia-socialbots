/**
 * Selected Turbos swap event data.
 */
export type TurbosTrade = {
    txn: string;
    sender: string;
    kind: 'buy'|'sell';
    amountA: number;
    amountB: number;
    date: Date;
}
