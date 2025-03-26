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
    const [guessedSong, setGuessedSong] = useState<Song | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [totalPoints, setTotalPoints] = useState(0);

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

    // Funktion som kollar om gissningen är rätt
    function checkGuess(guessedSong: Song) {
        // Spara vilken låt användaren gissade på
        setGuessedSong(guessedSong);

        // Om det finns en låt som spelas
        if (playingSong !== null) {
            // Om användaren gissade på rätt låt
            if (guessedSong.id === playingSong.id) {
                setIsCorrect(true);
                setShowAnswer(true);
                setTotalPoints(totalPoints + 1);
            } 
            // Om användaren gissade fel
            else {
                setIsCorrect(false);
                setShowAnswer(true);
            }
        }
    }

    // Funktion för att starta om spelet
    function startNewGame() {
        // Blanda om låtarna och välj 4 nya
        const newRandomSongs = songs.sort(() => Math.random() - 0.5).slice(0, 4);
        setSelectedSongs(newRandomSongs);
        // Sätt första låten som den som ska spelas
        setPlayingSong(newRandomSongs[0]);
        // Återställ alla states
        setGuessedSong(null);
        setIsCorrect(null);
        setShowAnswer(false);
    }

    if (loading) {
        return <div>Laddar låtar...</div>;
    }

    const videoId = playingSong?.youtube_url ? getYouTubeVideoId(playingSong.youtube_url) : null;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Gissa låten!</h2>
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
                {selectedSongs.map((song) => {
                    let backgroundColor = "bg-gray-100";
                    
                    // Om vi visar svaret och detta är låten som spelades
                    if (showAnswer && song.id === playingSong?.id) {
                        backgroundColor = "bg-green-200";
                    }
                    
                    // Om detta är låten användaren gissade på
                    if (showAnswer && song.id === guessedSong?.id) {
                        // Om gissningen var fel
                        if (!isCorrect) {
                            backgroundColor = "bg-red-200";
                        }
                    }

                    return (
                        <li 
                            key={song.id} 
                            className={`p-2 ${backgroundColor} rounded cursor-pointer hover:bg-gray-200`}
                            onClick={() => {
                                // Om vi inte redan har gissat
                                if (!showAnswer) {
                                    checkGuess(song);
                                }
                            }}
                        >
                            {song.title} - {song.artist}
                        </li>
                    );
                })}
            </ul>

            {/* Visa feedback efter gissning */}
            {showAnswer && (
                <div className="mt-4">
                    {isCorrect ? (
                        <div className="text-green-600 font-bold">Rätt svar! 🎉</div>
                    ) : (
                        <div className="text-red-600 font-bold">
                            Fel svar! Det var {playingSong?.title} - {playingSong?.artist} 😢
                        </div>
                    )}
                    <button 
                        onClick={startNewGame}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Spela igen
                    </button>
                </div>
            )}
        </div>
    );
}
