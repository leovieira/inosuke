import Server from './Server';

class Servers {
  private storage: Array<Server>;

  public constructor(servers: Array<Server> = []) {
    this.storage = servers;
  }

  public setServers(servers: Array<Server>): void {
    this.storage = servers;
  }

  public getServers(): Array<Server> {
    return this.storage;
  }

  public addServer(server: Server): void {
    this.storage.push(server);
  }

  public findServer(id: string): Server {
    return this.storage.find((server) => server.getId() === id);
  }

  public removeServer(id: string): void {
    let index = this.storage.findIndex((server) => server.getId() === id);

    if (index > -1) {
      this.storage.splice(index, 1);
    }
  }

  public clear(): void {
    this.storage = [];
  }
}

export default new Servers();
