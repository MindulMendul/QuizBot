import { cmd } from "../type/type";
import fs from 'fs';

export const participate: cmd = {
	name: `참가`,
	cmd: [`참가`, 'ㅊㄱ'],
	permission: ["ADD_REACTIONS", "EMBED_LINKS"],
	//타로하트 생성과정
	async execute(msg, args) {
		const entity = {
			"id": msg.author.id,
			"name": args.join(" ")
		};
		const obj = entity;

		const loadDB = () => {
			fs.readFile('./test.json', 'utf8', (err, data) => {
				if (err) {
					console.log(err);
				} else {
					const db=JSON.parse(data);
					const table=db.table; table.push(obj);
					const json = JSON.stringify(db);
					fs.writeFile('./test.json', json, ()=>{});
				}
			})
		}
		
		loadDB();
	}
}