# Node Challenge

This is an app for stock queries, it's composed by two services: **service api** and **stock service**, the both were made in [NestJS Framework](https://docs.nestjs.com/)

The **service api** uses [Mongo DB](https://www.mongodb.com/docs/) to register the users and stock queries data.

The communication between the both services is through HTTP synchronous request.

# What was done
The basic requirements were made, as well the following:
- Use JWT instead of basic authentication for endpoints
- Use containers to orchestrate the services.
- Use OpenAPI/Swagger to document the API.
- Add endpoint to reset user password sending an email with the new password.

## API Service
The following features were made
- User register with email and role (user or admin). Password is generated and returned by API
- JWT authentication. Token duration is 1h
- Stock query search by symbol. Each successful request is stored with the user id
- Query history from each user (a user can only view the own historic)
- Stats data with the number of times that each stock was queried (just for admin users)

### Endpoints
```
POST /register
POST /reset-password
POST /login
GET /stock
GET /history
GET /stats
```

The API specification with endpoints and parameters can be found in the Open API doc. Once the API is running, just access **localhost:{port}/api**. The default port is 3000.

### About reset password endpoint
The ``/reset-password`` endpoint accepts a JSON like ``{ "email": "emailfromuser@toberedefined.com" }``. The SMTP used is [Ethereal Mail](https://ethereal.email/). It's not a real SMTP. The sent emails won't be received by addressee, instead of that, the email will be received by Ethereal. To access this fake mail box, access [Ethereal Mail](https://ethereal.email/) and log in with email ``krystal.wintheiser20@ethereal.email`` and password ``yaDWrSd2NaERx9sP9R``. Once logged in, go to the messages tab. The SMTP infos can be changed in docker-compose file.

## Stock Service
The following features were made
- Research in external api to get stock queries
- Formats response as JSON

### Endpoints
```GET /?stock={stock}```

This endpoint receives the stock query symbol and returns a formatted json with data. Returns status code 400 when the stock query is not found

 The default port for this service is 3001

## How it works

1. First, a user is registered and get a password
2. The registered users are stored in mongo db
3. A registered user does login and get a 1 hours valid access token
4. With the bearer access token, the user does a query for certain symbol
5. The API Service calls Stock Service
6. Stock Service calls the external API, get the response, format it, and return it to API Service
7. If the result is found, API service responds the user request, and store the search data with the user id in mongo db
8. A logged user can request by your stock queries search historic, which is retrieved from mongo db
9. A user with an admin role can request by the symbols querieds and its number of solicitations. This is retrieved from mongo db

## Running the app

The services as well mongo db can be started with docker-compose. Just call ```docker-compose up``` from the project root. The variables used by the services, as secrets, db credentials and urls, are all defined in docker-compose.yaml file, in the ```environment``` section for each container. The services also can be runned outside docker, for that, run ```npm install && npm start``` in the service project directory. In this case it is necessary to use a .env file to pass the environment variables.

Mongo container creates a directory .docker/ in the project root directory  to persist data through a volume. It's necessary writing permission in the project root directory, or just remove the volume from docker-compose.yaml file in the mongo section

In addition to services and mongo, docker-compose also ups a [mongo-express](http://mongodb-tools.com/tool/mongo-express/) instance. It just provides a web graphical interface to mongo db. For use it, access **localhost:8081**
