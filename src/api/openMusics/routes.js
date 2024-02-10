const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: (request, h) => handler.postMusicHandler(request, h),
  },
  {
    method: 'GET',
    path: '/songs',
    handler: (request, h) => handler.getMusicsHandler(request, h),
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: (request, h) => handler.getMusicByIdHandler(request, h),
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: (request, h) => handler.putMusicByIdHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: (request, h) => handler.deleteMusicByIdHandler(request, h),
  },
];

module.exports = routes;
