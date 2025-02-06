import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../contextAPI/SearchProvider";
import SongTracks from "./SongTracks";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Playlist = ({ token, playlistId }) => {
    const [songs, setSongs] = useState([]);
    const [playlistInfo, setPlaylistInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { setSelectedAlbum } = useContext(SearchContext);

    const formatDuration = (duration) => {
        if (!Number.isFinite(duration) || duration < 0) return "00:00";
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        if (!playlistId || !token) return;

        const fetchPlaylist = async () => {
            setLoading(true);
            setError(null);
            try {
                const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!playlistResponse.ok) throw new Error("Failed to fetch playlist");

                const playlistData = await playlistResponse.json();
                const formattedPlaylist = {
                    id: playlistData.id,
                    name: playlistData.name,
                    description: playlistData.description,
                    image: playlistData.images[0]?.url || "https://via.placeholder.com/150",
                    owner: playlistData.owner.display_name,
                    createdAt: new Date(playlistData.created_at).toLocaleDateString(),
                    tracks: playlistData.tracks.items.map((item) => ({
                        id: item.track.id,
                        title: item.track.name,
                        artist: item.track.artists.map((a) => a.name).join(", "),
                        album: item.track.album.name,
                        cover: item.track.album.images[0]?.url || "https://via.placeholder.com/150",
                        uri: item.track.uri,
                        addedAt: new Date(item.added_at).toLocaleDateString(),
                        duration: formatDuration(item.track.duration_ms),
                    })),
                };

                setPlaylistInfo(formattedPlaylist);
                setSongs(formattedPlaylist.tracks);
            } catch (error) {
                setError("Failed to load playlist");
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylist();
    }, [playlistId, token]);

    const handlePlayClick = () => {
        setSelectedAlbum(playlistInfo);
        navigate("/album");
    };

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex flex-col items-center mb-8">
                {playlistInfo.image && (
                    <img src={playlistInfo.image} alt="Playlist" className="w-40 h-40 rounded-lg shadow-lg" />
                )}
                {playlistInfo.name && <h2 className="text-3xl font-bold text-white mt-4">{playlistInfo.name}</h2>}
                {playlistInfo.description && (
                    <p className="text-sm text-gray-400">{playlistInfo.description}</p>
                )}
                {playlistInfo.createdAt && (
                    <p className="text-xs text-gray-500 mt-2">생성일: {playlistInfo.createdAt}</p>
                )}
                {playlistInfo.owner && <p className="text-xs text-gray-500 mt-2">작성자: {playlistInfo.owner}</p>}

                <button
                    onClick={handlePlayClick}
                    className="mt-4 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition duration-200"
                >
                    <i className="fas fa-play mr-2"></i>재생
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="w-8 h-8 border-4 border-t-4 border-gray-300 rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <p className="text-red-500 font-semibold">{error}</p>
            ) : songs.length === 0 ? (
                <p className="text-gray-400">플레이리스트에 트랙이 없습니다.</p>
            ) : (
                <Swiper
                    slidesPerView={4}
                    spaceBetween={30}
                    freeMode={true}
                    pagination={{ clickable: true }}
                    modules={[FreeMode, Pagination]}
                    className="swiper"
                >
                    {songs.map((song) => (
                        <SwiperSlide key={song.id}>
                            <div className="card">
                                <Link to="" className="thumb">
                                    <img src={song.cover} alt={song.title} />
                                </Link>
                                <div className="text">
                                    <Link to="" className="tit">{song.title}</Link>
                                    <p className="txt">{song.artist}</p>
                                    <p className="txt">{song.duration}</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
};

export default Playlist;

