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

    public toString(trade: TurbosTrade, priceUsd: number): string {
        const { amountA, amountB, amountUsd, urlTxn, urlSender, emojis } = this.getMessageParts(trade, priceUsd);
        return `
${emojis}
*${trade.kind.toUpperCase()} $${amountUsd}*
${this.tickerB}: ${amountB}
${this.tickerA}: ${amountA}
${this.tickerA}/USD: ${formatNumber(priceUsd)}
[Sender](${urlSender}) | [Transaction](${urlTxn})`;
    }

    private getMessageParts(trade: TurbosTrade, priceUsd: number) {
        const amountA = trade.amountA / this.dividerA;
        const amountB = trade.amountB / this.dividerB;
        const amountUsd = amountA * priceUsd;
        const emoji = trade.kind === 'buy' ? '🟢' : '🔴';
        const emojiCount = Math.max(1, Math.floor(amountUsd / 1000));
        const emojis = emoji.repeat(emojiCount);
        return {
            amountA: formatNumber(amountA, 'compact'),
            amountB: formatNumber(amountB, 'compact'),
            amountUsd: formatNumber(amountUsd),
            urlTxn: makeExplorerUrl('mainnet', 'txblock', trade.txn),
            urlSender: makeExplorerUrl('mainnet', 'address', trade.sender),
            emojis,
        };
    }
}
