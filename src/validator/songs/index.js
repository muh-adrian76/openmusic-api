const InvariantError = require('../../exceptions/InvariantError');
const { Song } = require('./schema');

const SongsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = Song.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
