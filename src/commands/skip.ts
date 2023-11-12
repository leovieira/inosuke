import { Client, Message } from 'discord.js';
import { getVoiceConnection, createAudioResource } from '@discordjs/voice';
import ytdl from 'ytdl-core';
import Servers from '../models/Servers';

const skip = async (client: Client, msg: Message, args: string[]) => {
  if (!msg.member.voice.channel) {
    await msg.channel.send('You must be on a voice channel!');
    return;
  }

  const connection = getVoiceConnection(msg.guild.id);

  if (connection === undefined) return;

  try {
    const server = Servers.findServer(msg.guild.id);
    const currentMusic = server.getPlaylist().getCurrentMusic();
    const nextMusic = server.getPlaylist().nextMusic();

    const resource = createAudioResource(
      ytdl(nextMusic.getLink(), {
        filter: 'audioonly',
      }),
      {
        metadata: {
          title: nextMusic.getTitle(),
          author: nextMusic.getAuthor(),
        },
      }
    );

    server.getPlayer().play(resource);
    await msg.channel.send(`Skipped ${currentMusic.getTitle()}.`);
    await msg.channel.send(`Playing ${nextMusic.getTitle()}.`);
  } catch (error) {}
};

export default skip;
