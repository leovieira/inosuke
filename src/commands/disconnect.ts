import { Client, Message } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';

const disconnect = async (client: Client, msg: Message, args: string[]) => {
  if (!msg.member.voice.channel) {
    msg.channel.send('You must be on a voice channel!');
    return;
  }

  if (!msg.member.voice.channel.members.has(client.user.id)) return;

  const connection = getVoiceConnection(msg.guild.id);
  connection.disconnect();
};

export default disconnect;
