import { BotAbstract } from './BotAbstract.js';
import { DiscordConfig, EnabledStatus } from './config.js';

export class BotDiscord extends BotAbstract
{
    protected enabledStatus: EnabledStatus;
    private botToken: string;
    private channelId: string;

    constructor(botToken: string, config: DiscordConfig) {
        super();
        this.botToken = botToken;
        this.channelId = config.CHANNEL_ID;
        this.enabledStatus = config.ENABLED;
    }

    protected getSendMessageUrl(): string {
        return `https://discord.com/api/v10/channels/${this.channelId}/messages`;
    }

    protected getHeaders(): HeadersInit {
        return {
            'Authorization': `Bot ${this.botToken}`,
            'Content-Type': 'application/json',
        };
    }

    protected getBody(message: string): BodyInit {
        return JSON.stringify({
            content: message,
            flags: 1 << 2, // SUPPRESS_EMBEDS
        });
    }
}
