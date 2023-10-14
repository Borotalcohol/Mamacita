import os
import re
import json
import codecs
import requests
import pandas as pd
import matplotlib.pyplot as plt
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import firebase_admin

from firebase_admin import initialize_app, credentials, firestore

cred = credentials.Certificate("./mamacita-688a2-aa975aa04e22.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

PLAYLIST_IDS = [
    '37i9dQZEVXbMDoHDwVN2tF', # Global 50
    '37i9dQZEVXbIQnj7RRhdSX', # Italy 50
    '37i9dQZEVXbNFJfN1Vw8d9', # Spain 50
    '37i9dQZEVXbIPWwFssbupI', # France 50
    '37i9dQZEVXbJiZcmkrIHGU', # Germany 50
    '37i9dQZEVXbKyJS56d1pgi', # Portogallo 50
    '37i9dQZEVXbJqdarpmTJDL', # Grecia 50
    '37i9dQZEVXbKkidEfWYRuD', # Ucraina 50
    '37i9dQZEVXbLnolsZ8PSNw', # Regno Unito 50
    '37i9dQZEVXbIVYVBNw9D5K', # Turchia 50
    '37i9dQZEVXbJvfa0Yxg7E7', # Norvegia 50
    '37i9dQZEVXbLoATJ81JYXz', # Svezia 50
    '37i9dQZEVXbMxcczTSoGwZ', # Finlandia 50
    '37i9dQZEVXbL3J0k32lWnN', # Denmark 50
    '37i9dQZEVXbJNSeeHswcKB', # Belgio 50
    '37i9dQZEVXbKNHh6NIXu36', # Austria 50
    '37i9dQZEVXbKCF6dqVpDkS', # Paesi Bassi 50
    '37i9dQZEVXbJiyhoAPEfMK', # Svizzera 50
    '37i9dQZEVXbN6itCcaL3Tt', # Polonia 50
    '37i9dQZEVXbJWuzDrTxbKS', # Lettonia 50
    '37i9dQZEVXbLesry2Qw2xS', # Estonia 50
    '37i9dQZEVXbMx56Rdq5lwc', # Lituania 50
    '37i9dQZEVXbIP3c3fqVrJY', # Repubblica Ceca 50
    '37i9dQZEVXbKM896FDX8L1', # Irlanda 50
    '37i9dQZEVXbNZbJ6TZelCq', # Romania 50
    '37i9dQZEVXbNfM2w2mq1B8', # Bulgaria 50
    '37i9dQZEVXbKGcyg6TFGx6', # Lussemburgo 50
    '37i9dQZEVXbNHwMxAkvmF8', # Ungheria 50
    '37i9dQZEVXbKIVTPX9a2Sb', # Slovacchia 50
    '37i9dQZEVXbKMzVsSGQ49S', # Islanda 50
    ]

def get_spotify_access_token():
    CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
    CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')
    URL = 'https://accounts.spotify.com/api/token/'
    DATA = {'grant_type': 'client_credentials', 'client_id': CLIENT_ID, 'client_secret': CLIENT_SECRET}
    HEADERS = {'Content-Type': 'application/x-www-form-urlencoded'}

    r = requests.post(url=URL, data=DATA, headers=HEADERS)

    if r.status_code == 200:
        data = r.json()
        print(data)
        return data

    return None

def get_genius_access_token():
    CLIENT_ID = os.getenv('GENIUS_CLIENT_ID')
    CLIENT_SECRET = os.getenv('GENIUS_CLIENT_SECRET')
    URL = 'https://api.genius.com/oauth/token'
    DATA = {
        'grant_type': 'client_credentials', 
        'client_id': CLIENT_ID, 
        'client_secret': CLIENT_SECRET, 
        'response_type': 'code'
    }

    r = requests.post(url=URL, data=DATA)

    if r.status_code == 200:
        data = r.json()
        print(data)
        return data
    
    return None

def get_playlist_info(playlist_id, access_token):
    URL = f'https://api.spotify.com/v1/playlists/{playlist_id}'
    HEADERS = {'Authorization': f'Bearer {access_token}'}
    r = requests.get(url=URL, headers=HEADERS)

    if r.status_code == 200:
        data = r.json()

        info = {
            'name': data['name'],
            'coverURL': data['images'][0]['url'],
            'URL': data['external_urls']['spotify'],
        }

        return info

    return None

def get_playlist_tracks(playlist_id, access_token):
    URL = f'https://api.spotify.com/v1/playlists/{playlist_id}/tracks'
    HEADERS = {'Authorization': f'Bearer {access_token}'}
    r = requests.get(url=URL, headers=HEADERS)

    if r.status_code == 200:
        data = r.json()['items']
        track_names = list(map(lambda track: f'{track["track"]["name"]} {track["track"]["artists"][0]["name"]}', data))

        return track_names

    return None

def get_song_lyrics_url(song_name, access_token):
    URL = f'https://api.genius.com/search?q={song_name}'
    HEADERS = {'Authorization': f'Bearer {access_token}'}
    r = requests.get(url=URL, headers=HEADERS)

    if r.status_code == 200:
        data = r.json()

        if len(data['response']['hits']) == 0: return None
        
        url = data['response']['hits'][0]['result']['url']

        if url.split('-')[-1] != 'lyrics': return None

        print(url)

        return url

    return None

def get_song_lyrics(url):
    page = requests.get(url=url)

    if page.status_code == 200:
        soup = BeautifulSoup(page.content, "html.parser")

        divs_with_lyrics = soup.find_all('div', attrs={'data-lyrics-container': 'true'})
        pattern = re.compile(r'\[.*?\]')
        lyrics = ""

        for div in divs_with_lyrics:
            text = div.get_text(separator=' ')
            text = re.sub(pattern, '', text).lower()
            text = codecs.decode(text.encode(), 'utf-8')
            text = ''.join([char if char.isalpha() or char.isspace() or char == "'" else ' ' for char in text])
            text = re.sub(r'\s+', ' ', text)

            lyrics += text
        
        lyrics = lyrics.replace('\n', ' ')

        return lyrics
    return None

def get_word_count(track_names, genius_access_token):
    track_lyrics = []

    for track_name in track_names:
        song_lyrics_url = get_song_lyrics_url(track_name, genius_access_token)

        if song_lyrics_url:
            lyrics = get_song_lyrics(song_lyrics_url)
            track_lyrics.append(lyrics)
            pass
        else:
            print('No song lyrics url found')

    all_lyrics = ' '.join(track_lyrics)

    words_count = {}

    for word in all_lyrics.split():
        if word not in words_count:
            words_count[word] = 1
        else:
            words_count[word] += 1
    
    words_count = {k: v for k, v in sorted(words_count.items(), key=lambda item: item[1], reverse=True)}
    words_count = dict(list(words_count.items())[:300])

    return words_count

def main():
    spotify_token = get_spotify_access_token()
    genius_token = get_genius_access_token()

    if spotify_token and genius_token:
        spotify_access_token = spotify_token['access_token']
        genius_access_token = genius_token['access_token']

        for idx, playlist_id in enumerate(PLAYLIST_IDS):
            print("PROCESSING PLAYLIST ", idx, " OF ", len(PLAYLIST_IDS))

            track_names = get_playlist_tracks(playlist_id, spotify_access_token)
            playlist_info = get_playlist_info(playlist_id, spotify_access_token)
            
            words_count = get_word_count(track_names, genius_access_token)

            data = {
                'name': playlist_info['name'],
                'coverURL': playlist_info['coverURL'],
                'URL': playlist_info['URL'],
                'words_count': words_count,
            }

            db.collection("playlists").document(playlist_id).set(data)

            # Add data to firestore database
            with open(f'{playlist_id}.json', 'w', encoding='utf-8') as fp:
                json.dump(data, fp, ensure_ascii=False, indent=4)
        

    else:
        print('No token found')

if __name__ == '__main__':
    load_dotenv()
    main()