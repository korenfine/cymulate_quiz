# Comunix Test

### Steps to preduce

Run server
```
- open terminal
- npm i
- open .env file and enter DB configuration
- npm run dev (it will run server)
```

 
 Run test
 ```
- run index.html file in browser
```

### DB Structure (db only have one table)

users
```
id: INT(11) PK NN UQ AI
username: VARCHAR(45) UQ
hashed_password: TEXT
salt: VARCHAR(45)
```
