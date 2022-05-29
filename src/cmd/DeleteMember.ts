import { CMD, PARTICIPANT } from '../types/type';
import { dirUserDB } from '../../bot';
import fs from 'fs';

export const deleteMember: CMD = {
  name: `불참`,
  cmd: [`불참`, 'ㅂㅊ'],
  permission: ['ADD_REACTIONS', 'EMBED_LINKS'],
  async execute(msg, args) {
    //read UserDB
    const rawDB = fs.readFileSync(dirUserDB, 'utf8');
    const DB = JSON.parse(rawDB) as Array<PARTICIPANT>;
    const validation = DB.find((e: PARTICIPANT, i: number) => {
      if (e.id === msg.author.id) {
        DB.splice(i, 1); // 있으면 그냥 바로 지워버리면 됨!
        return true;
      } else return false;
    }); // entity가 DB 안에 있는지 검사

    //write UserDB
    if (validation) {
      //통과되었을 때
      fs.writeFileSync(dirUserDB, JSON.stringify(DB));
      msg.reply(`삭제 완료되었습니다!`);
    } else msg.reply(`데이터베이스에 이미 당신의 이름이 없어요!`);
  }
};
