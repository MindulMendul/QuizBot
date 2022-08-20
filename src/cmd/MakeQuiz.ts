import { Message } from 'discord.js';
import { CMD, QUIZ } from '../types/type';
import { utils, readFile } from 'ts-xlsx';
import { dirQuizDB } from '../../bot';
import writeJSON from '../func/writeJSON';

export const makeQuiz: CMD = {
  name: `퀴즈생성`,
  cmds: [`퀴즈생성`, 'ㅋㅈㅅㅅ'],
  permission: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
  async execute(msg: Message) {
    if (msg.author.id != process.env.OWNER_ID) return msg.reply(`봇 소유자만 가능한 명령어에요!`);
    else {
      const QuizSheetName="QuizSheet2";
      
      const workbook = readFile(`./src/assets/${QuizSheetName}.xlsx`);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      writeJSON(
        dirQuizDB,
        (utils.sheet_to_json(sheet) as QUIZ[]).map((e) => {
          return {
            문제번호: e.문제번호 ? e.문제번호 : '',
            난이도: e.난이도 ? e.난이도 : '',
            문제지: e.문제지 ? e.문제지 : '',
            문제사진: e.문제사진 ? e.문제사진 : '',
            정답: e.정답 ? e.정답 : '',
            해설: e.해설 ? e.해설 : '',
            해설사진: e.해설사진 ? e.해설사진 : ''
          } as QUIZ;
        })
      );
      return await msg.reply(`퀴즈생성이 완료되었습니다.`);
    }
  }
};
