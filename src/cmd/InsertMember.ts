import { CMD, PARTICIPANT } from '../types/type';
import fs from 'fs';
import { dirUserDB } from '../../bot';

export const insertMember: CMD = {
  name: `참가`,
  cmd: [`참가`, 'ㅊㄱ'],
  permission: ['ADD_REACTIONS', 'EMBED_LINKS'],
  async execute(msg, args) {
    const name = args.join(' ').replace(/\s+/gi, '');
    if (name.length < 1) {
      msg.channel.send('공백으로 이루어진 이름은 쓸 수가 없어요!');
      return;
    }

    //참가자 정보
    const entity: PARTICIPANT = {
      id: msg.author.id,
      profileName: msg.author.tag,
      name: name,
      ox: []
    };

    //read UserDB
    const rawDB = fs.readFileSync(dirUserDB, 'utf8');
    const DB = JSON.parse(rawDB) as Array<PARTICIPANT>;
    const validation = !DB.some((e: PARTICIPANT) => {
      return e.id === msg.author.id;
    }); // entity가 DB 안에 있는지 검사

    //write UserDB
    if (validation) {
      //통과되었을 때
      DB.push(entity);
      fs.writeFileSync(dirUserDB, JSON.stringify(DB));
      msg.reply(`참가자 등록이 완료되었습니다!`);
    } else msg.reply(`이미 등록된 사람은 안 됩니다~`);
  }
};
