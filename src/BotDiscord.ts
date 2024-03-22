import { BotAbstract } from './BotAbstract.js';

export class BotDiscord extends BotAbstract
{
    private botToken: string;
    private channelId: string;

    constructor(botToken: string, channelId: string) {
        super();
        this.botToken = botToken;
        this.channelId = channelId;
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
