### Sample app to demonstrate OAuth authentication using Spotify API and axios in a React/Typescript environment.

## Video demonstration

https://github.com/danielorp/spotify-stats/assets/26673875/280bd7d4-299c-4583-92cb-0e0b041fe765


With this sample app I created I was able to demonstrate the basic flow to integrate an OAuth-protected API in React.

Let's go step by step:

## 1. Redirecting user to Spotify login page
Let's create a button that will redirect user to the Spotify authorization page:
```
<button onClick={window.location.replace(SPOTIFY_URL)}>
    Let me in!
</button>
```

### 1.1 SPOTIFY_URL and Scopes
The variable SPOTIFY_URL should follow the following pattern:

`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${PERMISSIONS}`

The variable `permissions` should be a space-separated string of required scopes to access a given resource in Spotify API. In my sample app we're using `user-read-recently-played user-read-currently-playing` because we want both recently played songs as well as the current one, if any.

More information is provided by Spotify in their Getting Started API section.

## 2. What to do now that Spotify has redirected us back to our page?
Now we're in a page that contains the token in its URL! Let's store it in this page's session storage.
```
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
```

This function might be handy as well:
```
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
```

## 2. Axios library
Now that we have a fresh new API token, let's create our spotifyApi instance and add the token to it in a permanent manner, so future calls using our spotifyApi object don't need to deal with this once again.
```
const spotifyApi = axios.create({
    baseURL: "https://api.spotify.com/"
})
```

Now one of the most important parts, adding the authorization token provided by Spotify (through their callback) to the axios interceptor:
```
spotifyApi.interceptors.request.use((request) => {
    const token = window.sessionStorage.getItem('spotifyToken');
    if (token) {
        request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
});
```
Now we should be ready to go, let's issue some Spotify API calls.

## 3. Retrieving song data
With this simple query we're able to get the user's current song being played and store it in a React state variable.
```
api.get("https://api.spotify.com/v1/me/player/currently-playing/").then(data => {
    if (data.data) {
        setNowPlaying(data.data.item)
    }
})
```
