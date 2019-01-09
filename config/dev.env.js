"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

const {
    VUE_APP_SECRET,
    VUE_APP_CLIENT_ID,
    VUE_APP_USERNAME,
    VUE_APP_PASSWORD,
    VUE_APP_SCOPE,
    VUE_APP_DURATION,
    VUE_APP_API_URL,
    VUE_APP_REDIRECT_URI,
} = require("./devsecret.js");

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    VUE_APP_SECRET,
    VUE_APP_CLIENT_ID,
    VUE_APP_USERNAME,
    VUE_APP_PASSWORD,
    VUE_APP_SCOPE,
    VUE_APP_DURATION,
    VUE_APP_API_URL,
    VUE_APP_REDIRECT_URI,
});
