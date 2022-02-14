import { Client, Message } from 'discord.js';

const contribute = async (client: Client, msg: Message, args: string[]) => {
  await msg.channel.send('Visit: https://github.com/leovieira/inosuke');
};

export default contribute;
