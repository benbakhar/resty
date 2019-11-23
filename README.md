# Resty

A tiny, zero dependencies Express middleware for clear and concise http response handling.

```
npm i -S resty
```

## Usage


```js
const app = require('express')();
const resty = require('resty');

app.use(resty());

app.get('/ping', (req, res) => res.success());
```

which will respond with the following response:

```js
{
    "message": "success",
    "payload": {}
}
```
## Methods

##### response.success(payload, [message])
##### response.created(payload, [message])
##### response.badRequest(payload, [message])
##### response.unauthorized(payload, [message])
##### response.forbidden(payload, [message])
##### response.notFound(payload, [message])
##### response.error([message])

## Options

| Property | Type | Description | Example |
|----------|----------|----------|--------------------|
| `statusCodes` | `Object` | set custom status code for specific http response | `{redirect: 307`} |
