class Music {
  private id: number;
  private title: string;
  private author: string;
  private link: string;
  private static counter: number = 0;

  public constructor(title: string, author: string, link: string) {
    this.id = ++Music.counter;
    this.title = title;
    this.author = author;
    this.link = link;
  }

  public getId(): number {
    return this.id;
  }

  public getTitle(): string {
    return this.title;
  }

  public setTitle(title: string): void {
    this.title = title;
  }

  public getAuthor(): string {
    return this.author;
  }

  public setAuthor(author: string): void {
    this.author = author;
  }

  public getLink(): string {
    return this.link;
  }

  public setLink(link: string): void {
    this.link = link;
  }
}

export default Music;
