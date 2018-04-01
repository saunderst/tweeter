var fakeUserID = "";
var tweetLikesElement;

function buildTweetLikesElement(tweetId, callback) {
  let tweetLikesElement = '';
  $.get('/tweets/likes/' + tweetId, ((likesInfo) => {
    if (likesInfo.length > 0) {
      tweetLikesElement = '<label class="likes">'
        + likesInfo[0].likes
        + ' like'
        + (likesInfo[0].likes > 1 ? 's' : '')
        + '</label>';
    }
    callback(tweetLikesElement);
  }));
}

/*
  Create the display elements to represent a single specified tweet,
  and return a bunch of HTML accordingly.
*/
function createTweetElement(tweet) {
  let $tweet = $(`<article data-tweetid=${tweet._id}>`).addClass('tweet');
  let timeAgo = ($.now() - tweet.created_at) / 1000 / 60 // minutes ago
  if (timeAgo < 1) {
    timePhrase = 'Now';
  } else if (timeAgo < 60) {
    timePhrase = Math.floor(timeAgo) + ' minutes ago'
  } else {
    timeAgo /= 60;  // hours ago
    if (timeAgo < 24) {
      timePhrase = Math.floor(timeAgo) + ' hours ago'
    } else {
      timeAgo /= 24;  // days ago: the maximum time units (for now)
      timePhrase = Math.floor(timeAgo) + ' days ago'
    }
  }

  let tweetLikesElement = '';
  buildTweetLikesElement(tweet._id, (tweetLikesElement) => {
    $tweet.append(`
      <header>
      <img class='face' src='${tweet.user.avatars.large}'>
      <label class='name'>${tweet.user.name}</label>
      <label class='handle'>${tweet.user.handle}</label>
      </header>
      <p>${tweet.content.text}</p>
      <footer>
      <label class='ago'>${timePhrase}</label>
      ${tweetLikesElement}
      <i class='fas fa-flag'></i>
      <i class='fas fa-retweet'></i>
      <i class='fas fa-heart'></i>
      </footer>
      `);
  });
  return $tweet;
}

// Get all the existing tweets from the database and use them to build the bulk of the main page.
function loadTweets() {
  $.get('/tweets', tweets => {
    // The database returns the tweets in order of creation, so prepend to show newest first.
    tweets.forEach((tweet) => $('#tweets').prepend(createTweetElement(tweet)));
  });
}

$(document).ready(function () {
  // Start off by showing existing tweets.
  loadTweets();

  /* Upon each submission of new tweets:
    - do some data checking
    - post the new tweet
    - get the tweets and update display to include the new one
  */
  $('.new-tweet form').on('submit', function (event) {
    event.preventDefault();
    $tweetText = $('.new-tweet textarea').val();
    if (/[\<\>\/]/.test($tweetText)) {  // look out for HTML tags to avoid scripting
      alert('Tweet contains invalid characters.')
    } else if ($tweetText.length > 140) {
      alert('Gotta shorten up that tweet.');
    } else if ($tweetText.length === 0) {
      alert('Can\'t post an empty tweet.');
    } else {
      /* NOTE FOR IMPROVEMENT:
        Consider that in the multiuser case, the last tweet may not be the one we just added here.
        Idea: modify the server to return an identifier in POST response, then submit that to a modified GET route
        in order to get the tweet we just added.
        Or simpler to just get all (or the last N) tweets in this case?
      */
      $.post('/tweets', $(this).serialize(), () => {
        $.get('/tweets', data => {
          $('#tweets').prepend(createTweetElement(data[data.length - 1]));
        });
        $('.new-tweet textarea').val(''); // clear the input box
      });
    }
  });

  // implement a button that hides/shows the new tweet editor
  $('.composeButton').on('click', function (event) {
    if ($(this).hasClass('active')) {
      $(this).removeClass('active');
      $('.new-tweet').slideDown();
      $('.new-tweet textarea').focus();  // if we're revealing it, we want to use it
    } else {
      $(this).addClass('active');
      $('.new-tweet').slideUp();
    }
  });

  $('#tweets').on('click', '.face', function (event) {
    fakeUserID = $(this).closest('.tweet').find('.handle').text();
    $('#whoisit').text(fakeUserID);
  });

  $('#tweets').on('click', '.fa-heart', function (event) {
    if (!fakeUserID) {
      alert('You must be logged in to like tweets.');
    } else {
      let $thisTweet = $(this).closest('.tweet')
      if ($thisTweet.find('.handle').text() === fakeUserID) {
        alert('You can\'t like your own tweets.\n\nWell, you probably do like them, but you can\'t "like" them.');
      } else {
        let tweetId = $thisTweet.data('tweetid');
        $.post('/tweets/like', { user: fakeUserID, tweet: tweetId }, () => {
          buildTweetLikesElement(tweetId, (tweetLikesElement) => {
            let oldLikesElement = $(this).closest('footer').find('.likes');
            if (oldLikesElement.length > 0) {
              oldLikesElement.before(tweetLikesElement);
              oldLikesElement.remove();
            } else {
              $(this).closest('footer').append(tweetLikesElement);
            }
          });
        });
      }
    }
  });
});