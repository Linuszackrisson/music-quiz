'use client'


import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
interface Song {
    id: number;
    title: string;
    artist: string;
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

    useEffect(() => {
        async function loadSongs() {
            const songData = await getAllSongs();
            setSongs(songData);
            setLoading(false);
        }
        loadSongs();
    }, []);

    if (loading) {
        return <div>Laddar låtar...</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Låtlista</h2>
            <ul className="space-y-2">
                {songs.map((song) => (
                    <li key={song.id} className="p-2 bg-gray-100 rounded">
                        {song.title} - {song.artist}
                    </li>
                ))}
            </ul>
        </div>
    );
}
