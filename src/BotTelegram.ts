import { Bot } from './types.js';

export class BotTelegram implements Bot
{
    private chatId: string;
    private threadId: string;
    private urlSendMessage: string;

    constructor(botToken: string, chatId: string, threadId: string) {
        this.chatId = chatId;
        this.threadId = threadId;
        this.urlSendMessage = `https://api.telegram.org/bot${botToken}/sendMessage`;
    }

    public async sendMessage(message: string): Promise<boolean> {
        try {
            const response = await fetch(this.urlSendMessage, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: this.chatId,
                    text: message,
                    message_thread_id: this.threadId,
                    link_preview_options: {
                        is_disabled: true,
                    }
                })
            });

            if (!response.ok) {
                console.error('ERROR | Telegram response not ok | status:', response.status, '| response:', await response.json());
                return false;
            } else {
                return true;
            }
        } catch (error) {
            console.error('ERROR | Telegram request failed |', error);
            return false;
        }
    }
}
