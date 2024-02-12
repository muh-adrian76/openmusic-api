require('dotenv').config();

// eslint-disable-next-line import/no-extraneous-dependencies
const Jwt = require('@hapi/jwt');
const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');

// albums module
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');

// songs module
const songs = require('./api/musics');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

// users module
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// auths module
const authentications = require('./api/authentications');
const AuthsService = require('./services/postgres/AuthsService');
const TokenManager = require('./tokenize/tokenManager');
const AuthsValidator = require('./validator/auths');

// playlists module
const playlist = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistService');
const PlaylistsValidator = require('./validator/playlists');

// collabs module
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollabsService');
const CollaborationsValidator = require('./validator/collabs');

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

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: { id: artifacts.decoded.payload.id },
    }),
  });

  const openMusicService = new SongsService();
  const albumsService = new AlbumsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);

  await server.register(
    [
      {
        plugin: songs,
        options: {
          service: openMusicService,
          validator: SongsValidator,
        },
      },
      {
        plugin: albums,
        options: {
          service: albumsService,
          validator: AlbumsValidator,
        },
      },
      {
        plugin: users,
        options: {
          service: usersService,
          validator: UsersValidator,
        },
      },
      {
        plugin: authentications,
        options: {
          authsService: authenticationsService,
          usersService,
          tokenManager: TokenManager,
          validator: AuthsValidator,
        },
      },
      {
        plugin: playlist,
        options: {
          service: playlistsService,
          validator: PlaylistsValidator,
        },
      },
      {
        plugin: collaborations,
        options: {
          collabsService: collaborationsService,
          playlistsService,
          validator: CollaborationsValidator,
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
