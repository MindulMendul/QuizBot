import { CMD, EVENT, PARTICIPANT } from '../types/type';
import { dirEventDB, dirUserDB } from '../../bot';
import writeJSON from '../func/writeJSON';
import readJSON from '../func/readJSON';
import makeQuizStr from '../func/makeQuizStr';

export const deleteMember: CMD = {
  name: `불참`,
  cmds: [`불참`, 'ㅂㅊ'],
  permission: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
  async execute(msg) {
    //read UserDB
    const userDB = readJSON(dirUserDB) as Array<PARTICIPANT>;
    const user = userDB.find((e, i) => {
      if (e.id === msg.author.id) userDB.splice(i, 1); // 바로 지워버리면 됨!
      return (e.id === msg.author.id);
    }); // entity가 DB 안에 있는지 검사

    //write UserDB
    if (user) { //통과되었을 때
      writeJSON(dirUserDB, userDB);

      const event = readJSON(dirEventDB) as EVENT;
      let { quizIndex, OList, XList, msgID, count } = event;

      //OX list
      const OIndex = OList.findIndex((e) => { return e.id == user.id });
      const XIndex = XList.findIndex((e) => { return e.id == user.id });

      if (OIndex > -1) {
        OList.splice(OIndex, 1);
      } else if (XIndex > -1) {
        XList.splice(XIndex, 1);
      }

      const quizMsg = msg.channel.messages.cache.find((e) => { return e.id == msgID; })
      await quizMsg?.edit(makeQuizStr(OList, XList, count-1));

      writeJSON(dirEventDB, {
        quizIndex: quizIndex,
        OList: OList,
        XList: XList,
        msgID: msgID,
        count: count-1
      });

      await msg.reply(`삭제 완료되었습니다!`);
    } else await msg.reply(`데이터베이스에 이미 당신의 이름이 없어요!`);
  }
};
