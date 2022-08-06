import { MessageActionRow, MessageButton } from 'discord.js';
import { dirUserDB } from '../../bot';
import readJSON from '../func/readJSON';
import { CMD, EMBED, PARTICIPANT } from '../types/type';

export const finish: CMD = {
  name: `수고하셨습니다`,
  cmds: [`수고하셨습니다`],
  permission: ['SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES'],
  async execute(msg) {
    //나만 할 수 있는 거지롱~
    if (msg.author.id != process.env.OWNER_ID) return;

    const userDB = readJSON(dirUserDB) as Array<PARTICIPANT>;

    const makeScoreStr = () => {
      const numO = (e: PARTICIPANT) => {
        return e.ox.filter((e) => {
          return e === 'O';
        }).length;
      };
      const rankList = userDB.sort((a, b) => {
        return numO(b) - numO(a);
      }).map((e, i) => {
        return `${i + 1}. ${e.name}\n> 정답: ${numO(e)}개 (정답률:${2.5 * numO(e)}%)`;
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
