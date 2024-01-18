/**
 * The channel where BotDiscord should send messages.
 */
export const DISCORD_CHANNEL_ID = '1197639273864777798'; // Polymedia #fud-trades

/**
 * Configuration for TurbosEventFetcher.
 */
export const TURBOS = {
    /**
     * The Turbos Finance pool we want to watch.
     */
    POOL_ID: '0xbd85f61a1b755b6034c62f16938d6da7c85941705d9d10aa1843b809b0e35582', // FUD/SUI
    /**
     * The amount of decimals for the 1st pair in the pool.
     */
    DECIMALS_A: 5, // FUD
    /**
     * The amount of decimals for the 2nd pair in the pool.
     */
    DECIMALS_B: 9, // SUI
};


/**
 * How long to delay between socialbots.ts executions (fetch Turbos events and send bot messages).
 */
export const LOOP_DELAY = 5_000;
