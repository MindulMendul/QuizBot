import { MessageActionRow, MessageButton } from "discord.js";
import { dirUserDB } from "../../bot";
import { CMD, EMBED, PARTICIPANT } from "../types/type";
import fs from 'fs';

export const help: CMD = {
	name: `수고하셨습니다`,
	cmd: [`수고하셨습니다`],
	permission: ['ADD_REACTIONS', 'EMBED_LINKS'],
	async execute(msg) {
		//나만 할 수 있는 거지롱~
		if (msg.author.id != process.env.OWNER_ID) return;

		const finishedEmbed: EMBED = {
			color: 0xf7cac9,
			author: {
				name: `모두들 수고많으셨습니다!`,
				icon_url: 'attachment://icon.png'
			},
			description: "ASDA",
			image: { url: 'attachment://imsi.png' }
		};

		msg.channel.send({
			embeds: [finishedEmbed],
			files: ['./src/asset/icon.png', './src/asset/imsi.png']
		});
	}
}