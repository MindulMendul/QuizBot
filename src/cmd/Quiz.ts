import { GuildMember, Message, MessageActionRow, MessageButton } from 'discord.js';
import { cmd, embed, participant } from '../types/type';
import fs from 'fs';
import { dirUserDB } from '../../bot';

export const quiz: cmd = {
  name: `퀴즈`,
  cmd: [`퀴즈`, 'ㅋㅈ'],
  permission: ['ADD_REACTIONS', 'EMBED_LINKS'],
  //타로하트 생성과정
  async execute(msg: Message) {
    const quizEmbed: embed = {
      color: 0xf7cac9,
      author: {
        name: '퀴즈봇의 퀴즈 문제',
        icon_url: 'attachment://icon.png'
      },
      description: '퀴즈 문제는 여기에 들어갈 예정',
      image: { url: 'attachment://imsi.png' }
    };

    const oxButton = new MessageActionRow().addComponents(
      new MessageButton().setCustomId('O').setLabel('O').setStyle('SUCCESS'),
      new MessageButton().setCustomId('X').setLabel('X').setStyle('DANGER')
    );

    const makeQuizStr=(OUserList:Array<string>, XUserList:Array<string>, countNum:number)=>{
      return`**O를 선택한 사람**\n> ${OUserList.join(" ")} \n**X를 선택한 사람**\n> ${XUserList.join(" ")} \n**OX를 고른 사람 수** : ${countNum}명`;
    }

    const quizStr=makeQuizStr([],[],0);
    const asdf = await msg.channel.send({
      content: quizStr,
      embeds: [quizEmbed],
      components: [oxButton],
      files: ['./src/asset/icon.png', './src/asset/imsi.png']
    });

    const filter = () => {
      // user DB 안에 정보가 있는지 검사
      const rawDB = fs.readFileSync(dirUserDB, 'utf8');
      const DB = JSON.parse(rawDB) as Array<participant>;
      return DB.some((e: participant) => {
        return e.id === msg.author.id;
      });
    };
    const collector = asdf.createMessageComponentCollector({ filter });
    
    collector.on('collect', async (i) => {
      const content = i.message.content;
      const memberID = (i.member as GuildMember).user.id;

      const [O, OCountStr, X, XCountStr, countStr] = content.split("\n");
      
      const OCount=OCountStr.slice(3).split(" ");
      const XCount=XCountStr.slice(3).split(" ");
      let count=Number(countStr.replace(/[^0-9]/g, "")); 
      OCount.pop(); XCount.pop();

      //read UserDB
      const rawDB = fs.readFileSync(dirUserDB, 'utf8');
      const DB = JSON.parse(rawDB) as Array<participant>;
      const validation = DB.find((e: participant) => {
        return e.id === memberID;
      }); // entity가 DB 안에 있는지 검사
      
      if(validation){
        const name=validation.name;

        console.log(OCount);
        console.log(XCount);
        //Count
        const OIndex = OCount.indexOf(name);
        const XIndex = XCount.indexOf(name);
        console.log(OIndex);
        console.log(XIndex);
        if(!OCount.includes(name) && !XCount.includes(name)) count++;
        
        //OX list
        if(OIndex>-1){
          if (i.customId=="O") OCount[OIndex] = (name);
          else if (i.customId=="X") XCount[XIndex] = (name);
        } else {
          if (i.customId=="O") OCount.push(name);
          else if (i.customId=="X") XCount.push(name);
        }        
      }

      i.update({content:makeQuizStr(OCount, XCount, count)});
    });
  }
};
