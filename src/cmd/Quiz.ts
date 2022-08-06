import { MessageActionRow, MessageButton } from 'discord.js';
import { CMD, EMBED, PARTICIPANT, QUIZ, EVENT } from '../types/type';

import { dirEventDB, dirQuizDB, dirUserDB } from '../../bot';
import readJSON from '../func/readJSON';
import makeQuizStr from '../func/makeQuizStr';
import writeJSON from '../func/writeJSON';

export const quiz: CMD = {
  name: `퀴즈`,
  cmds: [`퀴즈`, 'ㅋㅈ'],
  permission: ['SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES'],
  async execute(msg) {
    //나만 할 수 있는 거지롱~
    if (msg.author.id != process.env.OWNER_ID) return;

    //문제지 정보는 eventDB에 저장되어 있음
    const eventDB = readJSON(dirEventDB) as EVENT;
    const quizDB = readJSON(dirQuizDB) as Array<QUIZ>;

    if (eventDB.msgID.length) { await msg.reply("이미 문제가 출제된 상태에요!"); return; }

    const quiz = quizDB[eventDB.quizIndex];

    const quizEmbed: EMBED = {
      color: 0xf7cac9,
      author: {
        name: `퀴즈봇의 퀴즈 문제 ${eventDB.quizIndex + 1}`,
        icon_url: 'attachment://icon.png'
      },
      description: `난이도: ${quiz.난이도}\n${quiz.문제지}`,
      image: quiz.문제사진 ? { url: `attachment://${quiz.문제사진}` } : { url: '' }
    };

    const oxButton = new MessageActionRow().addComponents(
      new MessageButton().setCustomId('O').setLabel('O').setStyle('SUCCESS'),
      new MessageButton().setCustomId('X').setLabel('X').setStyle('DANGER')
    );

    const quizFiles = ['./src/assets/images/icon.png'];
    if (quiz.문제사진) quizFiles.push(`./src/assets/images/quiz/${quiz.문제사진}`);

    const asdf = await msg.channel.send({
      content: makeQuizStr([], [], 0),
      embeds: [quizEmbed],
      components: [oxButton],
      files: quizFiles
    });

    writeJSON(dirEventDB, {
      quizIndex: Number(eventDB.quizIndex),
      msgID: asdf.id,
      XList: [],
      OList: [],
      count: 0
    });

    // user DB 안에 정보가 있는지 검사
    const filter = () => {
      const userDB = readJSON(dirUserDB) as Array<PARTICIPANT>;
      return userDB.some((e: PARTICIPANT) => {
        return e.id === msg.author.id;
      });
    };
    const collector = asdf.createMessageComponentCollector({ filter });

    collector.on('collect', async (i) => {
      const memberID = i.member?.user.id;
      if (!memberID) { await msg.reply("무슨 버그?"); console.log(i); }

      //read UserDB
      const userDB = readJSON(dirUserDB) as Array<PARTICIPANT>;
      const user = userDB.find((e) => { return e.id === memberID; }); // entity가 userDB 안에 있는지 검사


      if (user) {
        const event = readJSON(dirEventDB) as EVENT;
        let { quizIndex, msgID, OList, XList, count } = event;
        //Count
        const OIndex = OList.findIndex((e) => { return e.id == user.id });
        const XIndex = XList.findIndex((e) => { return e.id == user.id });

        //OX list
        if (OIndex > -1) {
          // OCount에 정보가 있던 경우
          if (i.customId == 'X') {// OCount -> XCount
            OList.splice(OIndex, 1); // OCount에 있는 건 지우고
            XList.push(user); // XCount에는 채우고
          }
        } else if (XIndex > -1) {
          // XCount에 정보가 있던 경우
          if (i.customId == 'O') {// XCount -> OCount
            XList.splice(XIndex, 1); // XCount에 있는 건 지우고
            OList.push(user); // OCount에는 채우고
          }
        } else {
          // 둘 다 정보가 없던 경우
          if (i.customId == 'O') OList.push(user); // OCount에 채우기
          else if (i.customId == 'X') XList.push(user); // XCount에 채우기
          count++;
        }

        writeJSON(dirEventDB, {
          quizIndex: quizIndex,
          msgID: msgID,
          OList: OList,
          XList: XList,
          count: count
        })
        i.update({ content: makeQuizStr(OList, XList, count) });
      }
    });
  }
};

