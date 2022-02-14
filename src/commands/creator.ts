import { Client, Message } from 'discord.js';

const creator = async (client: Client, msg: Message, args: string[]) => {
  await msg.channel.send('My creator is D3m0n1c Gh0st');
};

export default creator;
