export class PriceFetcher {
    private dexScreenerApiUrl: string;

    constructor(poolId: string) {
        this.dexScreenerApiUrl = `https://api.dexscreener.com/latest/dex/pairs/sui/${poolId}`;
    }

    public async fetchPriceUsd(): Promise<number|null> {
        try {
            const resp = await fetch(this.dexScreenerApiUrl);
            if (!resp.ok) {
                console.error('ERROR | PriceFetcher response not ok | status:', resp.status);
                return null;
            }
            const data = await resp.json();
            const priceUsd = data?.pair?.priceUsd;
            if (!priceUsd) {
                console.error('ERROR | PriceFetcher malformed response | data:', data);
                return null;
            }
            return parseFloat(priceUsd);
        } catch (error) {
            console.error(`ERROR | PriceFetcher request failed |`, error);
            return null;
        }
    }

}
