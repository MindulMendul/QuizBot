import { cmd } from '../types/type';
import fs from 'fs';
import { dirAsset } from '../../bot';

interface participant {
    id: string;
    name: string;
}

export const deleteMember: cmd = {
    name: `불참`,
    cmd: [`불참`, 'ㅂㅊ'],
    permission: ['ADD_REACTIONS', 'EMBED_LINKS'],
    async execute(msg, args) {
        const entity: participant = {
            id: msg.author.id,
            name: args.join(' ')
        };

        const loadDB = () => {
            fs.readFile(`${dirAsset}/DB/userDB.json`, 'utf8', (err, data) => {
                if (err) console.log(err);
                else {
                    const DB = JSON.parse(data);
                    const myData = DB.find((e: participant, i: number) => {
                        if (e.id === entity.id) {
                            DB.splice(i, 1);
                            return true;
                        } else return false;
                    }); // table에 있는지 확인

                    if (myData) {
                        const json = JSON.stringify(DB);
                        fs.writeFile(`${dirAsset}/DB/userDB.json`, json, () => {});
                        msg.reply(`삭제 완료되었습니다!`);
                    } else msg.reply(`데이터베이스에 이미 당신의 이름이 없어요!`);
                }
            });
        };
        loadDB();
    }
};
