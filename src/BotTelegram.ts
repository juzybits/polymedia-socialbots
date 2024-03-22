import { BotAbstract } from './BotAbstract.js';

export class BotTelegram extends BotAbstract
{
    private botToken: string;
    private chatId: string;
    private threadId: string;

    constructor(botToken: string, chatId: string, threadId: string) {
        super();
        this.botToken = botToken;
        this.chatId = chatId;
        this.threadId = threadId;
    }

    protected getSendMessageUrl(): string {
        return `https://api.telegram.org/bot${this.botToken}/sendMessage`;
    }

    protected getHeaders(): HeadersInit {
        return {
            'Content-Type': 'application/json',
        };
    }

    protected getBody(message: string): BodyInit {
        return JSON.stringify({
            chat_id: this.chatId,
            text: message,
            message_thread_id: this.threadId,
            link_preview_options: {
                is_disabled: true,
            }
        });
    }
}
