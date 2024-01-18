export interface Bot {
    sendMessage(message: string): Promise<boolean>;
}
