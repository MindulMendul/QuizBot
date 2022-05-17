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

bot.on('ready', async (a) => {//정상적으로 작동하는지 출력하는 코드
    console.log(`${bot.user.tag}님이 로그인했습니다.`);
    bot.user.setActivity(process.env.activityString, { type: 'PLAYING' });
});

bot.on('messageCreate', async (msg) => {
    if(msg.author.bot) return;//봇은 거름
	if(msg.channel.type==="DM") return msg.channel.send("DM은 막혀있어요, 죄송합니다. ㅠㅠ");
	
	const args = msg.content.slice(process.env.PREFIX.length).trim().split(/\s+/);//명령어 말 배열에 담기
	const command = args.shift();//명령어 인식할 거

	msg.channel.send(command);
});

bot.login(process.env.BOT_TOKEN);