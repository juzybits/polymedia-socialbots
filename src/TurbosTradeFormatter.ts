import { formatNumber } from '@polymedia/suits';
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
        return `
--- ${trade.kind} ---
${this.tickerA}: ${formatNumber(trade.amountA/this.dividerA)}
${this.tickerB}: ${formatNumber(trade.amountB/this.dividerB)}
sender: ${trade.sender}
txn: https://suiexplorer.com/txblock/${trade.txn}?network=mainnet`;
    }
}
