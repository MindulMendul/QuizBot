import { CMD, PARTICIPANT } from '../types/type';
import { dirUserDB } from '../../bot';
import readJSON from '../func/readJSON';

export const devGrade: CMD = {
	name: `순위`,
	cmds: [`순위`],
	permission: [],
	async execute(msg) {
		//나만 할 수 있는 거지롱~
		if (msg.author.id != process.env.OWNER_ID) return;

		const userDB = readJSON(dirUserDB) as Array<PARTICIPANT>;

		const numO = (e: PARTICIPANT) => {
			return e.ox.filter((e) => {
				return e === 'O';
			}).length;
		};

		const rankList = userDB.sort((a, b) => {
			return numO(b) - numO(a);
		});

		console.log(rankList);
	}
}