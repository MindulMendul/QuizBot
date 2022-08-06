import { CMD, PARTICIPANT } from '../types/type';
import { dirUserDB } from '../../bot';
import readJSON from '../func/readJSON';
import writeJSON from '../func/writeJSON';

export const insertMember: CMD = {
  name: `참가`,
  cmds: [`참가`, 'ㅊㄱ'],
  permission: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
  async execute(msg, args) {
    const name = args.join(' ');
    if (!name.length) {
      await msg.reply('공백으로 이루어진 이름은 쓸 수가 없어요!');
      return;
    }

    //read UserDB
    const userDB = readJSON(dirUserDB) as Array<PARTICIPANT>;
    const validation = !userDB.some((e) => {
      return e.id === msg.author.id;
    }); // entity가 DB 안에 있는지 검사

    //write UserDB
    if (validation) {
      //통과되었을 때
      //참가자 정보
      const entity: PARTICIPANT = {
        id: msg.author.id,
        profileName: msg.author.tag,
        name: name,
        ox: []
      };
      userDB.push(entity);
      writeJSON(dirUserDB, userDB);
      await msg.reply(`참가자 등록이 완료되었습니다!`);
    } else await msg.reply(`이미 등록된 사람은 안 됩니다~`);
  }
};
