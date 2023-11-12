import { Client, Message } from 'discord.js';
import {
  getVoiceConnection,
  AudioPlayerStatus,
  createAudioResource,
} from '@discordjs/voice';
import ytdl from 'ytdl-core';
import ytsr from 'ytsr';
import join from './join';
import Servers from '../models/Servers';
import Music from '../models/Music';
import { prefix } from '../../config.json';

const filter = async (res: Message) => {
  if (!res.content.startsWith(prefix)) return false;

  const args = res.content.slice(prefix.length).trim().split(/\s+/);
  const command = args.shift().toLowerCase();
  const option = Number.parseInt(args[0]);

  if (command !== 'select' || !Number.isInteger(option)) return false;

  if (option < 1 || option > 5) return false;
  return true;
};

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
  } else {
    var query = '';

    for (let i = 0; i < args.length; i++) {
      query += args[i];

      if (i < args.length - 1) query += ' ';
    }

    const searchFilters = await ytsr.getFilters(query);
    const searchFilter = searchFilters.get('Type').get('Video');
    const searchResults = await ytsr(searchFilter.url, { limit: 5 });

    var msgText = 'Select a music:\n\n';
    var count = 0;

    searchResults.items.forEach((item: ytsr.Video) => {
      msgText += `**${++count}:** ${item.title}\n`;
    });

    msgText += '\nType "!select <option>" to add the music.';

    const msgMusicList = await msg.channel.send(msgText);
    var option = -1;

    await msg.channel
      .awaitMessages({
        filter,
        max: 1,
        maxProcessed: 1,
        time: 30000,
        errors: ['time'],
      })
      .then(async (res) => {
        if (res.first().author.id !== msg.author.id) return;

        const args = res
          .first()
          .content.slice(prefix.length)
          .trim()
          .split(/\s+/);
        args.shift();
        option = Number.parseInt(args[0]) - 1;

        await msgMusicList.delete();
        await res.first().delete();
      })
      .catch((err) => {});

    if (option === -1) return;

    const musicUrl = searchResults.items[option].url; // ts error

    if (!ytdl.validateURL(musicUrl)) return;

    const ytdlInfo = await ytdl.getInfo(musicUrl);
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
  await msg.channel.send(`Playing ${nextMusic.getTitle()}.`);
};

export default play;
