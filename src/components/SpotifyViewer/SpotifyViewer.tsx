import { useStore } from '../../state/storeHooks';
import { useEffect } from 'react';
import { setToken } from './SpotifyViewer.slice';
import { useLocation } from 'react-router-dom';
import { store } from '../../state/store';
import SpotifyIconSvg from './SpotifyIcon';
import SpotifyGrid from '../Pages/SpotifyGrid/SpotifyGrid';
import axios from 'axios';

const CLIENT_ID = 'YOUR-CLIENT-ID-HERE';
const REDIRECT_URI = 'http://localhost:3000/';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const PERMISSIONS = 'user-read-recently-played user-read-currently-playing'
const RESPONSE_TYPE = 'token';

export function SpotifyViewer({
  toggleClassName,
  tabs,
  selectedTab,
  onPageChange,
  onTabChange,
}: {
  toggleClassName: string;
  tabs: string[];
  selectedTab: string;
  onPageChange?: (index: number) => void;
  onTabChange?: (tab: string) => void;
}) {
  const { token } = useStore(({ spotifyUser }) => spotifyUser);

  const getTokenFromLocationHash = (): string | null => {
    const hash = window.location.hash;
    let result = null;
    if (hash) {
      var access_token = hash
        .substring(1)
        .split('&')
        .find((elem) => elem.includes('access_token'));
      result = access_token?.split('=')[1];
    }
    if (result == undefined) {
      return null;
    } else {
      return result;
    }
  };

  const spotifyApi = axios.create({
    baseURL: "https://api.spotify.com/"
  })
  spotifyApi.interceptors.request.use((request) => {
    const token = window.sessionStorage.getItem('spotifyToken');
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  });

  useEffect(() => {
    const hash = window.location.hash;
    let full_token = window.sessionStorage.getItem('spotifyToken');

    if (!full_token && hash) {
      full_token = getTokenFromLocationHash();
      window.location.hash = '';
      if (full_token) {
        window.sessionStorage.setItem('spotifyToken', full_token);
      }
    }
    store.dispatch(setToken(full_token));
  }, []);

  const redirect = () => {
    let url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${PERMISSIONS}`
    window.location.replace(url);
  };

  return (
    <div className='d-grid gap-2 col-6 mx-auto'>
      {!token ? (
        <div className='col-md-12 center-text'>
          <div className='col-md-12 center-text'>
            <h1 className='text-xs-center'>Connect your Spotify account</h1>
          </div>
          <p>&nbsp;</p>
          <div className='col-md-12 text-xs-center'>
            <button onClick={redirect} className='btn btn-lg btn-primary'>
              <SpotifyIconSvg></SpotifyIconSvg>
              <p>&nbsp; Let me in!</p>
            </button>
          </div>
        </div>
      ) : (
        <SpotifyGrid api={spotifyApi}></SpotifyGrid>
      )}
    </div>
  );
}
