require('dotenv').config();
const {
  Configuration,
  OpenAIApi
} = require('openai');
const {
  TwitterApi
} = require('twitter-api-v2');



const userClient = new TwitterApi({
  appKey: process.env.TWITTER_ID,
  appSecret: process.env.TWITTER_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_TOKEN_SECRET
})

const rwClient = userClient.readWrite;

const v2Client = rwClient.v2;

const openAIconfiguration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(openAIconfiguration);



exports.handler = async (event, context) => {

  const result = []
  const tweets = await v2Client.listTweets(process.env.LISTID, {
    max_results: 5
  });
  tweets.data.data.forEach(tweet => {

    if (tweet.text.includes("https") && tweet.text.includes("@")) {
      return;
    } else {

      result.push({
        id: tweet.id,
        tweet: tweet.text
      });

    }
  })

  const twt = "I'm struggling in finding the right icons for the changelog button. The button below opens the widget with the latest updates. Which one do you prefer? A, B, or C?"

  const sentiment = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Decide whether a Tweet's sentiment is funny, sarcastic, informative, inspirational or soulful, or promotional.\n\n##\nTweet: 10 Concepts For A Sharper Thinking Muscle:\nSentiment: Thread\n##\nTweet: To achieve Wealth and Financial Freedom, study these 8 ideas:\nSentiment: Thread\n##\nTweet: Here's how to prepare so your business survives:\nSentiment:    Thread\n##\nTweet: Here's why:\nSentiment:    Thread\n##\nTweet: Introducing The Yearly Review: Your In-Depth Reflection Guide for 2022. • Reflect on the past year • Pinpoint what worked & what didn't • Turn your biggest takeaways into content Sharing it for free until Friday. Like this tweet & reply '2022 review' and I'll DM it to you!\nSentiment:    Promotional\n##\nTweet: ${twt}\nSentiment:  `,
    temperature: 0,
    max_tokens: 60,
    top_p: 1,
    frequency_penalty: 0.5,
    presence_penalty: 0,
  })

  console.log(sentiment.data.choices[0].text)

  if (sentiment.data.choices[0].text == ' Promotional' || sentiment.data.choices[0].text == ' Thread') {

    return {
      statusCode: 200,
      body: JSON.stringify({
        sentiment: "nil",
        tweet: "nil",
        tweetId: result[0].id,
        reply: "nil"
      }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    }
  } else {
    const reply = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Give a ${sentiment.data.choices[0].text} one-sentence reply to the tweet.\n\n${result[0].tweet.replace(/\n/g, '')}`,
      temperature: 1,
      max_tokens: 140,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    console.log(reply.data.choices[0].text);


    await v2Client.reply(
      reply.data.choices[0].text,
      result[0].id,
    )
    return {
      statusCode: 200,
      body: JSON.stringify({
        sentiment: sentiment.data.choices[0].text,
        tweet: result[0].tweet,
        tweetId: result[0].id,
        reply: reply.data.choices[0].text
      }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    }
  }




};