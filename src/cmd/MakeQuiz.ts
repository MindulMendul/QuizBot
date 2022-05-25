import { Message } from 'discord.js';
import { cmd } from '../types/type';
import { utils, readFile } from 'ts-xlsx';
import fs from 'fs';
import { dirAsset } from '../../bot';

export const makeQuiz: cmd = {
	name: `퀴즈생성`,
	cmd: [`퀴즈생성`, 'ㅋㅈㅅㅅ'],
	permission: ["ADD_REACTIONS", "EMBED_LINKS"],
	//타로하트 생성과정
	async execute(msg: Message) {
		if (msg.author.id != process.env.OWNER_ID)
			return msg.reply(`봇 소유자만 가능한 명령어에요!`);
		else {
			const workbook = readFile(`${dirAsset}/QuizSheet.xlsx`);
			//workbook에서 xlsx 파일을 못 여는 중
			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];
			const data = utils.sheet_to_json(sheet);

			const json = JSON.stringify(data);
			fs.writeFile(`${dirAsset}/DB/quizDB.json`, json, () => { });
			return msg.reply(`퀴즈생성이 완료되었습니다.`);
		}
	}
};