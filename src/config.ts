export const APP_ENV = process.env.NODE_ENV === 'prod' ? 'prod' : 'dev';
const isProd = APP_ENV === 'prod';

/** How long to delay between executions in the main script */
export const LOOP_DELAY = 8_000;

/**
 * Discord bot configuration.
 * This is for the Fud the Pug Discord - change the CHANNEL_ID below.
 */
export const DISCORD_CONFIG: DiscordConfig = {
    /** The Discord channel where to send messages. */
    CHANNEL_ID: isProd ? '1221871606142337094' : '1197639273864777798',
    /** Enable/disable sending Discord messages. */
    ENABLED: isProd
        ? 'all'  // prod
        : 'all', // dev
};

/**
 * Telegram bot configuration.
 * This is for the Fud the Pug Telegram - change the GROUP_ID and THREAD_ID below.
 */
export const TELEGRAM_CONFIG: TelegramConfig = {
    /** The Telegram group where to send messages. */
    GROUP_ID: isProd ? '@fudthepug' : '@testfudgroup',
    /** (optional) The Telegram thread where to send messages. */
    THREAD_ID: isProd ? null : '3',
    /** Enable/disable sending Telegram messages. */
    ENABLED: isProd
        ? 'buys'  // prod
        : 'buys', // dev
};

/**
 * TurbosTradeFetcher configuration.
 * This is for FUD/SUI - adapt it for the pool you want to track.
 */
export const TURBOS_CONFIG: TurbosConfig = {
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
    MINIMUM_TRADE_SIZE_B: 1000,
    /** To fetch swap events starting at an older cursor (handy for development). */
    NEXT_CURSOR: isProd
        ? null  // prod
        : null, // dev
        // : { eventSeq: '0', txDigest: 'CbUNRvuSDfGLaPkCk9oMXAQAHF9Hw4k3eQD1oEWkAdXW' }, // dev
};

/* Types */

export type EnabledStatus = 'all' | 'none' | 'buys' | 'sells';

export type DiscordConfig = {
    CHANNEL_ID: string;
    ENABLED: EnabledStatus;
};

export type TelegramConfig = {
    GROUP_ID: string;
    THREAD_ID: string|null;
    ENABLED: EnabledStatus;
}

export type TurbosConfig = {
    POOL_ID: string;
    TICKER_A: string;
    TICKER_B: string;
    DECIMALS_A: number;
    DECIMALS_B: number;
    MINIMUM_TRADE_SIZE_B: number;
    NEXT_CURSOR: null;
};
