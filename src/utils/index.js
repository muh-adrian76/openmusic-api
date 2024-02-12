const mapSongToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
});

const filterSongTitle = (song, title) => (song.title.toLowerCase().includes(title));

const filterSongPerformer = (song, performer) => (song.performer.toLowerCase().includes(performer));

module.exports = {
  mapSongToModel,
  filterSongTitle,
  filterSongPerformer,
};
