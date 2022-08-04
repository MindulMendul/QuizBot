import { Message, MessageActionRow, MessageButton, TextChannel } from 'discord.js';
import { CMD, EMBED, EVENT, PARTICIPANT, QUIZ } from '../types/type';
import fs from 'fs';
import { dirEventDB, dirQuizDB, dirUserDB } from '../../bot';

export const grade: CMD = {
  name: `정답`,
  cmd: [`정답`, 'ㅈㄷ'],
  permission: ['ADD_REACTIONS', 'EMBED_LINKS'],
  async execute(msg) {
    //나만 할 수 있는 거지롱~
    if (msg.author.id != process.env.OWNER_ID) return;

    //문제지 정보는 eventDB에 저장되어 있음
    const rawEvent = fs.readFileSync(dirEventDB, 'utf-8');
    const event = JSON.parse(rawEvent) as EVENT;
    const currentQuizIndex = event.quizIndex;

    const ch = msg.channel as TextChannel;
    const paper = ch.messages.cache.find((e) => {
      return e.id === event.msgID;
    }) as Message<boolean>;

    if (!paper) {
      msg.channel.send('문제가 없어서 채점이 불가능합니다.');
      return;
    } // 문제가 없으면 채점이 안 됨

    paper.delete(); // 문제가 있으면 삭제함
    const resetEventEntity = JSON.stringify({
      quizIndex: Number(currentQuizIndex) + 1,
      msgID: ''
    });
    fs.writeFileSync(dirEventDB, resetEventEntity);

    //퀴즈 정보 가져와야 함
    const rawQuizDB = fs.readFileSync(dirQuizDB, 'utf-8');
    const quizList = JSON.parse(rawQuizDB) as Array<QUIZ>;
    const quiz = quizList[event.quizIndex];

    const [OCountStr, XCountStr] = paper.content.split('\n');
    const OCount = OCountStr.slice(2)
      .split(' ')
      .filter((e) => {
        return e != '';
      });
    const XCount = XCountStr.slice(2)
      .split(' ')
      .filter((e) => {
        return e != '';
      });

    const rawUserDB = fs.readFileSync(dirUserDB, 'utf8');
    const UserDB = JSON.parse(rawUserDB) as Array<PARTICIPANT>;

    OCount.forEach((e) => {
      const entityID = UserDB.findIndex((dbe) => {
        return dbe.name == e;
      });
      if (entityID > -1) UserDB[entityID].ox.push(quiz.정답 === 'O' ? 'O' : 'X');
      fs.writeFileSync(dirUserDB, JSON.stringify(UserDB));
    });

    XCount.forEach((e) => {
      const entityID = UserDB.findIndex((dbe) => {
        return dbe.name == e;
      });
      if (entityID > -1) UserDB[entityID].ox.push(quiz.정답 === 'X' ? 'O' : 'X');
      fs.writeFileSync(dirUserDB, JSON.stringify(UserDB));
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

    const nextButton = new MessageActionRow().addComponents(
      new MessageButton().setCustomId('next').setLabel('순위표').setStyle('SUCCESS')
    );

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
      if (i.customId == 'next') {
        const makeScoreStr = () => {
          const numO = (e: PARTICIPANT) => {
            return e.ox.filter((e) => {
              return e === 'O';
            }).length;
          };
          const rankList = UserDB.sort((a, b) => {
            return numO(a) - numO(b);
          }).map((e, i) => {
            return `${i + 1}. ${e.name}: ${numO(e)}`;
          });
          return rankList.join('\n');
        };

        const scoreEmbed: EMBED = {
          color: 0xf7cac9,
          author: {
            name: `푼 문제 수: ${currentQuizIndex + 1}  남은 문제 수: ${quizList.length - currentQuizIndex - 1}`,
            icon_url: 'attachment://icon.png'
          },
          description: makeScoreStr(),
          image: { url: 'attachment://imsi.png' }
        };

        const finishButton = new MessageActionRow().addComponents(
          new MessageButton().setCustomId('finish').setLabel('버튼을 누르면 점수판이 사라져요!').setStyle('SUCCESS')
        );

        await i.update({
          embeds: [scoreEmbed],
          components: [finishButton],
          files: ['./src/assets/images/icon.png', './src/assets/images/imsi.png']
        });
      } else if (i.customId == 'finish') {
        msg.delete();
        asdf.delete();
      }
    });
  }
};
