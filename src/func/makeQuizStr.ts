import { PARTICIPANT } from "../types/type";

export default function makeQuizStr(OUserList: Array<PARTICIPANT>, XUserList: Array<PARTICIPANT>, countNum: number) {
	return "**O를 선택한 사람**\n> " + OUserList.map((e)=>{return e.name;}).join(' ') +
		"\n**X를 선택한 사람**\n> " + XUserList.map((e)=>{return e.name;}).join(' ') +
		"\n**OX를 고른 사람 수** :" + countNum + "명";
};