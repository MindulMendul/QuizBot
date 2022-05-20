import { Collection } from "discord.js";
import { command } from "./type/type";

export const CmdtoName = async (map: Collection<string, string>, component: command) => {
    const cmdList = component.cmd;
    const name = component.name;
    cmdList.forEach((e: string)=>map.set(e, name));
}