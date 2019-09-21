const resty = require('./index');

const responseStatusSpy = jest.fn(() => ({ json: responseJsonSpy }));
const responseJsonSpy = jest.fn();
const responseMock = { status: responseStatusSpy };

const nextMock = jest.fn();

describe('resty', () => {
  beforeEach(() => {
    resty()({}, responseMock, nextMock);
  });

  afterEach(() => {
    responseStatusSpy.mockClear();
    responseJsonSpy.mockClear();
  });

  describe('init', () => {
    it('call next middleware upon init', () => {
      expect(nextMock).toHaveBeenCalled();
    });

    it('register custom status code for error response', () => {
      const options = {
        statusCodes: {
          error: 503
        }
      };

      resty(options)({}, responseMock, nextMock);

      responseMock.error();

      expect(responseStatusSpy).toHaveBeenCalledWith(503);
    });
  });

  describe('success()', () => {
    it('respond with appropriate status code', () => {
      responseMock.success();

      expect(responseStatusSpy).toHaveBeenCalledWith(200);
    });

    it('respond with appropriate payload', () => {
      const payload = { foo: 'bar' };

      responseMock.success(payload);

      const spyArgument = responseJsonSpy.mock.calls[0][0];

      expect(payload).toBe(spyArgument.payload);
    });
  });

  describe('error()', () => {
    it('respond with appropriate status code', () => {
      responseMock.error();

      expect(responseStatusSpy).toHaveBeenCalledWith(500);
    });

    it('respond with appropriate message', () => {
      const message = 'some error message';

      responseMock.error(message);

      const spyArgument = responseJsonSpy.mock.calls[0][0];

      expect(spyArgument.message).toBe(message);
    });
  });
});
