
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
