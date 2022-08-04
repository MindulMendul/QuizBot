import { MessageActionRow, MessageButton } from 'discord.js';
import { dirUserDB } from '../../bot';
import { CMD, EMBED, PARTICIPANT } from '../types/type';
import { quiz } from './Quiz';
import fs from 'fs';

export const finish: CMD = {
  name: `수고하셨습니다`,
  cmd: [`수고하셨습니다`],
  permission: ['ADD_REACTIONS', 'EMBED_LINKS'],
  async execute(msg) {
    //나만 할 수 있는 거지롱~
    if (msg.author.id != process.env.OWNER_ID) return;

    const rawUserDB = fs.readFileSync(dirUserDB, 'utf8');
    const UserDB = JSON.parse(rawUserDB) as Array<PARTICIPANT>;

    const makeScoreStr = () => {
      const numO = (e: PARTICIPANT) => {
        return e.ox.filter((e) => {
          return e === 'O';
        }).length;
      };
      const rankList = UserDB.sort((a, b) => {
        return numO(a) - numO(b);
      }).map((e, i) => {
        return `${i + 1}. ${e.name}: ${numO(e)}`;
      });
      return rankList.join('\n');
    };

    const finishedEmbed: EMBED = {
      color: 0xf7cac9,
      author: {
        name: `모두들 수고많으셨습니다!`,
        icon_url: 'attachment://icon.png'
      },
      description: makeScoreStr(),
      image: { url: 'attachment://imsi.png' }
    };

    const Button = new MessageActionRow().addComponents(
      new MessageButton().setCustomId('finished').setLabel('수고많으셨습니다!').setStyle('PRIMARY')
    );

    msg.channel.send({
      embeds: [finishedEmbed],
      components: [Button],
      files: ['./src/assets/images/icon.png', './src/assets/images/imsi.png']
    });
  }
};
