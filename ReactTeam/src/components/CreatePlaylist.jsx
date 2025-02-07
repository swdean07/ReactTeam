import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreatePlaylist = ({ authorization, user_id, playlistName }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (playlistName.trim()) {
            createPlaylist();
        }
    }, [playlistName]); // ✅ playlistName이 변경될 때마다 실행

    const createPlaylist = async () => {
        if (!playlistName.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `https://api.spotify.com/v1/users/${user_id}/playlists`,
                { name: playlistName, public: false },
                { headers: { Authorization: authorization, 'Content-Type': 'application/json' } }
            );
            console.log('✅ 플레이리스트 생성 성공:', response.data);
            alert(`플레이리스트 "${playlistName}"가 생성되었습니다.`);
        } catch (error) {
            console.error('❌ 플레이리스트 생성 실패:', error.response);
            setError(error.response?.data?.error?.message || '오류 발생');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {loading && <p>플레이리스트 생성 중...</p>}
            {error && <p style={{ color: 'red' }}>에러: {error}</p>}
        </div>
    );
};

export default CreatePlaylist;
