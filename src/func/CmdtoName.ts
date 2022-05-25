import { Collection } from "discord.js";
import { cmd } from "../types/type";

import { quiz } from "../cmd/Quiz";
import { grade } from "../cmd/Grade";
import { insertMember } from "../cmd/InsertMember";
import { updateMember } from "../cmd/UpdateMember";
import { deleteMember } from "../cmd/DeleteMember";

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
    CmdtoName(map, commands, insertMember);
    CmdtoName(map, commands, updateMember);
    CmdtoName(map, commands, deleteMember);
    CmdtoName(map, commands, grade);
}