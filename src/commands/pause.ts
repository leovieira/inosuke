import { Client, Message } from 'discord.js';
import { getVoiceConnection, AudioPlayerStatus } from '@discordjs/voice';
import Servers from '../models/Servers';

const pause = async (client: Client, msg: Message, args: string[]) => {
  if (!msg.member.voice.channel) {
    await msg.channel.send('You must be on a voice channel!');
    return;
  }

  const connection = getVoiceConnection(msg.guild.id);

  if (connection === undefined) return;

  const server = Servers.findServer(msg.guild.id);

  if (server.getPlayer().state.status === AudioPlayerStatus.Playing) {
    server.getPlayer().pause();
    await msg.channel.send(`The music was paused.`);
  }
};

export default pause;
