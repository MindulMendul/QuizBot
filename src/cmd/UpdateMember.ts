import { CMD, EVENT, PARTICIPANT } from '../types/type';
import { dirEventDB, dirUserDB } from '../../bot';
import writeJSON from '../func/writeJSON';
import readJSON from '../func/readJSON';
import makeQuizStr from '../func/makeQuizStr';

export const updateMember: CMD = {
  name: `이름변경`,
  cmds: [`이름변경`, '변경', 'ㅂㄱ', 'ㅇㄹㅂㄱ', 'ㅇㄼㄱ'],
  permission: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
  async execute(msg, args) {
    //read UserDB
    const userDB = readJSON(dirUserDB) as Array<PARTICIPANT>;
    const user = userDB.find((e, i) => {
      if (e.id === msg.author.id) userDB.splice(i, 1); // 있으면 그냥 바로 지워버리면 됨!
      return (e.id === msg.author.id);
    }); // entity가 DB 안에 있는지 검사

    //write UserDB
    if (user) {
      const name = args.join(' ');
      if (!name.length) { await msg.reply('공백으로 이루어진 이름은 쓸 수가 없어요!'); return; }

      //통과되었을 때
      const newUser = {
        id: user.id,
        profileName: user.profileName,
        name: name,
        ox: user.ox
      };
      userDB.push(newUser);
      writeJSON(dirUserDB, userDB);

      const event = readJSON(dirEventDB) as EVENT;
      let { OList, XList, msgID, count } = event;

      //Count
      const OIndex = OList.findIndex((e) => { return e.id == newUser.id });
      const XIndex = XList.findIndex((e) => { return e.id == newUser.id });

      //OX list
      if (OIndex > -1) {
        // OCount에 정보가 있던 경우
        OList.splice(OIndex, 1); // OCount에 있는 건 지우고
        OList.push(newUser); // XCount에는 채우고
      } else if (XIndex > -1) {
        // XCount에 정보가 있던 경우
        XList.splice(XIndex, 1); // XCount에 있는 건 지우고
        XList.push(newUser); // OCount에는 채우고
      }

      const quizMsg = msg.channel.messages.cache.find((e) => { return e.id == msgID; })
      await quizMsg?.edit(makeQuizStr(OList, XList, count));
      await msg.reply(`이름 변경이 완료되었습니다!`);
    } else await msg.reply(`참가 명령어를 통해 참가자 등록을 먼저 해주세요!`);
  }
};
