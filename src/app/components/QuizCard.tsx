'use client'

import YouTube from 'react-youtube';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

interface Song {
    id: number;
    title: string;
    artist: string;
    youtube_url: string;
}

function getYouTubeVideoId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export async function getAllSongs(): Promise<Song[]> {
    const { data: songs, error } = await supabase
        .from('songs')
        .select('*');

    if (error) {
        console.error('Error fetching songs:', error);
        return [];
    }
    
    return songs || [];
}

export default function QuizCard() {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
    const [playingSong, setPlayingSong] = useState<Song | null>(null);

    useEffect(() => {
        async function loadSongs() {
            const songData = await getAllSongs();
            setSongs(songData);
            
            
            const randomSongs = songData.sort(() => Math.random() - 0.5).slice(0, 4);
            setSelectedSongs(randomSongs);
            setPlayingSong(randomSongs[0]); 
            setLoading(false);
        }
        loadSongs();
    }, []);

    if (loading) {
        return <div>Laddar låtar...</div>;
    }

    const videoId = playingSong?.youtube_url ? getYouTubeVideoId(playingSong.youtube_url) : null;

    

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Låtlista</h2>
            {playingSong && videoId && (
                <div className="mb-4">
                    <YouTube
                        videoId={videoId}
                        opts={{
                            height: '240',
                            width: '100%',
                            playerVars: {
                                autoplay: 1,
                            },
                        }}
                    />
                </div>
            )}
            <ul className="space-y-2">
                {selectedSongs.map((song) => (
                    <li key={song.id} className="p-2 bg-gray-100 rounded">
                        {song.title} - {song.artist}
                    </li>
                ))}
            </ul>
        </div>
    );
}
