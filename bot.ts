import { quiz } from "./src/cmd/quiz";
import { CmdtoName } from "./src/CmdtoName";
import { config } from 'dotenv';
import Discord, { Collection, Message } from 'discord.js';
import { command } from "./src/type/type";

config(); // dotenv config

export const bot = new Discord.Client({
	intents: ['GUILD_VOICE_STATES',
			'GUILD_MESSAGES',
			'GUILDS',
			'GUILD_MESSAGE_REACTIONS',
			'DIRECT_MESSAGES',
			'DIRECT_MESSAGE_REACTIONS',
			'DIRECT_MESSAGE_TYPING'],
	partials: ['CHANNEL',]
});

const CmdtoNameMap:Collection<string, string> = new Discord.Collection(); // cmd와 name 매칭해주는 맵
const commands:Collection<string, command["execute"]> = new Discord.Collection(); // 명령어 모음집

bot.on('ready', async () => {// 정상적으로 작동하는지 출력하는 코드
	const user = bot.user as Discord.ClientUser;
    console.log(`${user.tag}님이 로그인했습니다.`);
    user.setActivity(process.env.activityString as string, { type: 'PLAYING' });

	await CmdtoName(CmdtoNameMap, quiz);
	commands.set(quiz.name, quiz.execute);
});

bot.on("messageCreate", (msg: Message) => {
    if(msg.author.bot) return;//봇은 거름
	if(msg.channel.type==="DM") {msg.channel.send("DM은 막혀있어요, 죄송합니다. ㅠㅠ"); return;}
	
	const PREFIX = process.env.PREFIX as string;
	if(!msg.content.startsWith(PREFIX)) return; //PREFIX 확인
	
	const args = msg.content.slice(PREFIX.length).trim().split(/\s+/);//명령어 말 배열에 담기
	const command = args.shift();//명령어 인식할 거
	
	try{
		const cmdName=CmdtoNameMap.get(command as string); // cmd 데리베이션으로부터 이름 찾기
		const exe=commands.get(cmdName as string); // execute 저장
		if(exe===undefined) return; // 없으면 스킵
		exe(msg); // 있으면 ㄱㄱ
	} catch (err) {
		console.error(`어이 ${err}`);
	}
});

bot.login(process.env.BOT_TOKEN);