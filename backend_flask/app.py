import tweepy
import collections
import pandas as pd
import json
from flask import Flask, jsonify
import nltk, re
from bson import json_util
from flask_cors import CORS
from dotenv import load_dotenv
# import tensorflow as tf
import time
from flask_socketio import SocketIO
import os
from textblob import TextBlob
import random

nltk.download("stopwords")
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer


# from tensorflow.keras.layers import Embedding
# from tensorflow.keras.preprocessing.sequence import pad_sequences
# from tensorflow.keras.preprocessing.text import one_hot


app = Flask(__name__)
CORS(app)
socketio = SocketIO(app,cors_allowed_origins="*")

APP_ROOT = os.path.join(os.path.dirname(__file__), "..")  # refers to application_top
dotenv_path = os.path.join(APP_ROOT, ".env")
load_dotenv(dotenv_path)


auth = tweepy.OAuthHandler(os.getenv("API_KEY"), os.getenv("API_SECRET_KEY"))
auth.set_access_token(os.getenv("ACCESS_TOKEN"), os.getenv("ACCESS_TOKEN_SECRET"))
api = tweepy.API(auth)

tweets_list = []
streams = []

# model = tf.keras.models.load_model('./covid19_Model_main.model')

# def getsentiment(tweet):
#     cleaned = Clean_tweets(tweet)
#     onehot_repr = [one_hot(cleaned, 5000)]
#     embedded_docs = pad_sequences(onehot_repr, padding='pre', maxlen=50)
#     result = model.predict(embedded_docs)
#     return result

def getsentimentusingtextbolb(tweet):
    sentiment = TextBlob(Clean_tweets(tweet)).sentiment
    return sentiment

def Clean_tweets(tweet):

    p = re.compile(r"\<http.+?\>", re.DOTALL)

    tweet_cleaned = re.sub("http[s]?://\S+", "", tweet)
    tweet_cleaned = re.sub("[^a-zA-Z]", " ", tweet_cleaned)
    tweet_cleaned = re.sub(p, "", tweet_cleaned)
    tweet_cleaned = tweet_cleaned.lower()
    tweet_cleaned = tweet_cleaned.split()
    ps = PorterStemmer()
    all_stopwords = stopwords.words("english")
    tweets_cleaned = [ps.stem(word)for word in tweet_cleaned if not word in set(all_stopwords)]
    tweet_cleaned = " ".join(tweets_cleaned)

    return tweet_cleaned


def getusertweet(username):
    track = []
    user_tweets = []
    for status in tweepy.Cursor(
        api.user_timeline,
        screen_name=username,
        tweet_mode="extended",
        lang="en",
        include_rts=False,
    ).items():
        if len(user_tweets) <= 10:
            lower = status.full_text.lower()
            tweet = {
                        "name": status.user.screen_name,
                        "user_id":status.user.id_str,
                        "tweet_id":status.id_str,
                        "text": status.full_text,
                        "location": status.user.location,
                        "created_at":str(status.created_at),
                        "profileimage":status.user.profile_image_url,
                    }
            sentiment = getsentimentusingtextbolb(tweet['text'])
            tweet['Polarity'] = round(sentiment[0],2)
            tweet['Subjectivity'] = round(sentiment[1],2)
            if (sentiment[0] >= 0):
                tweet['Sentiment'] = 'Positive'
            else:
                tweet['Sentiment'] = 'Negative'


            user_tweets.append(tweet)
        else:
            break
    return user_tweets


class TwitterStream(tweepy.StreamListener):
    def __init__(self, api=None):
        super(TwitterStream, self).__init__()
        self.timer_tweets = 0
        self.tweet_send = 0
        self.sno = 0

    def on_connect(self):
        # Function called to connect to the Twitter Stream
        print("You are now connected to the Twitter streaming API.")

    def on_error(self, status_code):
        # Function displays the error or status code
        print("An Error has occured: " + repr(status_code))
        return False

    def on_status(
        self,
        status,
    ):

        # Function connects to the defined MongoDB and stores the filtered tweets
        if "RT @" not in status.text and status.lang == "en":
            if hasattr(status, "extended_tweet"):
                self.timer_tweets += 1
                tweet_detail = {
                    "sno" : self.sno,
                    "tweet_id" : status.id_str,
                    "user_id" : status.user.id_str,
                    "name": status.user.screen_name,
                    "text": status.extended_tweet["full_text"],
                    "location": status.user.location,
                    "created_at":str(status.created_at),
                    "profileimage":status.user.profile_image_url,
                }
                sentiment = getsentimentusingtextbolb(tweet_detail['text'])
                tweet_detail['polarity'] = round(sentiment[0],2)
                tweet_detail['subjectivity'] = round(sentiment[1],2)
                if (sentiment[0] >= 0):
                    tweet_detail['Sentiment'] = 'Positive'
                else:
                    tweet_detail['Sentiment'] = 'Negative'
                self.tweet_send +=1
                if(self.timer_tweets>5):
                    socketio.emit('tweet_stream', tweet_detail, namespace='/', )
                    self.timer_tweets=0
                    self.sno +=1

# track=['covid', 'corona', 'covid19', 'coronavirus', 'facemask', 'sanitizer', 'social-distancing']


@app.route('/')
def gettweets():

    listener = TwitterStream()
    streamer = tweepy.Stream(auth=auth, listener=listener, tweet_mode='extended')
    streams.append(streamer)
    streamer.filter(track=['covid', 'corona', 'covid19', 'coronavirus', 'facemask', 'sanitizer', 'social-distancing'])

    @socketio.on('client_disconnecting')
    def disconnect_details(data):
        print("stopping")
        streamer.disconnect()

    return jsonify(' STREAM started !!')


@app.route("/get_user/<user>", methods=["GET"])
def getuserdata(user):
        tweets = getusertweet(user)
        print(  tweets)
        return jsonify(tweets)



if __name__ == "__main__":

    socketio.run(app , debug= True)
