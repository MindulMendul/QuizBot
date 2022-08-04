import { Message } from 'discord.js';

export interface CMD {
  name: string;
  cmd: Array<string>;
  permission: Array<string>;
  execute: (arg0: Message, arg1: Array<string>) => Promise<void | string | Message>;
}

export interface EMBED {
  color: number;
  author: {
    name: string;
    icon_url: string;
  };
  description: string;
  image: { url: string };
}

export interface PARTICIPANT {
  id: string;
  profileName: string;
  name: string;
  ox: Array<string>;
}

export interface EVENT {
  quizIndex: number;
  msgID: string;
}

export interface QUIZ {
  문제번호: string;
  난이도: string;
  문제지: string;
  문제사진: string;
  정답: string;
  해설: string;
  해설사진: string;
}
