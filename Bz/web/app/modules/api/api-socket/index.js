'use strict';

const SocketController = require('./controller/socket.controller.js');

exports.register = function (server, options, next) {

    var configManager = server.configManager;

    const ws = require('./util/ws.js');
    ws.listen(server);
    server.expose('ws', ws);

    server.route({
        method: 'GET',
        path: '/message',
        handler: SocketController.getAllMessage,
        config: {
            plugins: {
                'hapi-io': 'messages/all'
            },
            description: 'Service status',
            tags: ['api']
        }
    });

    server.route({
        method: 'GET',
        path: '/rooms/{roomId}/join',
        handler: SocketController.joinRoom,
        config: {
            plugins: {
              'hapi-io': {
                event: 'room/join',
                post: function(ctx, next) {
                  /*@TODO validate room and user before join*/

                  var rooms = ctx.data.roomId.split(',');
                  rooms.forEach(room=>{
                      console.log('join room: ' + room);
                      ctx.socket.join(room);
                  });

                  next();
              }
          }
      },
      description: 'Service status',
      tags: ['api']
  }
});

    server.route({
        method: 'GET',
        path: '/rooms/{roomId}/leave',
        handler: SocketController.leaveRoom,
        config: {
            plugins: {
              'hapi-io': {
                event: 'room/leave',
                post: function(ctx, next) {
                  /*@TODO validate room and user before join*/
                  console.log('leave room: ' + ctx.data.roomId);
                  var rooms = ctx.data.roomId.split(',');
                  rooms.forEach(room=>{
                      console.log('leave room: ' + room);
                      ctx.socket.leave(room);
                  });
                  next();
              }
          }
      },
      description: 'Service status',
      tags: ['api']
  }
});

    next();
};

exports.register.attributes = {
    name: 'api-socket',
    dependencies: 'hapi-io'
};
