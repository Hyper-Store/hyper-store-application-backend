
This repository showcases a project built with NestJS, designed to create an event-driven architecture using RabbitMQ. The primary goal of this project is to implement event sourcing with an automated retry mechanism, which is intelligently designed to ensure idempotency in the event consumers. Unique to this project, the event sourcing is developed in a way that allows developers to focus solely on publishing events, while the system takes care of the rest - including ensuring execution, persistence of events, and idempotency. This approach allows for a robust and resilient architecture, minimizing developer overhead and maximizing system reliability.

For you to be able to run this project:

``` 
npm install
```
and then
``` 
docker-compose up -d
```
after this, you run
```
npx prisma migrate dev
```
and then you can start the application by
``` 
npm run start:dev
```

you can test the api by sending a request of method POST to  `http://localhost:5000/auth/signup` with this request body
```
{
	"email": "any_email@gmail.com",
	"password": "Bany_password1",
	"username":"any_username"
}
```
you can log into the mysql database using the credentials on `.env` file and look for the table `event_sourcing`, you will see when you create a user, an event is generated.
