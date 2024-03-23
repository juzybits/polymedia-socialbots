import { formatNumber, makeExplorerUrl } from '@polymedia/suits';
import { TurbosTrade } from './TurbosTradeFetcher';

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
        const { amountA, amountB, urlTxn, urlSender, emojis } = this.getMessageParts(trade);
        return `
${emojis}
${trade.kind.toUpperCase()}
${this.tickerA}: ${amountA}
${this.tickerB}: ${amountB}
[Transaction](${urlTxn}) | [Sender](${urlSender})`;
    }

    private getMessageParts(trade: TurbosTrade) {
        const amountA = trade.amountA / this.dividerA;
        const amountB = trade.amountB / this.dividerB;
        const emoji = trade.kind === 'buy' ? '🟢' : '🔴';
        const emojiCount = 1 + Math.floor(amountB / 1000); // 1 extra emoji for every 1000 units of amountB
        const emojis = emoji.repeat(emojiCount);
        return {
            amountA: formatNumber(amountA, 'compact'),
            amountB: formatNumber(amountB, 'compact'),
            urlTxn: makeExplorerUrl('mainnet', 'txblock', trade.txn),
            urlSender: makeExplorerUrl('mainnet', 'address', trade.sender),
            emojis,
        };
    }
}
