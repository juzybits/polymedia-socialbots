/**
 * A social media client who can post a message (Discord, Telegram, Twitter).
 */
export type Bot = {
    sendMessage(message: string): Promise<boolean>;
}

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
