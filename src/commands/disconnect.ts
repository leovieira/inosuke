import { Client, Message } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import Servers from '../models/Servers';

const disconnect = async (client: Client, msg: Message, args: string[]) => {
  if (!msg.member.voice.channel) {
    msg.channel.send('You must be on a voice channel!');
    return;
  }

  if (!msg.member.voice.channel.members.has(client.user.id)) return;

  const connection = getVoiceConnection(msg.guild.id);
  connection.disconnect();
  Servers.removeServer(msg.guild.id);
  await msg.channel.send('Disconnected.');
};

export default disconnect;
