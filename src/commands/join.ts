import { Client, Message } from 'discord.js';
import {
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnectionStatus,
  createAudioPlayer,
  AudioPlayerStatus,
  createAudioResource,
  entersState,
} from '@discordjs/voice';
import ytdl from 'ytdl-core';
import Server from '../models/Server';
import Servers from '../models/Servers';

const join = async (client: Client, msg: Message, args: string[]) => {
  if (!msg.member.voice.channel) {
    await msg.channel.send('You must be on a voice channel!');
    return;
  }
  if (msg.member.voice.channel.members.has(client.user.id)) return;

  var connection = getVoiceConnection(msg.guild.id);

  if (connection !== undefined) {
    connection.joinConfig.channelId = msg.member.voice.channel.id;
    connection.rejoin(connection.joinConfig);
    await msg.channel.send(`Joined on ${msg.member.voice.channel.name}.`);
    return;
  }

  connection = joinVoiceChannel({
    channelId: msg.member.voice.channel.id,
    guildId: msg.guild.id,
    selfDeaf: true,
    selfMute: false,
    adapterCreator: msg.guild.voiceAdapterCreator,
  });

  connection.on(
    VoiceConnectionStatus.Disconnected,
    async (oldState, newState) => {
      try {
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
          entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
        ]);
      } catch (error) {
        connection.destroy();
      }
    }
  );

  const player = createAudioPlayer();

  player.on(AudioPlayerStatus.Idle, async () => {
    try {
      const server = Servers.findServer(msg.guild.id);
      const nextMusic = server.getPlaylist().nextMusic();

      const resource = createAudioResource(ytdl(nextMusic.getLink()), {
        metadata: {
          title: nextMusic.getTitle(),
          author: nextMusic.getAuthor(),
        },
      });

      server.getPlayer().play(resource);
      await msg.channel.send(`Playing ${nextMusic.getTitle()}.`);
    } catch (error) {}
  });

  const server = new Server(msg.guild.id, player);
  Servers.addServer(server);
  connection.subscribe(player);

  await msg.channel.send(`Joined on ${msg.member.voice.channel.name}.`);
};

export default join;
