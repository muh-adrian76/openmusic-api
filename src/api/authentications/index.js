const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, {
    authsService, usersService, tokenManager, validator,
  }) => {
    const Handler = new AuthenticationsHandler(authsService, usersService, tokenManager, validator);
    server.route(routes(Handler));
  },
};
