import { MessageActionRow, MessageButton } from 'discord.js';
import { CMD, EMBED, EVENT, PARTICIPANT, QUIZ } from '../types/type';
import { dirEventDB, dirQuizDB, dirUserDB } from '../../bot';
import readJSON from '../func/readJSON';
import writeJSON from '../func/writeJSON';

export const grade: CMD = {
  name: `정답`,
  cmds: [`정답`, 'ㅈㄷ'],
  permission: ['SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES'],
  async execute(msg) {
    //나만 할 수 있는 거지롱~
    if (msg.author.id != process.env.OWNER_ID) return;

    //문제지 정보는 eventDB에 저장되어 있음
    const event = readJSON(dirEventDB) as EVENT;
    let { OList, XList } = event;

    // 문제가 없으면 채점이 안 됨
    const paper = msg.channel.messages.cache.find((e) => {
      return e.id === event.msgID;
    });
    if (!paper) return await msg.reply('문제가 없어서 채점이 불가능합니다.');
    else paper.delete(); // 문제가 있으면 삭제함

    writeJSON(dirEventDB, {
      quizIndex: Number(event.quizIndex) + 1,
      msgID: '',
      XList: [],
      OList: [],
      count: 0
    });

    //퀴즈 정보 가져와야 함
    const quizDB = readJSON(dirQuizDB) as Array<QUIZ>;
    const quiz = quizDB[event.quizIndex];

    const userDB = readJSON(dirUserDB) as Array<PARTICIPANT>;
    OList.forEach((e) => {
      const entityID = userDB.findIndex((dbe) => {
        return dbe.id == e.id;
      });
      if (entityID > -1) userDB[entityID].ox.push(quiz.정답 === 'O' ? 'O' : 'X');
      writeJSON(dirUserDB, userDB);
    });

    XList.forEach((e) => {
      const entityID = userDB.findIndex((dbe) => {
        return dbe.id == e.id;
      });
      if (entityID > -1) userDB[entityID].ox.push(quiz.정답 === 'X' ? 'O' : 'X');
      writeJSON(dirUserDB, userDB);
    });

    const quizEmbed: EMBED = {
      color: 0xf7cac9,
      author: {
        name: `정답은 ${quiz.정답}`,
        icon_url: 'attachment://icon.png'
      },
      description: quiz.해설,
      image: quiz.해설사진.length ? { url: `attachment://${quiz.해설사진}` } : { url: '' }
    };

    const nextButton = new MessageActionRow().addComponents(new MessageButton().setCustomId('next').setLabel('순위표').setStyle('SUCCESS'));

    const quizFiles = ['./src/assets/images/icon.png'];
    if (quiz.해설사진) quizFiles.push(`./src/assets/images/answer/${quiz.해설사진}`);
    const asdf = await msg.channel.send({
      embeds: [quizEmbed],
      components: [nextButton],
      files: quizFiles
    });

    const filter = () => {
      return msg.author.id === process.env.OWNER_ID;
    };
    const collector = asdf.createMessageComponentCollector({ filter });
    collector.on('collect', async (i) => {
      if (!i.member) return;
      if (i.member.user.id != process.env.OWNER_ID) return;
      if (i.customId == 'next') {
        const makeScoreStr = () => {
          const numO = (e: PARTICIPANT) => {
            return e.ox.filter((e) => {
              return e == 'O';
            }).length;
          };

          const rankList = userDB
            .sort((a, b) => {
              return numO(b) - numO(a);
            })
            .map((e, i) => {
              return `${i + 1}. ${e.name}: ${numO(e)}`;
            });
          return rankList.join('\n');
        };

        const scoreEmbed: EMBED = {
          color: 0xf7cac9,
          author: {
            name: `푼 문제 수: ${event.quizIndex + 1}  남은 문제 수: ${quizDB.length - event.quizIndex - 1}`,
            icon_url: 'attachment://icon.png'
          },
          description: makeScoreStr(),
          image: { url: 'attachment://imsi.png' }
        };

        const finishButton = new MessageActionRow().addComponents(new MessageButton().setCustomId('finish').setLabel('버튼을 누르면 점수판이 사라져요!').setStyle('SUCCESS'));

        await i.update({
          embeds: [scoreEmbed],
          components: [finishButton],
          files: ['./src/assets/images/icon.png', './src/assets/images/imsi.png']
        });
      } else if (i.customId == 'finish') {
        asdf.delete();
      }
    });
  }
};
