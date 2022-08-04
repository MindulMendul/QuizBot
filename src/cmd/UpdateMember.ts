import { CMD, PARTICIPANT } from '../types/type';
import { dirUserDB } from '../../bot';
import fs from 'fs';

export const updateMember: CMD = {
  name: `이름변경`,
  cmd: [`이름변경`, '변경', 'ㅂㄱ', 'ㅇㄹㅂㄱ', 'ㅇㄼㄱ'],
  permission: ['ADD_REACTIONS', 'EMBED_LINKS'],
  async execute(msg, args) {
    const name = args.join(' ').replace(/\s+/gi, '');
    if (name.length < 1) {
      msg.channel.send('공백으로 이루어진 이름은 쓸 수가 없어요!');
      return;
    }

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
      const newEntity = {
        id: validation.id,
        profileName: validation.profileName,
        name: name,
        ox: validation.ox
      };
      DB.push(newEntity);
      fs.writeFileSync(dirUserDB, JSON.stringify(DB));
      msg.reply(`이름 변경이 완료되었습니다!`);
    } else msg.reply(`참가 명령어를 통해 참가자 등록을 먼저 해주세요!`);
  }
};
