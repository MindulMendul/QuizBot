import { cmdLoad } from './src/func/CmdtoName';
import { config } from 'dotenv';
import { Client, ClientUser, Collection, GuildMember, Message, PermissionResolvable, User } from 'discord.js';
import { CMD } from './src/types/type';
import checkPermissions from './src/func/checkPermissions';

config(); // dotenv config

export const bot = new Client({
  intents: [
    'GUILD_MESSAGES',
    'GUILDS',
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

bot.on('messageCreate', async (msg: Message) => {
  if (msg.author.bot) return; //봇은 거름
  if (msg.channel.type === 'DM') {
    msg.channel.send('DM은 막혀있어요, 죄송합니다. ㅠㅠ');
    return;
  }

  const PREFIX = process.env.PREFIX as string;

  //PREFIX이 없으면 그냥 삭제
  if (!msg.content.startsWith(PREFIX)) {
    msg.delete();
    return;
  }

  const args = msg.content.slice(PREFIX.length).trim().split(/\s+/); //명령어 말 배열에 담기
  const command = args.shift() as string; //명령어 인식할 거

  try {
    const cmdName = CmdtoNameMap.get(command) as string; // cmd 데리베이션으로부터 이름 찾기
    const cmd = commands.get(cmdName) as CMD;
    if (cmd == undefined) await msg.reply('명령어를 인식하지 못 했어요!');
    else {
      if (await checkPermissions(msg, cmd.permission as PermissionResolvable[]))
        await cmd.execute(msg, args);
    }

    if (msg.channel.permissionsFor(bot.user as User)?.has("MANAGE_MESSAGES"))
      msg.delete();
  } catch (err) {
    msg.reply(`에러: ${err}`);
    console.error(`에러~ ${err}`);
  }
});

bot.login(process.env.BOT_TOKEN);
