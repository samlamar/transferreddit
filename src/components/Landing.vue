<template>
    <div class="container wrapper">
        <a class="home-button" @click.prevent="homeClick">
            <h1 class="title">Account transfer for reddit</h1>
        </a>

        <h5>Transfer your saved posts from one account to another</h5>

        <div class="actions m-5" v-if="!success">
            <button
                v-if="!requesting && !permissionsError"
                class="btn btn-warning permissions-button"
                @click="getPermissions"
            >{{migrating ? secondMessage : firstMessage}}</button>

            <loading-spinner v-if="requesting"></loading-spinner>

            <div class="alert alert-dismissible alert-danger" v-if="permissionsError">
                <!-- <button type="button" class="close" data-dismiss="alert">&times;</button> -->
                <strong>Couldn't get the permissions</strong>
                <a href="." class="alert-link">Go back to the home page</a> and try again.
            </div>
        </div>

        <div v-else>
            <div class="alert alert-dismissible alert-success">
                <!-- <button type="button" class="close" data-dismiss="alert">&times;</button> -->
                <strong>Transfer successful!</strong> You saved posts were moved.
                <a href="/" class="alert-link">Transfer more?</a>.
            </div>
        </div>

        <div v-if="migrating && !permissionsError && !success" class="warning">
            <p>Don't forget to log out of the old account and log in to the right one if necessary</p>
        </div>

        <!-- <img class="logo" src="../assets/reddit-logo.png" alt> -->
        <a href="https://github.com/samlamar/reddit-transfer-client" target="_blank">
            Check out my code on
            <img class="git-logo" src="../assets/github-logo.png" alt>
        </a>
    </div>
</template>


<script>
const http = require("superagent");
const uuidv4 = require("uuid/v4");
// require('dotenv').config()

import LoadingSpinner from "./LoadingSpinner.vue";

const username = process.env.VUE_APP_USERNAME;
const password = process.env.VUE_APP_VUE_APP_PASSWORD;
const clientId = process.env.VUE_APP_CLIENT_ID;
const secret = process.env.VUE_APP_SECRET;
const redirectUri = process.env.VUE_APP_REDIRECT_URI;
const scope = process.env.VUE_APP_SCOPE;
const duration = process.env.VUE_APP_DURATION;

export default {
    components: {
        "loading-spinner": LoadingSpinner
    },

    data() {
        return {
            firstMessage:
                "Log into your old account (where to take the saved posts from)",
            secondMessage:
                "Log into your new account (where to save the posts to)",
            appData: {
                username,
                password,
                clientId,
                secret,
                scope,
                duration,
                redirectUri
            },
            requestCode: null,
            currentState: null,
            token: null,

            username: null,
            savedPosts: [],
            migrating: false,
            requesting: false,

            success: false,
            permissionsError: false,
            savedError: false
        };
    },

    mounted() {
        if (localStorage.getItem("savedPosts")) {
            var posts = JSON.parse(localStorage.getItem("savedPosts"));
            this.migrating = true;
        }
        if (this.$route.query.code) {
            this.permissionsError = false;
            this.requesting = true;

            this.getRedditToken().then(() => {
                if (this.migrating) {
                    this.saveToNewAccount();
                }
            });
        } else if (this.$route.query.error) {
            //error message
            this.permissionsError = true;
            console.log("error getting permissions");
        }
    },

    methods: {
        homeClick() {
            clearLocalStorage();
            window.open("/", "_self");
        },
        async getRedditToken() {
            this.currentState = this.$route.query.state;
            if (!this.$route.query.error) {
                this.requestCode = this.$route.query.code;
                await this.requestRedditToken()
                    .then(() => {
                        this.getUsername()
                            .then(() => {
                                if (!this.migrating) {
                                    this.getSavedPosts();
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    })
                    .catch(error => {
                        clearLocalStorage();

                        console.log(error);
                    });
            } else {
                this.permissionsError = true;
            }
        },

        clearLocalStorage() {
            localStorage.removeItem("savedPosts");
            localStorage.removeItem("token1");
        },
        saveToNewAccount() {
            const url = `${process.env.VUE_APP_API_URL}save/${this.token}`;

            http.get(url).then(response => {
                clearLocalStorage();
                if (!response.body.error) {
                    this.success = true;
                }
                console.log("success saved!");
            });
        },
        getPermissions() {
            var state = uuidv4();

            var query =
                "https://www.reddit.com/api/v1/authorize.compact" +
                "?response_type=code" +
                "&duration=" +
                this.appData.duration +
                "&scope=" +
                this.appData.scope +
                "&client_id=" +
                this.appData.clientId +
                "&state=" +
                state +
                "&redirect_uri=" +
                this.appData.redirectUri;

            window.open(query, "_self");
        },

        async requestRedditToken() {
            //you stupid fuck, you spent two days racking your brains on this dumb error
            //you didnt put http before localhost.
            const url = `${process.env.VUE_APP_API_URL}requestToken/${
                this.currentState
            }/${this.requestCode}`;

            var call = await http
                .get(url)
                .then(response => {
                    this.token = response.body.access_token;
                    localStorage.setItem("token1", this.token);
                    // this.getUsername();
                })
                .catch(error => {
                    console.log(error);
                });
        },

        async getUsername() {
            const url = `${process.env.VUE_APP_API_URL}getUsername/${
                this.token
            }`;

            var call = await http.get(url).then(response => {
                this.username = response.body.name;
                // this.getSavedPosts();
            });
        },

        async getSavedPosts() {
            const url = `${process.env.VUE_APP_API_URL}getSaved/${
                this.username
            }/${this.token}`;

            var call = await http.get(url).then(response => {
                if (!this.migrating) {
                    this.savedPosts = response.body;
                }
                localStorage.setItem(
                    "savedPosts",
                    JSON.stringify(this.savedPosts)
                );
                this.requesting = false;
                this.migrating = true;
            });
        }
    }
};
</script>

<style scoped>
a {
    text-decoration: none;
    color: inherit;
}

/* .alert {
    font-family: "Heebo", sans-serif;
} */

.wrapper {
    font-family: "Titillium Web", sans-serif;
    text-align: center;
    padding: 40px;
}

.wrapper div {
    margin: 0 auto;
}

img {
    width: 40px;
    height: auto;
}

.git-logo,
.title {
    transition-property: transform;
    transition-duration: 300ms;
}

.git-logo:hover {
    transform: scale(1.4);
}

.title:hover {
    transform: scale(1.05);
}

.permissions-button {
    padding: 15px;
    background-color: #ff4500;
}

.permissions-button:hover {
    background-color: rgb(255, 99, 43);
}
</style>
