/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

function createTweetElement(tweet) {
  let $tweet = $('<article>').addClass('tweet');
  let timeAgo = ($.now() - tweet.created_at) / 1000 / 60 // minutes ago
  if (timeAgo < 1) {
    timePhrase = "Now";
  } else if (timeAgo < 60) {
    timePhrase = Math.floor(timeAgo) + " minutes ago"
  } else {
    timeAgo /= 60;  // hours ago
    if (timeAgo < 24) {
      timePhrase = Math.floor(timeAgo) + " hours ago"
    } else {
      timeAgo /= 24;  // days ago
      timePhrase = Math.floor(timeAgo) + " days ago"
    }
  }
  $tweet.append(`
    <header>
      <img class="face" src="${tweet.user.avatars.small}">
      <label class="name">${tweet.user.name}</label>
      <label class="handle">${tweet.user.handle}</label>
    </header>
    <p>${tweet.content.text}</p>
    <footer>
      <label class="ago">${timePhrase}</label>
      <i class="fas fa-heart"></i>
      <i class="fas fa-retweet"></i>
      <i class="fas fa-flag"></i>
    </footer>
`);
  return $tweet;
}

// Test / driver code (temporary). Eventually will get this from the server.
const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": {
        "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": {
        "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  },
  {
    "user": {
      "name": "Johann von Goethe",
      "avatars": {
        "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@johann49"
    },
    "content": {
      "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 1461113796368
  }
];

function renderTweets(tweets) {
  tweets.forEach((tweet) => $('#tweets').append(createTweetElement(tweet)));
}

$(document).ready(function () {
  renderTweets(data);
});
