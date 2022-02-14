import { Client, Message } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { prefix } from '../config.json';

const importFile = async (filePath: string) => {
  return (await import(filePath))?.default;
};

const commandsExtension = process.env.enviroment === 'prod' ? '.js' : '.ts';
const commandsPath = path.join(__dirname, 'commands');
const commandsName = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(commandsExtension))
  .map((file) => file.replace(commandsExtension, ''));
var commands = {};

commandsName.forEach(async (name) => {
  let file = name + commandsExtension;
  let filePath = path.join(commandsPath, file);
  let command = await importFile(filePath);
  commands[name] = command;
});

const commandHandler = (client: Client, msg: Message) => {
  if (msg.author.bot) return;
  if (msg.channel.type === 'DM') return;
  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.slice(prefix.length).trim().split(/\s+/);
  const command = args.shift().toLowerCase();

  if (commandsName.indexOf(command) === -1) return;

  commands[command](client, msg, args);
};

export default commandHandler;
