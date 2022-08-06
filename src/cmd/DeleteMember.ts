import { CMD, PARTICIPANT } from '../types/type';
import { dirUserDB } from '../../bot';
import writeJSON from '../func/writeJSON';
import readJSON from '../func/readJSON';

export const deleteMember: CMD = {
  name: `불참`,
  cmds: [`불참`, 'ㅂㅊ'],
  permission: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
  async execute(msg) {
    //read UserDB
    const userDB = readJSON(dirUserDB) as Array<PARTICIPANT>;
    const validation = userDB.find((e, i) => {
      if (e.id === msg.author.id) userDB.splice(i, 1); // 바로 지워버리면 됨!
      return (e.id === msg.author.id);
    }); // entity가 DB 안에 있는지 검사

    //write UserDB
    if (validation) { //통과되었을 때
      writeJSON(dirUserDB, userDB);
      await msg.reply(`삭제 완료되었습니다!`);
    } else await msg.reply(`데이터베이스에 이미 당신의 이름이 없어요!`);
  }
};
