# 🔃 Transferreddit 🔃

> A tool to copy saved posts from one Reddit account to another one

You can see and use the deployed web app here: https://transferreddit.now.sh/

See also the [backend source code of this web app](https://github.com/samlamar/transferreddit-server)


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

**You will need a Reddit app to use Transferreddit from the source code**

![reddit app setup](/res/appsetup.png)

See the official [Reddit documentation](https://www.reddit.com/dev/api) and [their wiki](https://github.com/reddit-archive/reddit/wiki/API) for more information on how Reddit apps work.

Once you have a Reddit app set up, you will also need to create 2 files named secret.js and devsecret.js in the config folder where you export the environment variables that contain the information needed to communicate with the Reddit API.

![env vars](/res/envvars.png)


