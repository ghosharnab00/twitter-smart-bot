require('dotenv').config();
const {
  Configuration,
  OpenAIApi
} = require('openai');
const {TwitterApi} = require('twitter-api-v2');



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
  const tweets = await v2Client.listTweets(process.env.LISTID, {max_results:5 });
  tweets.data.data.forEach(tweet=>{

    if (tweet.text.includes("https") && tweet.text.includes("@")){
      return;
    }
    else{
      
    result.push({
                id: tweet.id,
                tweet: tweet.text
              });

    }
  })

    const sentiment = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Decide whether a Tweet's sentiment is funny, sarcastic, informative, inspirational or soulful.\n\nTweet: \"${result[0].tweet}\"\nSentiment: `,
      temperature: 0,
      max_tokens: 60,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    })

    console.log(sentiment.data.choices[0].text)
  
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
    body:  JSON.stringify({
      sentiment:sentiment.data.choices[0].text,
      tweet:result[0].tweet,
      tweetId: result[0].id,
      reply: reply.data.choices[0].text
    }),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  }
};



