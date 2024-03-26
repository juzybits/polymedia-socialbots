import { BotAbstract } from './BotAbstract.js';
import { EnabledStatus, TelegramConfig } from './config.js';

export class BotTelegram extends BotAbstract
{
    protected enabledStatus: EnabledStatus;
    private botToken: string;
    private groupId: string;
    private threadId: string|null;

    constructor(botToken: string, config: TelegramConfig) {
        super();
        this.botToken = botToken;
        this.groupId = config.GROUP_ID;
        this.threadId = config.THREAD_ID;
        this.enabledStatus = config.ENABLED;
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
            chat_id: this.groupId,
            text: message,
            message_thread_id: this.threadId,
            parse_mode: 'Markdown',
            link_preview_options: {
                is_disabled: true,
            }
        });
    }
}
