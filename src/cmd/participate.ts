import { cmd, DB } from "../types/type";
import fs from 'fs';
import { dirAsset } from '../../bot';

interface participant {
	id: string
	name: string
}

export const participate: cmd = {
	name: `참가`,
	cmd: [`참가`, 'ㅊㄱ'],
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
					const db = JSON.parse(data) as DB;
					const table = db.table;
					const validation = table.some((e: participant) => { return (e.id === entity.id); }); // table에 있는지 확인

					if (validation) msg.reply("이미 등록된 사람은 안 됨~");
					else {
						table.push(entity);
						const json = JSON.stringify(db);
						fs.writeFile(`${dirAsset}/DB/userDB.json`, json, () => { });
					}
				}
			})
		}

		loadDB();
	}
}