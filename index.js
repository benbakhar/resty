const HTTP_CODE = {
    success: 200,
    created: 201,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    error: 500,
}

const HTTP_MESSAGE = {
    success: 'Success',
    created: 'Created',
    badRequest: 'Bad request',
    unauthorized: 'Unauthorized',
    forbidden: 'Forbidden',
    notFound: 'Not found',
    error: 'Internal error'
}

const resty = (options = {}) => {
    let statusCodes = { ...HTTP_CODE };

    if (typeof options.statusCodes === 'object') {
        for (status in HTTP_CODE) {
            statusCodes[status] = options.statusCodes[status] || statusCodes[status]
        }
    }

    return (request, response, next) => {

        const respond = (status, message, payload = {}, headers = {}) => {
            response.status(status).json({ message, payload });
        }

        response.success = (payload, message = HTTP_MESSAGE.success) => {
            respond(statusCodes.success, message, payload);
        }

        response.created = (payload, message = HTTP_MESSAGE.created) => {
            respond(statusCodes.created, message, payload);
        }

        response.badRequest = (message = HTTP_MESSAGE.badRequest) => {
            respond(statusCodes.badRequest, message);
        }

        response.unauthorized = (message = HTTP_MESSAGE.unauthorized) => {
            respond(statusCodes.unauthorized, message);
        }

        response.forbidden = (message = HTTP_MESSAGE.forbidden) => {
            respond(statusCodes.forbidden, message);
        }

        response.notFound = (message = HTTP_MESSAGE.notFound) => {
            respond(statusCodes.notFound, message);
        }

        response.error = (message = HTTP_MESSAGE.error) => {
            respond(statusCodes.error, message);
        }

        next();
    }
}

module.exports = resty;
