# engage.ai: Your smart Twitter Engagement Expert

This is not your ordinary bot. This is a smart bot that reads tweets in your timeline, understands it's intent, and then gives a fitting reply to it. 

* Don't have time to be on social media?
* Want to increase your engagement and followers?
* engage.ai can do everything seamlessly. 

## Results

<img src="https://public-files.gumroad.com/ph9gwq6xoael1zgegphclj2y1vtr" data-canonical-src="public/engagement.png" width="250" />
<img src="https://public-files.gumroad.com/oy8ohu4mjgdoxqh551fv60yxclam" data-canonical-src="public/retweetengagement.png" width="250" />





## Highlights

✅ **Reads your tweets, understands their intent, then gives a reply**

✅ **Reply to one tweet every hour**

✅ **No need to scroll through social media all the time to engage**

✅ **Set up once, and forget**




## How to use

Use the following button to deploy it directly on netlify.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ghosharnab00/twitter-smart-bot)


### Add the following enviorentment variables. 

* Step 1: Log in to https://developer.twitter.com and create an project and app. 
* Step 2: Get "Client ID", "Client_secret", "Access_Token", and "Access_Token_Id" from the app for V2 API.
* Step 3: Create Account on openai and get the access token.
* Step 4: Get your curated Twitter list id. 
* Step 4: Add thoese as `enviornment variables`.

```
TWITTER_ID=""
TWITTER_SECRET=""
ACCESS_TOKEN=""
ACCESS_TOKEN_SECRET=""
OPENAI_KEY=""
LISTID=""
```
* Step 6: The endpoint is: ```https://yourwebsite.netlify.com/.netlify/functions/app```
* Step 5: Go to https://cron-job.org/ and set a cronjob to call the api every hour or 2 hours depending on your choice
### Installation on Local Machine

* Clone the repo from this website, then
* In command line:
  * ```$ git clone https://github.com/ghosharnab00/twitter-smart-bot```
  * ```$ cd twitter-smart-bot```
  * ```$ npm install```
  * ```$ netlify dev```

 At this point you should see the app running on 

 ```http://localhost:8888/.netlify/functions/app```


  
 And start developing for contribution.




