const express = require('express');
const Song = require('../models/song');

const router = express.Router();

// Create a song
router.post('/', async (req, res) => {
  const { title, artist, album, genre } = req.body;
  console.log(req.body)
  const newSong = new Song({ title, artist, album, genre });
  await newSong.save();
  res.status(201).json(newSong);
});

// Get all songs
router.get('/', async (req, res) => {
  const songs = await Song.find();
  // console.log(songs)
  res.json(songs);
});
router.get('/stats', async (req, res) => {
  try {
    const totalSongs = await Song.countDocuments();
    const distinctArtists = await Song.distinct('artist');
    const distinctAlbums = await Song.distinct('album');
    const distinctGenres = await Song.distinct('genre');

    const genreCounts = await Song.aggregate([
      { $group: { _id: '$genre', count: { $count: {} } } },
      { $sort: { count: -1 } },
    ]);

    const artistSongCounts = await Song.aggregate([
      { $group: { _id: '$artist', count: { $count: {} } } },
      { $sort: { count: -1 } },
    ]);

    const albumSongCounts = await Song.aggregate([
      { $group: { _id: '$album', count: { $count: {} } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      totalSongs,
      totalArtists: distinctArtists.length,
      totalAlbums: distinctAlbums.length,
      totalGenres: distinctGenres.length,
      genreCounts,
      artistSongCounts,
      albumSongCounts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get a song by ID
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Update a song
router.put('/:id', async (req, res) => {
  const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(song);
});

// Delete a song
router.delete('/:id', async (req, res) => {
  await Song.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Statistics
router.get('/statistics', async (req, res) => {
  const totalSongs = await Song.countDocuments();
  const totalArtists = await Song.distinct('artist').length;
  const totalAlbums = await Song.distinct('album').length;
  const totalGenres = await Song.distinct('genre').length;
   console.log("yes")
  res.json({ totalSongs, totalArtists, totalAlbums, totalGenres });
});

module.exports = router;
