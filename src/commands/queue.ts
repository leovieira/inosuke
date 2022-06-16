import { Client, Message } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import Servers from '../models/Servers';
import Music from '../models/Music';

const queue = async (client: Client, msg: Message, args: string[]) => {
  if (!msg.member.voice.channel) {
    await msg.channel.send('You must be on a voice channel!');
    return;
  }

  var connection = getVoiceConnection(msg.guild.id);

  if (connection === undefined) return;

  const server = Servers.findServer(msg.guild.id);
  const musics = server.getPlaylist().getMusics();

  if (musics.length > 0) {
    var msgText = '';
    var count = 0;

    musics.forEach((music: Music) => {
      msgText += `#${++count} ${music.getTitle()}\n`;
    });

    await msg.channel.send(msgText);
  } else {
    await msg.channel.send('The queue is empty!');
  }
};

export default queue;
