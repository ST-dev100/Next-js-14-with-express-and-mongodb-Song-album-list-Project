"use client";

import Image from "next/image";
import { useGetSongsQuery, useGetSongStatisticsQuery, useGetSongQuery,useCreateSongMutation,useDeleteSongMutation} from "./api/apiSlice";
import './globals.css';
import SongDialog from "./dialog/SongDialog";
import { useState } from "react";

export default function Home() {
  const { data, isLoading: loadingSongs } = useGetSongsQuery();
  const { data: stats, isLoading: loadingStats } = useGetSongStatisticsQuery();
  const [createSong, { isLoading: creatingSong }] = useCreateSongMutation();
  const [deleteSong] = useDeleteSongMutation(); // Add delete mutation

  const [songDetails, setSongDetails] = useState({ title: '', artist: '', album: '', genre: '' });

  const [selectedSongId, setSelectedSongId] = useState(null);
  const { data: selectedSong, isLoading: loadingSelectedSong } = useGetSongQuery(selectedSongId, { skip: !selectedSongId });

  const handleOpenDialog = (id) => {
    setSelectedSongId(id);
  };

  const handleCloseDialog = () => {
    console.log("hi")
    setSelectedSongId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSongDetails({ ...songDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (songDetails.title && songDetails.artist && songDetails.album && songDetails.genre) {
      await createSong(songDetails).unwrap(); // Perform the create operation
      setSongDetails({ title: '', artist: '', album: '', genre: '' }); // Reset form
    }
  };

  const handleDeleteSong = async (id) => {
    try {
      await deleteSong(id).unwrap();
    } catch (error) {
      console.error("Failed to delete song: ", error);
    }
  };

  if (loadingSongs || loadingStats || creatingSong) {
    return <h1 className="text-center text-2xl">Loading...</h1>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-600">Songs List</h1>
            {/* Form Section */}
      <form onSubmit={handleSubmit} className="mb-8 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-4 text-white">Add New Song</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="title" value={songDetails.title} onChange={handleInputChange} placeholder="Title" className="p-2 rounded" required />
          <input name="artist" value={songDetails.artist} onChange={handleInputChange} placeholder="Artist" className="p-2 rounded" required />
          <input name="album" value={songDetails.album} onChange={handleInputChange} placeholder="Album" className="p-2 rounded" required />
          <input name="genre" value={songDetails.genre} onChange={handleInputChange} placeholder="Genre" className="p-2 rounded" required />
        </div>
        <button type="submit" className="mt-4 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300">
          Add Song
        </button>
      </form>
      {/* Statistics Section */}
      <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-3xl font-bold text-center mb-4 text-white shadow-lg">Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow text-center hover:bg-purple-100 transition duration-300">
            <h3 className="text-2xl font-semibold text-red-600">{stats.totalSongs}</h3>
            <p className="text-gray-600">Total Songs</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center hover:bg-purple-100 transition duration-300">
            <h3 className="text-2xl font-semibold text-green-600">{stats.totalArtists}</h3>
            <p className="text-gray-600">Total Artists</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center hover:bg-purple-100 transition duration-300">
            <h3 className="text-2xl font-semibold text-blue-600">{stats.totalAlbums}</h3>
            <p className="text-gray-600">Total Albums</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center hover:bg-purple-100 transition duration-300">
            <h3 className="text-2xl font-semibold text-yellow-600">{stats.totalGenres}</h3>
            <p className="text-gray-600">Total Genres</p>
          </div>
        </div>
      </div>
      
      {/* Songs List Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
      {data.map((song) => (
          <div 
            key={song._id} 
            className="relative cursor-pointer bg-gradient-to-br from-green-200 to-blue-400 shadow-lg rounded-lg p-4 flex flex-col hover:shadow-2xl transition-shadow duration-300"
          >
            <button 
              onClick={() => handleDeleteSong(song._id)} 
              className="absolute top-2 right-2 text-red-600 hover:text-red-800 transition duration-300"
              aria-label={`Delete ${song.title}`}
            >
              <span className="text-lg">❌</span> {/* Red "X" for delete */}
            </button>
            <div className="mt-4" onClick={() => handleOpenDialog(song._id)}>
              <h2 className="text-2xl font-semibold text-white">{song.title}</h2>
              <p className="text-gray-500">{song.artist}</p>
              <p className="text-gray-400">{song.genre}</p>
              <p className="text-gray-400 italic">{song.album.name}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedSongId && <SongDialog song={selectedSong} onClose={handleCloseDialog} />}
    </div>
  );
}
