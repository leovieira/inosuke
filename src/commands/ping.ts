import { Client, Message } from 'discord.js';

const ping = async (client: Client, msg: Message, args: string[]) => {
  await msg.reply('pong');
};

export default ping;
