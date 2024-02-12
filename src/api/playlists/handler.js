class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({
      name,
      owner: credentialId,
    });

    return h.response({
      status: 'success',
      data: { playlistId },
    }).code(201);
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getAllPlaylists(credentialId);

    return h.response({
      status: 'success',
      data: { playlists },
    });
  }

  async deletePlaylistByIdHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deletePlaylist(playlistId);

    return h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus.',
    });
  }

  async postPlaylistSongByIdHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.checkSongId(songId);
    await this._service.addPlaylistSongById(playlistId, songId);

    const time = new Date().toISOString();
    await this._service.addToActivity(playlistId, songId, credentialId, 'add', time);

    return h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan kedalam playlist.',
    }).code(201);
  }

  async getPlaylistSongsByIdHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    const playlist = await this._service.getPlaylistSongsById(playlistId);

    return h.response({
      status: 'success',
      data: { playlist },
    });
  }

  async deletePlaylistSongByIdHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deletePlaylistSongById(playlistId, songId);

    const time = new Date().toISOString();
    await this._service.addToActivity(playlistId, songId, credentialId, 'delete', time);

    return h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist.',
    });
  }

  async getActivitiesByIdHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    const activities = await this._service.getActivitiesById(playlistId);

    return h.response({
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    });
  }
}

module.exports = PlaylistsHandler;
