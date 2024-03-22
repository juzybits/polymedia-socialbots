import { Bot } from './types.js';

export class BotDiscord implements Bot
{
    private botToken: string;
    private urlSendMessage: string;

    constructor(botToken: string, channelId: string) {
        this.botToken = botToken;
        this.urlSendMessage = `https://discord.com/api/v10/channels/${channelId}/messages`;
    }

    public async sendMessage(message: string): Promise<boolean> {
        try {
            const response = await fetch(this.urlSendMessage, {
                method: 'POST',
                headers: {
                    'Authorization': `Bot ${this.botToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: message,
                    flags: 1 << 2, // SUPPRESS_EMBEDS
                })
            });

            if (!response.ok) {
                console.error('ERROR | Discord response not ok | status:', response.status, '| response:', await response.json());
                return false;
            } else {
                return true;
            }
        } catch (error) {
            console.error('ERROR | Discord request failed |', error);
            return false;
        }
    }
}
