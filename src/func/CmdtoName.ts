import { Collection } from 'discord.js';
import { CMD } from '../types/type';

import { makeQuiz } from '../cmd/MakeQuiz';
import { quiz } from '../cmd/Quiz';
import { grade } from '../cmd/Grade';
import { insertMember } from '../cmd/InsertMember';
import { updateMember } from '../cmd/UpdateMember';
import { deleteMember } from '../cmd/DeleteMember';
import { finish } from '../cmd/Finish';

const CmdtoName = async (map: Collection<string, string>, commands: Collection<string, CMD>, component: CMD) => {
  const {cmds, name} = component;
  cmds.forEach((e: string) => map.set(e, name));
  commands.set(name, component);
};

export const cmdLoad = (map: Collection<string, string>, commands: any) => {
  CmdtoName(map, commands, makeQuiz);
  CmdtoName(map, commands, quiz);
  CmdtoName(map, commands, insertMember);
  CmdtoName(map, commands, updateMember);
  CmdtoName(map, commands, deleteMember);
  CmdtoName(map, commands, grade);
  CmdtoName(map, commands, finish);
};
