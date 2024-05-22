import { EnabledStatus } from "./config.js";

/**
 * A social media client who can post a message (Discord, Telegram, Twitter).
 */
export abstract class BotAbstract
{
    protected abstract enabledStatus: EnabledStatus;
    protected abstract getSendMessageUrl(): string;
    protected abstract getHeaders(): HeadersInit;
    protected abstract getBody(message: string): BodyInit;

    public getEnabledStatus(): EnabledStatus {
        return this.enabledStatus;
    }

    public async sendMessage(message: string): Promise<boolean> {
        try {
            const response = await fetch(this.getSendMessageUrl(), {
                method: "POST",
                headers: this.getHeaders(),
                body: this.getBody(message),
            });

            if (!response.ok) {
                console.error(`ERROR | ${this.constructor.name} response not ok | status:`, response.status, "| response:", await response.json());
                return false;
            } else {
                return true;
            }
        } catch (error) {
            console.error(`ERROR | ${this.constructor.name} request failed |`, error);
            return false;
        }
    }
}
