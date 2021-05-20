import tweepy
from flask import Flask, jsonify
import nltk, re
from flask_cors import CORS
from dotenv import load_dotenv
from flask_socketio import SocketIO
import os
from textblob import TextBlob
nltk.download("stopwords")
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer


app = Flask(__name__)
CORS(app)
socketio = SocketIO(app,cors_allowed_origins="*", logger=True, engineio_logger=True)

# APP_ROOT = os.path.join(os.path.dirname(__file__), "..")  # refers to application_top
# dotenv_path = os.path.join(APP_ROOT, ".env")
# load_dotenv(dotenv_path)

API_KEY="NrmHvUeDysnKRObAUkRkcDH6s"
API_SECRET_KEY="s0YqX5h3cxlHQgByP6u8qsyOdDbJW4lL0YnayJJDnBdvMfhrBx"
ACCESS_TOKEN="1246008382323998721-AWvGrsV2xIT6B7oEt3TqdFaySJW3Gi"
ACCESS_TOKEN_SECRET="fVH2TldMJLlLXbuSRhFCSQqPwQRHVnioEtinBo6Q2qXAS"

auth = tweepy.OAuthHandler(API_KEY, API_SECRET_KEY)
auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
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
    def __init__(self, api=None,):
        super(TwitterStream, self).__init__()
        self.timer_tweets = 0
        self.tweet_send = 0
        self.sno = 0
        self.stopstream = False

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
        if self.stopstream == False:
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
                    print(tweet_detail)
                    if(self.timer_tweets>5):
                        socketio.emit('tweet_stream', tweet_detail, namespace='/', )
                        self.timer_tweets=0
                        self.sno +=1

                    @socketio.on('disconnecting_me', namespace='/')
                    def disconnect_details(data):
                        self.stopstream = True
                        print(data)
                        return False
        else :
            print("Exiting the stream!!")
            return False

# track=['covid', 'corona', 'covid19', 'coronavirus', 'facemask', 'sanitizer', 'social-distancing']


@app.route('/stream')
def gettweets():
    listener = TwitterStream()
    streamer = tweepy.Stream(auth=auth, listener=listener, tweet_mode='extended')
    streams.append(streamer)
    streamer.filter(track=['covid', 'corona', 'covid19', 'coronavirus', 'facemask', 'sanitizer', 'social-distancing'] , is_async=True)
    return jsonify(' STREAM started !!')


@app.route("/get_user/<user>", methods=["GET"])
def getuserdata(user):
        tweets = getusertweet(user)
        print(tweets)
        return jsonify(tweets)


@app.route("/", )
def start():
        return "Welcome !"

if __name__ == "__main__":

    socketio.run(app)
