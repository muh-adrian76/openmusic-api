require('dotenv').config();
const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');

// albums module
const openAlbum = require('./api/openAlbums');
const OpenAlbumService = require('./services/postgres/OpenAlbumsService');
const AlbumValidator = require('./validator/albums');

// songs module
const openSong = require('./api/openMusics');
const OpenSongService = require('./services/postgres/OpenSongsService');
const SongValidator = require('./validator/songs');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const openSongService = new OpenSongService();
  const openAlbumService = new OpenAlbumService();

  await server.register(
    [
      {
        plugin: openSong,
        options: {
          service: openSongService,
          validator: SongValidator,
        },
      },
      {
        plugin: openAlbum,
        options: {
          service: openAlbumService,
          validator: AlbumValidator,
        },
      },
    ],
  );

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    if (response instanceof Error) {
      console.log(response);
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }

      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
