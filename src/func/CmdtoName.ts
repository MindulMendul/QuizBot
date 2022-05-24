import { Collection, Message } from "discord.js";
import { cmd } from "../type/type";

import { quiz } from "../cmd/quiz";
import { participate } from "../cmd/participate";
import { grade } from "../cmd/grade";

const CmdtoName = async (map: Collection<string, string>,
                                commands: Collection<string, cmd>,
                                component: cmd) => {
    const cmdList = component.cmd;
    const name = component.name;
    cmdList.forEach((e: string) => map.set(e, name));
    commands.set(name, component);
}

export const cmdLoad = (map: Collection<string, string>, commands: any) => {
    CmdtoName(map, commands, quiz);
    CmdtoName(map, commands, participate);
    CmdtoName(map, commands, grade);
}