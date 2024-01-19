import { formatNumber, makeSuiExplorerUrl } from '@polymedia/suits';
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
        // add 1 extra emoji for every 1000 units of amountB starting at 2000 units
        // so (2000 units gets 2 emojis, 3000 units get 3 emojis, and so on)
        const numExtraEmojis = amountB < 2000 ? 0 : Math.floor((amountB - 1000) / 1000);;
        const extraEmojis = emoji.repeat(numExtraEmojis);
        return `
${emoji}${extraEmojis}
**${trade.kind.toUpperCase()}**
${this.tickerA}: ${formatNumber(amountA)}
${this.tickerB}: ${formatNumber(amountB)}
transaction:
${makeSuiExplorerUrl('mainnet', 'txblock', trade.txn)}
sender:
${makeSuiExplorerUrl('mainnet', 'address', trade.sender)}`;
    }
}
