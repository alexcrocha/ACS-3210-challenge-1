# Gaming Leaderboard API
A Serverless-powered API for managing game leaderboards. Store scores, fetch top players, update and delete with ease.

## API Endpoints
### Instructions
>Endpoint: [/](https://5toha1ju40.execute-api.us-east-1.amazonaws.com/dev/) (Link: https://5toha1ju40.execute-api.us-east-1.amazonaws.com/dev/)
>
>Method: `GET`

### Add Score
>Add a new score for a player and game.
>
>Endpoint: [/score](https://5toha1ju40.execute-api.us-east-1.amazonaws.com/dev/score)
>
>Method: `POST`
>
>Body:
>```
>{
>  "gameName": "GameName",
>  "username": "Username",
>  "score": 100
>}
>```

### Get Leaderboard for a Game
>Retrieve a list of top players and their scores for a given game.
>
>Endpoint: [/leaderboard/{gameName}](https://5toha1ju40.execute-api.us-east-1.amazonaws.com/dev/leaderboard/Tetris) (e.g. [/leaderboard/Tetris](https://5toha1ju40.execute-api.us-east-1.amazonaws.com/dev/leaderboard/Tetris))
>
>Method: `GET`

### Update Score
>Update a score for a player and game.
>
>Endpoint: [/score](https://5toha1ju40.execute-api.us-east-1.amazonaws.com/dev/score)
>
>Method: `PUT`
>
>Body:
>```
>{
>  "gameName": "GameName",
>  "username": "Username",
>  "score": 900
>}
>```

### Delete Score
>Delete a score for a player and game.
>
>Endpoint: [/score](https://5toha1ju40.execute-api.us-east-1.amazonaws.com/dev/score)
>
>Method: `DELETE`
>
>Body:
>```
>{
>  "gameName": "GameName",
>  "username": "Username"
>}
>```
