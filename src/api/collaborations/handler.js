class CollaborationsHandler {
  constructor(collabsService, playlistsService, validator) {
    this._collaborationsService = collabsService;
    this._playlistsService = playlistsService;
    this._validator = validator;
  }

  async postCollabHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.validateCollaboratorId(userId);

    const collaborationId = await this._collaborationsService
      .addCollaboration(
        playlistId,
        userId,
      );

    return h.response({
      status: 'success',
      data: { collaborationId },
    }).code(201);
  }

  async deleteCollabHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return h.response({
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    });
  }
}

module.exports = CollaborationsHandler;
