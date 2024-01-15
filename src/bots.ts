export interface Bot {
    sendMsg(msg: string): boolean;
}

export class DiscordBot implements Bot {
    public sendMsg(msg: string): boolean {
        console.log('Discord message:', msg);
        return true;
    }
}

export class TelegramBot implements Bot {
    public sendMsg(msg: string): boolean {
        console.log('Telegram message:', msg);
        return true;
    }
}

export class TwitterBot implements Bot {
    public sendMsg(msg: string): boolean {
        console.log('Twitter message:', msg);
        return true;
    }
}
