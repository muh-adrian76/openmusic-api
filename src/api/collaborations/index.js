const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { collabsService, playlistsService, validator }) => {
    const Handler = new CollaborationsHandler(collabsService, playlistsService, validator);
    server.route(routes(Handler));
  },
};
