const quiz=require("./src/cmd/quiz");

require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client({
	intents: ['GUILD_VOICE_STATES',
			'GUILD_MESSAGES',
			'GUILDS',
			'GUILD_MESSAGE_REACTIONS',
			'DIRECT_MESSAGES',
			'DIRECT_MESSAGE_REACTIONS',
			'DIRECT_MESSAGE_TYPING'],
	partials: ['CHANNEL',]});
exports.bot=bot;//봇

const commands = new Discord.Collection(); //명령어 모음집
bot.on('ready', async (a) => {//정상적으로 작동하는지 출력하는 코드
    console.log(`${bot.user.tag}님이 로그인했습니다.`);
    bot.user.setActivity(process.env.activityString, { type: 'PLAYING' });

	commands.set(quiz.name, quiz.execute);
});

bot.on('messageCreate', async (msg) => {
    if(msg.author.bot) return;//봇은 거름
	if(msg.channel.type==="DM") return msg.channel.send("DM은 막혀있어요, 죄송합니다. ㅠㅠ");
	
	if(!msg.content.startsWith(process.env.PREFIX)) return; //PREFIX 확인
	
	const args = msg.content.slice(process.env.PREFIX.length).trim().split(/\s+/);//명령어 말 배열에 담기
	const command = args.shift();//명령어 인식할 거
	
	try{
		const exe=commands.get(command); // execute 저장
		if(exe===undefined) return; // 없으면 스킵
		exe(msg); // 있으면 ㄱㄱ
	} catch (err) {
		console.error(err);
	}
	
});

bot.login(process.env.BOT_TOKEN);