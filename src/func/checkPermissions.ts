import { Message, PermissionResolvable, TextChannel, User } from 'discord.js';
import { bot } from '../../bot';
export default async function checkPermissions(msg: Message<boolean>, permission: PermissionResolvable[]) {
  if (!permission.length) return true;

  const channel = msg.channel as TextChannel;
  const permissions = channel.permissionsFor(bot.user as User);
  if (!permissions) {
    msg.reply('권한을 찾지 못 했어요.');
    return false;
  }

  let msgPermission = `권한이 없어서 사용할 수가 없어요.\n 현재 필요한 권한의 상태입니다.\n`;
  const msgLen = msgPermission.length;

  permission.forEach((elem) => {
    if (!permissions.has(elem)) msgPermission += `> ${elem} : ${permissions.has(elem)}\n`;
  });

  if (msgPermission.length > msgLen) {
    await msg.reply(msgPermission);
    return false;
  } else return true;
}
