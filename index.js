const HTTP_CODE = {
  success: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  error: 500,
};

const HTTP_MESSAGE = {
  success: 'Success',
  created: 'Created',
  badRequest: 'Bad request',
  unauthorized: 'Unauthorized',
  forbidden: 'Forbidden',
  notFound: 'Not found',
  error: 'Internal error'
};

module.exports = (options = {}) => {
  let statusCodes = { ...HTTP_CODE };

  if (typeof options.statusCodes === 'object') {
    for (const status in HTTP_CODE) {
      statusCodes[status] = options.statusCodes[status] || statusCodes[status];
    }
  }

  return function resty(request, response, next) {

    const respond = (status, message, payload = {}, headers = {}) => {
      response
        .set(headers)
        .status(status)
        .json({ message, payload });
    };

    Object.keys(HTTP_CODE).forEach((method) => {

      const responseMethod = function (payload, message = HTTP_MESSAGE[method], headers) {
        respond(statusCodes[method], message, payload, headers);
      };

      response[method] = Object.defineProperty(responseMethod, 'name', {
        value: method,
        writable: false
      });
    });

    next();
  };
};
