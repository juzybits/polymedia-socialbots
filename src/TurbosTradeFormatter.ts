import { formatNumber, makeExplorerUrl } from '@polymedia/suits';
import { TurbosTrade } from './types';

export class TurbosTradeFormatter
{
    private tickerA: string;
    private tickerB: string;
    private dividerA: number;
    private dividerB: number;

    constructor(tickerA: string, tickerB: string, decimalsA: number, decimalsB: number) {
        this.tickerA = tickerA;
        this.tickerB = tickerB;
        this.dividerA = 10 ** decimalsA;
        this.dividerB = 10 ** decimalsB;
    }

    public toString(trade: TurbosTrade): string {
        const amountA = trade.amountA / this.dividerA;
        const amountB = trade.amountB / this.dividerB;
        const emoji = trade.kind === 'buy' ? '🟢' : '🔴';
        const emojiCount = 1 + Math.floor(amountB / 1000); // 1 extra emoji for every 1000 units of amountB
        const emojis = emoji.repeat(emojiCount);
        return `
${emojis}
${trade.kind.toUpperCase()}
${this.tickerA}: ${formatNumber(amountA, 'compact')}
${this.tickerB}: ${formatNumber(amountB, 'compact')}
Transaction: ${makeExplorerUrl('mainnet', 'txblock', trade.txn)}
Sender: ${makeExplorerUrl('mainnet', 'address', trade.sender)}`;
    }
}
