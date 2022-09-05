const Discord = require('discord.js');

function create_embed(title, updated_embed_body) {
  const embed = new Discord.MessageEmbed().setTitle(title);
  embed.setTimestamp();
  return {
    set_content_area,
    set_footer
  }

  function set_content_area(news, num_page, [
    title,
    link
  ]) {
    return updated_embed_body(embed, news, num_page)
  }

  function set_footer(field, val) {

    embed.setFooter(field, val);
  }

};

async function embed_message (embed_object, embed_body)
{
  console.log("embed", embed_object);
  let { 
  news,
    num_page_instance,
    msg,
    title,
    paging,
    reaction_filter,
    pagination_update,
    updated_embed_body,
    query_str
  } = embed_object;
  

  let navigation_embed = new Discord.MessageEmbed()
    navigation_embed.setTitle(title)
    navigation_embed.setTimestamp()
    // navigation_embed.setFooter(`page ${embed_object.num_page_instance.num_page} of ${(news.length-1) - (embed_object.num_page_instance.num_page)}`, `https://images.freeimg.net/rsynced_images/news-97862_1280.png`)


  embed_body(embed_object, navigation_embed);

  const nav = await msg.channel.send(navigation_embed)

  const left = await nav.react('⬅️');
  await left.message.react('➡️')
    .then(mReaction => {
      // createReactionCollector - responds on each react, AND again at the end.
      const collector = mReaction.message.createReactionCollector(reaction_filter, {
        time: 20000000,
        dispose: true
      });

      const embed = create_embed(title, updated_embed_body)

      collector.on('remove', collect => {
        let reaction = collect.emoji.name;
        let page_dif = embed_object.num_page.num_page
       let dif = paging[reaction](embed_object.num_page, news.length)
        if (page_dif === dif) return;


        embed.set_footer(`page ${embed_object.num_page.num_page+1} of ${(news.length-1) - (embed_object.num_page.num_page+1)}`, `https://images.freeimg.net/rsynced_images/news-97862_1280.png`)
        collect.message.edit(embed.set_content_area(news, embed_object.num_page, ['news', 'link']))
          .then(x => x)
          .catch(console.error);
      });

      collector.on('collect', collect => {
        const reaction = collect.emoji.name

        // exampleEmbed.fields=[];

        let page_diff =   embed_object.num_page.num_page 
        let dif = paging[reaction](embed_object.num_page, news.length)
        if (page_diff === dif) return;

        let updateEmbed = new Discord.MessageEmbed().setTitle(title, updated_embed_body)
          .setTimestamp()
          .setFooter(`page ${embed_object.num_page.num_page + 1} of ${(news.length - 1) - (embed_object.num_page.num_page)}`, `https://images.freeimg.net/rsynced_images/news-97862_1280.png`)
        pagination_update(updateEmbed, news, embed_object.num_page)
        collect.message.edit(updateEmbed)
          .then(newMsg => {

          })
          .catch(console.error);
      });
      collector.on('end', collected => {
        console.log(`Collected ${collected.size} reactions`)
      });
    })
    .catch(console.error);
}


module.exports = {
  embed_message
};