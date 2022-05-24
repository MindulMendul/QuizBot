import { IWorkBook, utils, readFile, read } from 'ts-xlsx';
export const makeQuiz = () => {
    const workbook: IWorkBook = read("../asset/MapleQuiz.xlsx",{type:"array"});
    //workbook에서 xlsx 파일을 못 여는 중
    const sheetName:string = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = utils.sheet_to_json(sheet);
    console.log(data);
}