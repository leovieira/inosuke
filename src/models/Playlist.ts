import Music from './Music';

class Playlist {
  private storage: Array<Music>;
  private currentMusic: Music;

  public constructor(musics: Array<Music> = []) {
    this.storage = musics;
    this.currentMusic = undefined;
  }

  public setMusics(musics: Array<Music>): void {
    this.storage = musics;
  }

  public getMusics(): Array<Music> {
    return this.storage;
  }

  public getCurrentMusic(): Music {
    return this.currentMusic;
  }

  public addMusic(music: Music): void {
    this.storage.push(music);
  }

  public nextMusic(): Music {
    this.currentMusic = this.storage.shift();
    return this.currentMusic;
  }

  public clear(): void {
    this.storage = [];
  }
}

export default Playlist;
