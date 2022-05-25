import { cmd } from "../types/type";
import fs from 'fs';
import { dirAsset } from '../../bot';

interface participant {
	id: string
	name: string
}

export const updateMember: cmd = {
	name: `이름변경`,
	cmd: [`이름변경`, '변경', 'ㅂㄱ', 'ㅇㄹㅂㄱ', 'ㅇㄼㄱ'],
	permission: ["ADD_REACTIONS", "EMBED_LINKS"],
	async execute(msg, args) {
		const entity: participant = {
			"id": msg.author.id,
			"name": args.join(" ")
		};

		const loadDB = () => {
			fs.readFile(`${dirAsset}/DB/userDB.json`, 'utf8', (err, data) => {
				if (err) console.log(err);
				else {
					const DB = JSON.parse(data);
					const myData = DB.find((e: participant, i:number) => {
						if(e.id === entity.id) {
							DB.splice(i,1);
							return true;
						} else return false;
					}); // table에 있는지 확인

					if (myData){
						const updateData = {
							id: myData.id, 
							name: args.join(" ")
						}
						DB.push(updateData);
						const json = JSON.stringify(DB);
						fs.writeFile(`${dirAsset}/DB/userDB.json`, json, () => { });
						msg.reply(`이름 변경이 완료되었습니다!`);
					} else msg.reply(`참가 명령어를 통해 참가자 등록을 먼저 해주세요!`);
					
				}
			})
		}
		loadDB();
	}
}