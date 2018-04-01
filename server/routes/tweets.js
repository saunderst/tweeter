"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }


    const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now()
    };

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });

  // process "like" request
  tweetsRoutes.post("/like/", function(req, res) {
    if (!req.body.user || !req.body.tweet) {
      res.status(400).json({ error: 'invalid request: missing user ID or tweet ID'});
      return;
    }

    DataHelpers.likeTweet(req.body.user, req.body.tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });
  
  // get "like" history for a given tweet
  tweetsRoutes.get("/likes/:tweetID", function(req, res) {
    DataHelpers.getLikes(req.params.tweetID,(err,likes) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(likes);
      }
    });
  });
  
  return tweetsRoutes;
}
