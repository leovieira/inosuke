import { Client, Message, Collection, Snowflake } from 'discord.js';

const filter = async (res: Message) => {
  let channelName = (await res.guild.channels.fetch(res.channel.id)).name;
  return res.content.trim().toLowerCase() === channelName;
};

const clearChannel = async (client: Client, msg: Message, args: string[]) => {
  if (!msg.member.permissions.has('ADMINISTRATOR')) {
    await msg.channel.send('User without administrative permission.');
    return;
  }

  await msg.channel.send('Enter the channel name to confirm.');

  msg.channel
    .awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
    .then(async (res) => {
      if (res.first().author.id !== msg.author.id) return;
      let fetched: Collection<Snowflake, Message>;

      do {
        fetched = await msg.channel.messages.fetch({ limit: 100 });
        await msg.channel.bulkDelete(fetched); // ts error
      } while (fetched.size > 0);
    });
};

export default clearChannel;
