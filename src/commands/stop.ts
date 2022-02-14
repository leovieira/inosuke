import { Client, Message } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import Servers from '../models/Servers';

const stop = async (client: Client, msg: Message, args: string[]) => {
  if (!msg.member.voice.channel) {
    await msg.channel.send('You must be on a voice channel!');
    return;
  }

  const connection = getVoiceConnection(msg.guild.id);

  if (connection === undefined) return;

  const server = Servers.findServer(msg.guild.id);
  server.getPlayer().stop();
  server.getPlaylist().clear();
  await msg.channel.send('The player was stopped.');
};

export default stop;
