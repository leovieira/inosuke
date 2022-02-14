import { AudioPlayer } from '@discordjs/voice';
import Playlist from './Playlist';

class Server {
  private id: string;
  private player: AudioPlayer;
  private playlist: Playlist;

  public constructor(
    id: string,
    player: AudioPlayer,
    playlist: Playlist = new Playlist()
  ) {
    this.id = id;
    this.player = player;
    this.playlist = playlist;
  }

  public getId(): string {
    return this.id;
  }

  public getPlayer(): AudioPlayer {
    return this.player;
  }

  public setPlayer(player: AudioPlayer): void {
    this.player = player;
  }

  public getPlaylist(): Playlist {
    return this.playlist;
  }

  public setPlaylist(playlist: Playlist): void {
    this.playlist = playlist;
  }
}

export default Server;
