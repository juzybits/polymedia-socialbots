import { DISCORD_BOT_TOKEN } from './.auth.js';
import { Bot } from './types.js';

const CHANNEL_ID = '';
const URL_SEND_MESSAGE = `https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`;

export class BotDiscord implements Bot {
    public async sendMessage(message: string): Promise<boolean> {
        try {
            const response = await fetch(URL_SEND_MESSAGE, {
                method: 'POST',
                headers: {
                    'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: message })
            });

            if (!response.ok) {
                console.error('ERROR | response not ok | status:', response.status, '| response:', await response.json());
                return false;
            } else {
                return true;
            }
        } catch (error) {
            console.error('ERROR | request failed |', error);
            return false;
        }
    }
}
