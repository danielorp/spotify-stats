import { useStore } from '../../state/storeHooks';
import { useEffect } from 'react';
import { setToken } from './SpotifyViewer.slice';
import { useLocation } from 'react-router-dom';
import { store } from '../../state/store';

const CLIENT_ID = '3ee9aaca4953461db4d4845af26ad31d';
const REDIRECT_URI = 'http://localhost:3000/';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
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
  const { loading, user, token } = useStore(({ spotifyUser }) => spotifyUser);

  const { search } = useLocation();

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

  useEffect(() => {
    const hash = window.location.hash;
    let full_token = window.sessionStorage.getItem('token');

    if (!full_token && hash) {
      full_token = getTokenFromLocationHash();
      window.location.hash = '';
      if (full_token) {
        window.sessionStorage.setItem('token', full_token);
      }
    }
    store.dispatch(setToken(full_token));
  }, []);

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Spotify React</h1>
        {!token ? (
          <a
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
          >
            Login to Spotify
          </a>
        ) : (
          "grid aqui"
        )}
      </header>
    </div>
  );
}
