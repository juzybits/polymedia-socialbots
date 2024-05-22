export class PriceFetcher {
    private dexScreenerApiUrl: string;

    constructor(poolId: string) {
        this.dexScreenerApiUrl = `https://api.dexscreener.com/latest/dex/pairs/sui/${poolId}`;
    }

    public async fetchPriceUsd(): Promise<number|null> {
        try {
            const resp = await fetch(this.dexScreenerApiUrl);
            if (!resp.ok) {
                console.error("ERROR | PriceFetcher response not ok | status:", resp.status);
                return null;
            }
            /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
            const data = await resp.json();
            const priceUsd = data?.pair?.priceUsd;
            if (!priceUsd) {
                console.error("ERROR | PriceFetcher malformed response | data:", data);
                return null;
            }
            return parseFloat(priceUsd);
            /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
        } catch (error) {
            console.error("ERROR | PriceFetcher request failed |", error);
            return null;
        }
    }

}
