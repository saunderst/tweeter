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

function renderTweets(tweets) {
  tweets.forEach((tweet) => $('#tweets').prepend(createTweetElement(tweet)));
}

function loadTweets() {
  $.get("/tweets", data => {
    renderTweets(data);
  });
}

$(document).ready(function () {
  loadTweets();
  $(".new-tweet form").on("submit", function (event) {
    event.preventDefault();
    $tweetText = $(".new-tweet textarea").val();
    if (/[\<\>\/]/.test($tweetText)) {
      alert('Tweet contains invalid characters.')
    } else if ($tweetText.length > 140) {
      alert('Gotta shorten up that tweet.');
    } else if ($tweetText.length === 0) {
      alert('Can\'t post an empty tweet.');
    } else {
      $.post("/tweets", $(this).serialize(), () => {
        $.get("/tweets", data => {
          $('#tweets').prepend(createTweetElement(data[data.length - 1]));
        });
        $(".new-tweet textarea").val('');
      });
    }
  });

  $('.composeButton').on('click', function(event) {
    if ($(this).hasClass('active')) {
      $(this).removeClass('active');
      $('.new-tweet').slideDown();
      $('.new-tweet textarea').focus();
    } else {
      $(this).addClass('active');
      $('.new-tweet').slideUp();
    }
  })
});
