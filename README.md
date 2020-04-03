# ApiLift

A microservice written in TypeScript for monitoring saved urls.

## Install

Clone the repository

```bash
git clone git@github.com:ondra-m/apilift.git
```

Install dependencies

```bash
npm install
```

## Configuration and running

You can configure the app by JSON file or by environment variables.

1. Check and modify config.json at the root and run. If you won't change any attributes, the server will starts at `localhost:3000`

```bash
npm run start config.json
```

2. Via environment variables

```bash
APILIFT_DB_HOST=localhost \
APILIFT_DB_USER=root \
APILIFT_DB_PASSWORD=root \
APILIFT_DB_NAME=apilift \
APILIFT_WEB_PORT=3000 \
npm run start
```

3. Using docker

Make sure that [docker-compose](https://docs.docker.com/compose/) is installed.

```bash
docker-compose up
```

## Usage

By default 3 users are created (see src/migrate/seed.ts for more informations)

- Admin accessToken="d70bce60-73ed-11ea-bc9d-b7f14190b585"
- Applifting accessToken="93f39e2f-80de-4033-99ee-249d92736a25"
- Batman accessToken="dcb20f8a-5657-4f1b-9f7f-ce65739b359e"

You must include `accessToken` to Authorization header (see at examples below)

Returned data are always within user's context.

### Users

**Show info about current users**

```bash
curl --request GET \
     --url http://localhost:3000/whoami \
     --header 'Authorization: Bearer d70bce60-73ed-11ea-bc9d-b7f14190b585'
```

### Endpoints

**List of all endpoints**

```bash
curl --request GET \
     --url http://localhost:3000/endpoints \
     --header 'Authorization: Bearer d70bce60-73ed-11ea-bc9d-b7f14190b585'
``` 

**Get a single endpoint**

- `:id` an id of the existing endpoint (otherwise 404 is returned)

```bash
curl --request GET \
     --url http://localhost:3000/endpoints/:id \
     --header 'Authorization: Bearer d70bce60-73ed-11ea-bc9d-b7f14190b585'
```

**Create new endpoint**

- `interval` url will be checked in this interval (in seconds)
- `name` name of the endpoint
- `url` url of the endpoint (must include protocol)

```bash
curl --request POST \
     --url http://localhost:3000/endpoints \
     --header 'Authorization: Bearer d70bce60-73ed-11ea-bc9d-b7f14190b585' \
     --header 'Content-type: application/json' \
     --data '{  
        "interval": 10,
        "name": "Check applifting.cz",
        "url": "https://www.applifting.cz"
     }'
```

**Update saved endpoint**

- `:id` an id of the existing endpoint
- see previous example for parameters description

```bash
curl --request PATCH \
     --url http://localhost:3000/endpoints/:id \
     --header 'Authorization: Bearer d70bce60-73ed-11ea-bc9d-b7f14190b585' \
     --header 'Content-type: application/json' \
     --data '{
        "interval": 50,
        "name": "Test",
        "url": "http://example.net"
     }'
```

**Delete an endpoint**

- `:id` an id of the existing endpoint

```bash
curl --request DELETE \
     --url http://localhost:3000/endpoints/:id \
     --header 'Authorization: Bearer d70bce60-73ed-11ea-bc9d-b7f14190b585'
```

### Monitoring results

**List of all results**

- `endpointId` results for specific endpoint (optional)

```bash
curl --request GET \
     --url http://localhost:3000/monitoring_results?endpointId=2 \
     --header 'Authorization: Bearer d70bce60-73ed-11ea-bc9d-b7f14190b585'
``` 

**Get a single result**

This route (compared to the previous) return payload and information about endpoint.

- `:id` an id of the existing result (otherwise 404 is returned)

```bash
curl --request GET \
     --url http://localhost:3000/monitoring_results/:id \
     --header 'Authorization: Bearer d70bce60-73ed-11ea-bc9d-b7f14190b585'
```

## Tests

First, configure `config.test.json` for your test environemnt and

```bash
npm run test
```

Or if you want test everything if you change any file run

```bash
npm run test:dev
```

## TODO

- A lot of `.catch` is missing
- Using some existing ORM would be better
