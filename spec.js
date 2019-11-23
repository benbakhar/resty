const resty = require('./index');

const responseStatusSpy = jest.fn(() => ({ json: responseJsonSpy }));
const responseJsonSpy = jest.fn();
const responseHeadersSpy = jest.fn(() => responseMock);
const responseMock = {
  status: responseStatusSpy,
  set: responseHeadersSpy
};

const nextMock = jest.fn();

describe('resty', () => {
  beforeEach(() => {
    resty()({}, responseMock, nextMock);
  });

  afterEach(() => {
    responseStatusSpy.mockClear();
    responseJsonSpy.mockClear();
    responseHeadersSpy.mockClear();
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

  describe('respond', () => {
    describe('headers', () => {
      it('should set custom headers on respons object', () => {
        const headers = { 'X-my-header': 'my-header-value' };

        responseMock.success({}, null, headers);

        expect(responseHeadersSpy).toHaveBeenCalledWith(headers);
      });
    });
  });

  describe('success()', () => {
    it('respond with appropriate status code', () => {
      responseMock.success(111, 222, 333);

      expect(responseStatusSpy).toHaveBeenCalledWith(200);
    });

    it('respond with appropriate payload', () => {
      const payload = { foo: 'bar' };

      responseMock.success(payload);

      const spyArgument = responseJsonSpy.mock.calls[0][0];

      for (const key in payload) {
        expect(payload[key]).toBe(spyArgument.payload[key]);
      }
    });
  });

  describe('error()', () => {
    it('respond with appropriate status code', () => {
      responseMock.error();

      expect(responseStatusSpy).toHaveBeenCalledWith(500);
    });

    it('respond with appropriate message', () => {
      const message = 'some error message';

      responseMock.error(null, message);

      const spyArgument = responseJsonSpy.mock.calls[0][0];

      expect(spyArgument.message).toBe(message);
    });
  });
});
