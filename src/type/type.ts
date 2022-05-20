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

export interface embed {
    color: number,
    author: {
        name: string,
        icon_url: string,
    },
    description: string,
    image: {url: string}
}