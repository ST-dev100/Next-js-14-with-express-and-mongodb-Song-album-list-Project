import React, { useState, useEffect } from 'react';
import { useUpdateSongMutation } from '../api/apiSlice';// Adjust the import based on your file structure

const SongDialog = ({ song, onClose }) => {
  const [updateSong] = useUpdateSongMutation(); // Get the update function from the API slice
  const [formData, setFormData] = useState({ title: '', artist: '', genre: '', album: '' });

  // Populate local state when a song is selected
  useEffect(() => {
    if (song) {
      setFormData({
        title: song.title,
        artist: song.artist,
        genre: song.genre,
        album: song.album,
      });
    }
  }, [song]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (song) {
      await updateSong({ id: song._id, ...formData });
      onClose(); // Close dialog after save
    }
  };

  if (!song) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 bg-gray-300 text-gray-700 py-1 px-2 rounded hover:bg-gray-400 transition duration-300"
        >
          Close
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-black">{song.title}</h2>
        
        <label className="block mb-2 text-black">
          Song Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 w-full rounded"
          />
        </label>
        
        <label className="block mb-2 text-black">
          Artist:
          <input
            type="text"
            name="artist"
            value={formData.artist}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 w-full rounded"
          />
        </label>
        
        <label className="block mb-2 text-black">
          Genre:
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 w-full rounded"
          />
        </label>
        
        <label className="block mb-4 text-black">
          Album:
          <input
            type="text"
            name="album"
            value={formData.album}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 w-full rounded"
          />
        </label>

        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SongDialog;
