// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


const SpotifyGrid = ({api}: any) => {
  const [recentlyPlayedTracks, setrecentlyPlayedTracks] = useState([])
  const [nowPlaying, setNowPlaying] = useState(null)
  const timerIdRef = useRef(null);
  
  const styles = {
    carouselItem: {
      textAlign: 'center',
    },
    albumCover: {
      width: '90%',
      height: '90%',
      objectFit: 'cover',
      margin: '10px auto',
    },
    info: {
      marginTop: '20px',
    },
    time: {
      textAlign: 'center',
      fontSize: '20px',
    },
    trackTitle: {
      fontSize: '38px',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    artistName: {
      fontSize: '28px',
      color: '#888',
      textAlign: 'center',
    },
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
  };

  const parseDateTime = ((dateTime) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'America/Sao_Paulo', // Set the desired time zone
    }).format(new Date(dateTime));
  })

  useEffect(() => {
    const pollingCallback = () => {
      api.get("https://api.spotify.com/v1/me/player/recently-played/").then(data => {
        setrecentlyPlayedTracks(data.data.items)
      })
      api.get("https://api.spotify.com/v1/me/player/currently-playing/").then(data => {
        if (data.data) {
          setNowPlaying(data.data.item)
        }
      })
    };
    const startPolling = () => {
      // pollingCallback(); // To immediately start fetching data
      // Polling every 5 second
      timerIdRef.current = setInterval(pollingCallback, 5000);
    };
    startPolling()
  }, []);

  return (
     <Slider {...settings}>
        {/* (nowPlaying ? (
          <div key={0} style={styles.carouselItem}>
            <div style={styles.time}>Playing now</div>
            <img src={nowPlaying?.item?.album?.images[0].url} alt="Album Cover" style={styles.albumCover} />
            <div style={styles.info}>
              <div style={styles.trackTitle}>{nowPlaying?.item?.name}</div>
              <div style={styles.artistName}>{nowPlaying?.item?.artists[0].name}</div>
            </div>
          </div>
          ) : ()
        ) */}
        {recentlyPlayedTracks.map((item, index) => (
          <div key={index} style={styles.carouselItem}>
            <div style={styles.time}>{parseDateTime(item.played_at)}</div>
            <img src={item.track.album.images[0].url} alt="Album Cover" style={styles.albumCover} />
            <div style={styles.info}>
              <div style={styles.trackTitle}>{item.track.name}</div>
              <div style={styles.artistName}>{item.track.artists[0].name}</div>
            </div>
          </div>
        ))}
      </Slider>
  );
};

export default SpotifyGrid;