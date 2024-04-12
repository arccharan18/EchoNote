import "./Home.scss";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import SquareList from "../../UI/SquareList";
import { useEffect, useState } from "react";

const Home = () => {
  const { id, followedArtists, likedPlaylists } = useSelector(
    (state) => state.user.data
  );
  const [spotifySongs, setSpotifySongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpotifySongs = async () => {
      try {
        // Authorization token that must have been created previously. See: https://developer.spotify.com/documentation/web-api/concepts/authorization
        const token = 'BQBYm3rbHNdPZlToUgGLTA-ruhgML4L5GeuMNj2w4NTYHl7proaD86NKGzLcNGjRKyuoamF4_t2gABI9IeyJv8r5yjrV4xamKCDavcXEFhSZHb2Yj9RnJG5mUjgKDDCy35Ig5m8t2WjnecuM-D8CnuDDQASgP8FPBSMqhej5ZJicIEVNpc0FfqqRNyt7K-O_lMylYvv6hcPmuQiWB5ht7JMo1vEZoikCDyEZM4-EDL4AZqGJjm24qZlgqnXDrHxkCQpdkNrLsXAnYsPW9-wijxrA';
        
        // Track IDs to fetch
        const trackIds = "13ZISM2bmrMBCRlMzl669x,7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ,2takcwOaAZWiXQijPHIx7B";
        
        // Fetch tracks from Spotify API
        const response = await fetch(`https://api.spotify.com/v1/tracks?ids=${trackIds}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data from Spotify API. Status: ${response.status}`);
        }

        const data = await response.json();

        console.log("Spotify Songs:", data); // Check response data

        if (data && data.tracks) {
          // Extract tracks from response data
          const tracks = data.tracks.map(track => ({
            id: track.id,
            name: track.name,
            img: track.album.images[0].url, // Assuming the first image is the cover image
          }));
          setSpotifySongs(tracks);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching songs:", error);
        setLoading(false);
        toast.error("Failed to fetch songs from Spotify. Please try again.");
      }
    };

    fetchSpotifySongs();
  }, []);

  return (
    id && (
      <>
        <div className="home__img" />
        <div className="home">
          <h1 className="h1" onClick={() => toast.success("Wow crazy")}>
            Good evening, wanna listen some music !?
          </h1>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <h2 className="h2">Spotify Songs</h2>
              <SquareList list={spotifySongs} type={"song"} />

              {followedArtists.length > 0 && (
                <>
                  <h2 className="h2">Your favourite artists</h2>
                  <SquareList
                    list={followedArtists.slice(0, 5)}
                    type="artist"
                  />
                </>
              )}

              {likedPlaylists.length > 0 && (
                <>
                  <h2 className="h2">Your favourite playlists</h2>
                  <SquareList
                    list={likedPlaylists.slice(0, 5)}
                    type="playlist"
                  />
                </>
              )}
            </>
          )}
        </div>
      </>
    )
  );
};

export default Home;
