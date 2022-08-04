import { cmdLoad } from './src/func/CmdtoName';
import { config } from 'dotenv';
import { Client, ClientUser, Collection, Message } from 'discord.js';
import { CMD } from './src/types/type';

config(); // dotenv config

export const bot = new Client({
  intents: [
    'GUILD_VOICE_STATES',
    'GUILD_MESSAGES',
    'GUILDS',
    'GUILD_MESSAGE_REACTIONS',
    'DIRECT_MESSAGES',
    'DIRECT_MESSAGE_REACTIONS',
    'DIRECT_MESSAGE_TYPING'
  ],
  partials: ['CHANNEL']
});

const CmdtoNameMap: Collection<string, string> = new Collection(); // cmd와 name 매칭해주는 맵
const commands: Collection<string, CMD> = new Collection(); // 명령어 모음집

export const dirUserDB = `./src/DB/userDB.json`;
export const dirQuizDB = `./src/DB/quizDB.json`;
export const dirEventDB = `./src/DB/eventDB.json`;

bot.on('ready', () => {
  // 정상적으로 작동하는지 출력하는 코드
  const user = bot.user as ClientUser;
  console.log(`${user.tag}님이 로그인했습니다.`);
  user.setActivity(process.env.activityString as string, { type: 'PLAYING' });

  cmdLoad(CmdtoNameMap, commands); // 명령어 가져오는 함수
});

bot.on('messageCreate', (msg: Message) => {
  if (msg.author.bot) return; //봇은 거름
  if (msg.channel.type === 'DM') {
    msg.channel.send('DM은 막혀있어요, 죄송합니다. ㅠㅠ');
    return;
  }

  const PREFIX = process.env.PREFIX as string;
  if (!msg.content.startsWith(PREFIX)) return; //PREFIX 확인

  const args = msg.content.slice(PREFIX.length).trim().split(/\s+/); //명령어 말 배열에 담기
  const command = args.shift(); //명령어 인식할 거

  try {
    const cmdName = CmdtoNameMap.get(command as string); // cmd 데리베이션으로부터 이름 찾기
    const cmd = commands.get(cmdName as string) as CMD;
    if (cmd == undefined) throw 'nocmd';
    const exe = cmd.execute; // execute 저장
    if (exe === undefined) return; // 없으면 스킵

    exe(msg, args); // 있으면 ㄱㄱ
  } catch (err) {
    if (err == 'nocmd') {
      msg.channel.send('명령어를 인식하지 못 했어요!');
    } else {
      console.error(`어이 ${err}`);
    }
  }
});

bot.login(process.env.BOT_TOKEN);
