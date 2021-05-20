import axios from 'axios';

// export const url = 'http://127.0.0.1:5000';
export const url = 'https://twitter-covid-sentiments.herokuapp.com';
// export const url = 'https://covid19-twitter-analyzer.azurewebsites.net';

export const startStream = () => axios.get(`${url}/stream`);
export const getuserTweets = (username) =>
  axios.get(`${url}/get_user/${username}`);
