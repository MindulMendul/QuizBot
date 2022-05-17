const {MessageActionRow, MessageButton}=require('discord.js');
module.exports = {
	name: `퀴즈`,
	cmd: ["퀴즈"],
    permission: ["ADD_REACTIONS", "EMBED_LINKS"],
    //타로하트 생성과정
    async execute(msg){
        const quizEmbed = {
            color: 0xF7CAC9,
            author: {
                name: '민둘봇의 타로 하트',
                icon_url: 'https://i.imgur.com/AD91Z6z.jpg',
            },
            description: '6개의 이모지로 입력된 하트를 하나만 아무거나 선택해 주세요!',
            image: {url: "https://i.imgur.com/SP7ND76.png"},
        };

        const oxButton = new MessageActionRow()
        .addComponents(new MessageButton().setCustomId('O').setLabel('O').setStyle("SUCCESS"),)
        .addComponents(new MessageButton().setCustomId('X').setLabel('X').setStyle("DANGER"),)

        const asdf=await msg.channel.send({embeds: [quizEmbed], components:[oxButton]});

        const filter = () => {return true;}
        const collector = asdf.createMessageComponentCollector({filter});
        collector.on('collect', async i => {
            const tarotEmbed = {
                color: 0xF7CAC9,
                author: {
                    name: '민둘봇의 타로 하트',
                    icon_url: 'https://i.imgur.com/AD91Z6z.jpg',
                },
                description: `${strDes}`,
                fields:[{name: `오늘은 **${strField[0]}**이에요`, value: strField[2]}],
                image: {url: strField[1]},//url말고 다른 방법이 없을까
                footer: {
                    text: `모든 설명은 심리학 이론인 바넘효과를 바탕으로 작성되었습니다.`,
                    icon_url: 'https://i.imgur.com/AD91Z6z.jpg',
                },
            };
            i.update({embeds: [tarotEmbed], components:[]});
        });
    }
}