import { Client, Message } from 'discord.js';
import { getVoiceConnection, AudioPlayerStatus } from '@discordjs/voice';
import Servers from '../models/Servers';

const unpause = async (client: Client, msg: Message, args: string[]) => {
  if (!msg.member.voice.channel) {
    await msg.channel.send('You must be on a voice channel!');
    return;
  }

  const connection = getVoiceConnection(msg.guild.id);

  if (connection === undefined) return;

  const server = Servers.findServer(msg.guild.id);

  if (server.getPlayer().state.status === AudioPlayerStatus.Paused) {
    server.getPlayer().unpause();
    await msg.channel.send(`The music was unpaused.`);
  }
};

export default unpause;
