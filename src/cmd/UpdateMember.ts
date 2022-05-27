import { cmd, participant } from '../types/type';
import { dirUserDB } from '../../bot';
import fs from 'fs';


export const updateMember: cmd = {
  name: `이름변경`,
  cmd: [`이름변경`, '변경', 'ㅂㄱ', 'ㅇㄹㅂㄱ', 'ㅇㄼㄱ'],
  permission: ['ADD_REACTIONS', 'EMBED_LINKS'],
  async execute(msg, args) {
    //read UserDB
    const rawDB = fs.readFileSync(dirUserDB, 'utf8');
    const DB = JSON.parse(rawDB) as Array<participant>;
    const validation = DB.find((e: participant, i: number) => {
      if (e.id === msg.author.id) {
        DB.splice(i, 1); // 있으면 그냥 바로 지워버리면 됨!
        return true;
      } else return false;
    }); // entity가 DB 안에 있는지 검사

    //write UserDB
    if (validation) { //통과되었을 때
      const newEntity={
        id: validation.id,
        name: args.join(" "),
        ox: validation.ox 
      }
      DB.push(newEntity);
      fs.writeFileSync(dirUserDB, JSON.stringify(DB));
      msg.reply(`이름 변경이 완료되었습니다!`);
    }
    else msg.reply(`참가 명령어를 통해 참가자 등록을 먼저 해주세요!`);
  }
};
