import { utils, readFile } from 'ts-xlsx';
import fs from 'fs';
import { dirAsset } from '../../bot';

export const makeQuiz = () => {
    const workbook = readFile(`${dirAsset}/MapleQuiz.xlsx`);
    //workbook에서 xlsx 파일을 못 여는 중
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = utils.sheet_to_json(sheet);

    const json = JSON.stringify(data);
    fs.writeFile(`${dirAsset}/DB/userDB.json`, json, () => { });
}