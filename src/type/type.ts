import { Message } from "discord.js";

export interface execute {
    execute : (arg: Message) => Promise<void>
};

export interface command {
    name: string
    cmd: Array<string>
    permission: Array<string>
    execute: execute["execute"];
}