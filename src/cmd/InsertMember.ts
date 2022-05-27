import { cmd, participant } from '../types/type';
import fs from 'fs';
import { dirUserDB } from '../../bot';

export const insertMember: cmd = {
  name: `참가`,
  cmd: [`참가`, 'ㅊㄱ'],
  permission: ['ADD_REACTIONS', 'EMBED_LINKS'],
  async execute(msg, args) {
    //참가자 정보
    const entity: participant = {
      id: msg.author.id,
      name: args.join(' '),
      ox: []
    };

    //read UserDB
    const rawDB = fs.readFileSync(dirUserDB, 'utf8');
    const DB = JSON.parse(rawDB) as Array<participant>;
    const validation= !DB.some((e: participant) => {
      return e.id === msg.author.id;
    }); // entity가 DB 안에 있는지 검사

    //write UserDB
    if(validation) { //통과되었을 때
      DB.push(entity);
      fs.writeFileSync(dirUserDB, JSON.stringify(DB));
      msg.reply(`참가자 등록이 완료되었습니다!`);
    }
    else msg.reply(`이미 등록된 사람은 안 됩니다~`);
    
  }
};
