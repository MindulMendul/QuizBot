const {MessageActionRow, MessageButton}=require('discord.js');
module.exports={
	name: `퀴즈`,
    cmd: [`퀴즈`,'ㅋㅈ'],
    permission: ["ADD_REACTIONS", "EMBED_LINKS"],
    //타로하트 생성과정
    async execute(msg){
        const quizEmbed = {
            color: 0xF7CAC9,
            author: {
                name: '퀴즈봇의 퀴즈 문제',
                icon_url: 'https://i.imgur.com/AD91Z6z.jpg',
            },
            description: '퀴즈 문제는 여기에 들어갈 예정',
            image: {url: "attachment://imsi.png"},
        };
        
        const oxButton = new MessageActionRow()
        .addComponents(new MessageButton().setCustomId('O').setLabel('O').setStyle("SUCCESS"),)
        .addComponents(new MessageButton().setCustomId('X').setLabel('X').setStyle("DANGER"),)

        const asdf=await msg.channel.send({embeds: [quizEmbed], components:[oxButton],
            files: ['./src/asset/imsi.png']
        });

        const filter = () => {return true;}
        const collector = asdf.createMessageComponentCollector({filter});
        collector.on('collect', async i => {
            
            i.update({content:"ㅎㅇ", embeds: [], components:[]});
        });
    }
}