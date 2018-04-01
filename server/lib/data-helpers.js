'use strict';

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function (newTweet, callback) {
      db.collection('tweets').insertOne(newTweet);
      callback(null, true);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function (callback) {
      db.collection('tweets').find().toArray(callback);
    },

    /*
      toggle a "like" for this tweet/user combination: 
      i.e. add a "like" or delete the existing one
    */
    likeTweet: function (user, tweet, callback) {
      // first, let's try to delete an existing "like"
      db.collection('likes').deleteOne( {userID: user, tweetID: tweet}, (err, result) => {
        if (result.deletedCount === 0) {
          // there wasn't one to delete, so we'll add one
          db.collection('likes').insertOne( {userID: user, tweetID: tweet} );
        }
      });
      callback(null, true);
    },

    getLikes: function (tweet, callback) {
      db.collection('likes').aggregate(
      [
        {
          $match: {
            tweetID: tweet
          }
        },
        {
          $group: {
            _id: '$tweetID',
            likes: {$sum: 1}
          }
        }
      ]
      ).toArray(callback);
    }
  };
}
