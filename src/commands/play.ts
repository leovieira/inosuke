import { Client, Message } from 'discord.js';
import {
  getVoiceConnection,
  AudioPlayerStatus,
  createAudioResource,
} from '@discordjs/voice';
import ytdl from 'ytdl-core';
import join from './join';
import Servers from '../models/Servers';
import Music from '../models/Music';

const play = async (client: Client, msg: Message, args: string[]) => {
  if (!msg.member.voice.channel) {
    await msg.channel.send('You must be on a voice channel!');
    return;
  }

  var connection = getVoiceConnection(msg.guild.id);

  if (connection === undefined) {
    await join(client, msg, args);
    connection = getVoiceConnection(msg.guild.id);
  }

  const server = Servers.findServer(msg.guild.id);

  if (args.length === 0) {
    if (server.getPlayer().state.status === AudioPlayerStatus.Paused) {
      server.getPlayer().unpause();
      await msg.channel.send('The music was unpaused.');
    }

    return;
  }

  if (ytdl.validateURL(args[0])) {
    const ytdlInfo = await ytdl.getInfo(args[0]);
    const info = {
      title: ytdlInfo.videoDetails.title,
      author: ytdlInfo.videoDetails.author.name,
      link: ytdlInfo.videoDetails.video_url,
    };
    const music = new Music(info.title, info.author, info.link);
    server.getPlaylist().addMusic(music);
    await msg.channel.send(
      `${music.getTitle()} has been added to the playlist.`
    );
  }

  if (server.getPlayer().state.status !== AudioPlayerStatus.Idle) return;

  const nextMusic = server.getPlaylist().nextMusic();
  const resource = createAudioResource(ytdl(nextMusic.getLink()), {
    metadata: {
      title: nextMusic.getTitle(),
      author: nextMusic.getAuthor(),
    },
  });
  server.getPlayer().play(resource);
  await msg.channel.send(`Playing ${nextMusic.getTitle()}.`);
};

export default play;
