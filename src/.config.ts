export const APP_ENV = process.env.NODE_ENV === 'prod' ? 'prod' : 'dev';
const isProd = process.env.NODE_ENV === 'prod';

/**
 * Discord bot configuration.
 * This is for the FUD Discord - change the CHANNEL_ID below.
 */
export const DISCORD = {
    /** The Discord channel where to send messages. */
    CHANNEL_ID: isProd ? '1199365779708190800' : '1197639273864777798',
    /** Enable/disable sending Discord messages. */
    ENABLED: isProd
        ? true  // prod
        : true, // dev
};

/**
 * TurbosTradeFetcher configuration.
 * This is for FUD/SUI - adapt it for the pool you want to track.
 */
export const TURBOS = {
    /** The Turbos Finance pool we want to watch. */
    POOL_ID: '0xbd85f61a1b755b6034c62f16938d6da7c85941705d9d10aa1843b809b0e35582', // FUD/SUI
    /** The 1st pair in the pool. */
    TICKER_A: 'FUD',
    /** The 2nd pair in the pool. */
    TICKER_B: 'SUI',
    /** The amount of decimals for the 1st pair in the pool. */
    DECIMALS_A: 5,
    /** The amount of decimals for the 2nd pair in the pool. */
    DECIMALS_B: 9,
    /** Ignore trades smaller than this amount of TICKER_B units. */
    MINIMUM_TRADE_SIZE_B: 100,
    /** To fetch swap events starting at an older cursor (handy for development). */
    NEXT_CURSOR: isProd
        ? null  // prod
        : null, // dev
        // : { eventSeq: '0', txDigest: 'CbUNRvuSDfGLaPkCk9oMXAQAHF9Hw4k3eQD1oEWkAdXW' }, // dev
};

/**
 * How long to delay between socialbots.ts executions (fetch Turbos events and send bot messages).
 */
export const LOOP_DELAY = 5_000;
