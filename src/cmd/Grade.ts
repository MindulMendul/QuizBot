import { Message, TextChannel } from 'discord.js';
import { CMD, EVENT, PARTICIPANT, QUIZ } from '../types/type';
import fs from 'fs';
import { dirEventDB, dirQuizDB, dirUserDB } from '../../bot';

export const grade: CMD = {
  name: `정답`,
  cmd: [`정답`, 'ㅈㄷ'],
  permission: ['ADD_REACTIONS', 'EMBED_LINKS'],
  async execute(msg) {
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
    const rawQuiz = fs.readFileSync(dirQuizDB, 'utf-8');
    const quizList = JSON.parse(rawQuiz) as Array<QUIZ>;
    const quiz = quizList[event.quizIndex];

    const [O, OCountStr, X, XCountStr, countStr] = paper.content.split('\n');
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

    const rawDB = fs.readFileSync(dirUserDB, 'utf8');
    const DB = JSON.parse(rawDB) as Array<PARTICIPANT>;

    OCount.forEach((e) => {
      const entityID = DB.findIndex((dbe) => {
        return dbe.name == e;
      });
      if (entityID > -1) DB[entityID].ox.push(quiz.정답 === 'O' ? 'O' : 'X');
      console.log(DB);
      fs.writeFileSync(dirUserDB, JSON.stringify(DB));
    });
    XCount.forEach((e) => {
      const entityID = DB.findIndex((dbe) => {
        return dbe.name == e;
      });
      if (entityID > -1) DB[entityID].ox.push(quiz.정답 === 'X' ? 'O' : 'X');
      console.log(DB);
      fs.writeFileSync(dirUserDB, JSON.stringify(DB));
    });
  }
};
