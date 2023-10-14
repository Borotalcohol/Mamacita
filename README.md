# 🍑 Mamacita
A tiny summer project that transforms top 50 Spotify playlists' lyrics into captivating word clouds. Uncover the most sung words in a visually artistic way. Explore the unexpected and groove to the universal language of music. Live website available here: https://mamacita.christianloschiavo.com

![Look of the Website](resources/cover.png?raw=true "Test")

## 1. Technologies
This project was realized using **Typescript React** as frontend framework and **NextJs** and **Firebase** as backend.

## 2. How does it work?
I've used the `getStaticProps()` (executed only once when executing the command `firebase deploy --only hosting`) method of NextJS to do the following things:
- Initialize Firebase app and instantiate Firestore object
- Get the data of the playlists collection ordered alphabetically by name (Spotify URL, Cover image URL, Playlist Name, Dictionary of words count)
- Through the (get-pixels library)[https://www.npmjs.com/package/get-pixels], extract the hex codes of the colors of the playlist cover image
- Send the object containing the information of the playlists from firestore and the hex colors to React

In the React part I then used this object to instantiate a graphical Wordcloud (using this library: https://www.npmjs.com/package/@visx/wordcloud) that change colors according to the cover image of the playlist.

## 3. How is the data gathered?
The Python script used to gather data and upload it to Firestore is present in the folder `scripts`, in the file `main.py`.
I planned to deploy the script on a scheduled Firebase Cloud Function or to execute it from a Raspberry Pi with a cronjob, however right now neither of the two are active, but the script works in the following way:
- Hardcoded Spotify playlists IDs (taken from the URL of the web version of the app)
- Get the Access Token for the Spotify API
- Get the Access Token of the Genius API
- For each playlist ID:
  - Spotify API call to get the data of tracks contained in the playlist
  - For each track:
    - Genius API call to get the list of items resulting from a query containig the track title
    - Get the first item URL only if it ends for 'lyrics' (logic implemented to avoid taking items which didn't actually contained lyrics)
    - Use BeautifulSoup for web scraping to get the lyrics of the track given its URL
    - Update the word count dictionary
- Upload data to Firestore
