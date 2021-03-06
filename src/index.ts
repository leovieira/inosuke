import { Client, Intents } from 'discord.js';
import 'dotenv/config';
import keepAlive from './server';
import commandHandler from './commandHandler';

keepAlive();

const intents = new Intents();
intents.add([
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_VOICE_STATES,
]);

const client = new Client({ intents });

client.on('ready', () => {
  console.log('Bot is ready!');
  client.user.setActivity('EMINEM', { type: 'LISTENING' });
});

client.on('messageCreate', (msg) => commandHandler(client, msg));

client.login(process.env.botToken);
