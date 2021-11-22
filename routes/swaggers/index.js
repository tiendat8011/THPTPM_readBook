const {
  pathUsers,
  pathUsersId,
  pathUserLogin,
  pathUserUploadAvatar,
  definitionUser,
  pathUserPassword,
  definitionPassword,
  definitionConfirmCode,
  pathSetAdmin,
  pathUserInfo,
  pathConfirmCode,
  pathResendConfirmCode,
} = require('./users');

const keys = require('../../config/index');

module.exports = {
  swagger: '2.0',
  info: {
    description: 'API Specification',
    version: '1.0.0',
    title: 'ABC',
    contact: {
      email: '',
    },
    license: {
      name: 'Giấy phép chứng nhận dự án',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
    },
  },
  host: keys.host,
  basePath: '/api',
  schemes: ['http', 'https'],
  tags: [
    {
      name: 'Users',
      description: 'Everything about your Users',
    },
  ],
  consumes: ['application/json'],
  produces: ['application/json'],
  paths: {
    '/users': pathUsers,
    '/users/{userId}': pathUsersId,
    '/users/login': pathUserLogin,
    '/users/me/avatar': pathUserUploadAvatar,
    '/users/change-password/me': pathUserPassword,
    '/users/confirm': pathConfirmCode,
    '/users/resendConfirmCode': pathResendConfirmCode,
    '/users/me': pathUserInfo,
    '/users/set-admin': pathSetAdmin,
    '/users/set-client': pathSetAdmin
  },
  securityDefinitions: {
    token: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
  },
  definitions: {
    User: definitionUser,
  },
};
