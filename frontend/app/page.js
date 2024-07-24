"use client";
import Head from 'next/head';
import Image from "next/image";
import { useGetSongsQuery, useGetSongStatisticsQuery, useGetSongQuery, useCreateSongMutation, useDeleteSongMutation } from "./api/apiSlice";
import './globals.css';
import SongDialog from "./dialog/SongDialog";
import { useState, useEffect } from "react";

export default function Home() {
    const { data, isLoading: loadingSongs } = useGetSongsQuery();
    const { data: stats, isLoading: loadingStats } = useGetSongStatisticsQuery();
    const [createSong, { isLoading: creatingSong }] = useCreateSongMutation();
    const [deleteSong] = useDeleteSongMutation();

    const [songDetails, setSongDetails] = useState({ title: '', artist: '', album: '', genre: '' });
    const [selectedSongId, setSelectedSongId] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState('');
    const { data: selectedSong, isLoading: loadingSelectedSong } = useGetSongQuery(selectedSongId, { skip: !selectedSongId });

    const handleOpenDialog = (id) => {
        setSelectedSongId(id);
    };
    
    const handleCloseDialog = () => {
        setSelectedSongId(null);
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSongDetails({ ...songDetails, [name]: value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (songDetails.title && songDetails.artist && songDetails.album && songDetails.genre) {
            await createSong(songDetails).unwrap();
            setSongDetails({ title: '', artist: '', album: '', genre: '' });
        }
    };
    
    const handleDeleteSong = async (id) => {
        try {
            await deleteSong(id).unwrap();
        } catch (error) {
            console.error("Failed to delete song: ", error);
        }
    };

    // Create a unique list of genres for filtering
    const uniqueGenres = Array.from(new Set(data?.map(song => song.genre))).sort();

    // Filter songs based on the selected genre
    const filteredSongs = selectedGenre ? data?.filter(song => song.genre === selectedGenre) : data;

    if (loadingSongs || loadingStats || creatingSong) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-800 to-gray-900">
                        <Image
                        src="/bg-img.jpg"
                        alt="Responsive image"
                        layout="responsive" // Makes the image responsive
                        width={700} // Aspect ratio maintained
                        height={475} // Aspect ratio maintained
                        />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 bg-gray-900 text-white">
            <h1 className="text-4xl font-bold text-center mb-8">Songs List</h1>

            {/* Filter Section */}
            <div className="mb-4">
                <label htmlFor="genre" className="block text-lg font-semibold mb-2">Filter by Genre:</label>
                <select 
                    id="genre" 
                    value={selectedGenre} 
                    onChange={(e) => setSelectedGenre(e.target.value)} 
                    className="p-2 rounded bg-gray-600 text-white"
                >
                    <option value="">All Genres</option>
                    {uniqueGenres.map((genre) => (
                        <option key={genre} value={genre}>
                            {genre}
                        </option>
                    ))}
                </select>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="mb-8 bg-gradient-to-r from-gray-700 to-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center mb-4">Add New Song</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input name="title" value={songDetails.title} onChange={handleInputChange} placeholder="Title" className="p-2 rounded bg-gray-600 text-white" required />
                    <input name="artist" value={songDetails.artist} onChange={handleInputChange} placeholder="Artist" className="p-2 rounded bg-gray-600 text-white" required />
                    <input name="album" value={songDetails.album} onChange={handleInputChange} placeholder="Album" className="p-2 rounded bg-gray-600 text-white" required />
                    <input name="genre" value={songDetails.genre} onChange={handleInputChange} placeholder="Genre" className="p-2 rounded bg-gray-600 text-white" required />
                </div>
                <button type="submit" className="mt-4 w-full md:w-60 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300">
                    Add Song
                </button>
            </form>

            {/* Statistics Section */}
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-3xl font-bold text-center mb-4">Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-600 p-4 rounded-lg shadow text-center hover:bg-gray-500 transition duration-300">
                        <h3 className="text-2xl font-semibold">{stats.totalSongs}</h3>
                        <p>Total Songs</p>
                    </div>
                    <div className="bg-gray-600 p-4 rounded-lg shadow text-center hover:bg-gray-500 transition duration-300">
                        <h3 className="text-2xl font-semibold">{stats.totalArtists}</h3>
                        <p>Total Artists</p>
                    </div>
                    <div className="bg-gray-600 p-4 rounded-lg shadow text-center hover:bg-gray-500 transition duration-300">
                        <h3 className="text-2xl font-semibold">{stats.totalAlbums}</h3>
                        <p>Total Albums</p>
                    </div>
                    <div className="bg-gray-600 p-4 rounded-lg shadow text-center hover:bg-gray-500 transition duration-300">
                        <h3 className="text-2xl font-semibold">{stats.totalGenres}</h3>
                        <p>Total Genres</p>
                    </div>
                </div>
            </div>

            {/* Songs List Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
                {filteredSongs.map((song) => (
                    <div 
                        key={song._id} 
                        className="relative cursor-pointer bg-gradient-to-br from-gray-700 to-gray-800 shadow-lg rounded-lg p-4 flex flex-col hover:bg-gray-600 transition duration-300"
                    >
                        <button 
                            onClick={() => handleDeleteSong(song._id)} 
                            className="absolute top-2 right-2 text-red-600 hover:text-red-800 transition duration-300"
                            aria-label={`Delete ${song.title}`}
                        >
                            <span className="text-lg">❌</span>
                        </button>
                        <div className="mt-4" onClick={() => handleOpenDialog(song._id)}>
                            <h2 className="text-2xl font-semibold">{song.title}</h2>
                            <p>{song.artist}</p>
                            <p>{song.genre}</p>
                            <p className="italic">{song.album}</p>
                        </div>
                    </div>
                ))}
            </div>
            {selectedSongId && <SongDialog song={selectedSong} onClose={handleCloseDialog} />}
        </div>
    );
}
