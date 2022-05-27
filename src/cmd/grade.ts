import { Message } from 'discord.js';
import { cmd } from '../types/type';

export const grade: cmd = {
	name: `정답`,
	cmd: [`정답`, 'ㅈㄷ'],
	permission: ['ADD_REACTIONS', 'EMBED_LINKS'],
	//타로하트 생성과정
	async execute(msg: Message, args: Array<string>) {
		//
	}
};
