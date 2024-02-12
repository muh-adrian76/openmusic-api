const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: (request, h) => handler.postCollabHandler(request, h),
    options: { auth: 'openmusic_jwt' },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: (request, h) => handler.deleteCollabHandler(request, h),
    options: { auth: 'openmusic_jwt' },
  },
];

module.exports = routes;
