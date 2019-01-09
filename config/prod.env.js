"use strict";

const {
    VUE_APP_SECRET,
    VUE_APP_CLIENT_ID,
    VUE_APP_USERNAME,
    VUE_APP_PASSWORD,
    VUE_APP_SCOPE,
    VUE_APP_DURATION,
    VUE_APP_API_URL,
    VUE_APP_REDIRECT_URI,
} = require("./secret.js");

module.exports = {
    NODE_ENV: '"production"',
    VUE_APP_SECRET,
    VUE_APP_CLIENT_ID,
    VUE_APP_USERNAME,
    VUE_APP_PASSWORD,
    VUE_APP_SCOPE,
    VUE_APP_DURATION,
    VUE_APP_API_URL,
    VUE_APP_REDIRECT_URI,
};
