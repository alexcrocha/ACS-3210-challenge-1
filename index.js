const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const AWS = require('aws-sdk');

const LEADERBOARD_TABLE = process.env.LEADERBOARD_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE;
let dynamoDb;
if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  });
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
}

app.use(bodyParser.json({ strict: false }));

// Root endpoint
app.get('/', function (req, res) {
  res.json({
    message: "Welcome to the Gaming Leaderboard API!",
    endpoints: {
      addScore: {
        method: "POST",
        path: "/score",
        description: "Add a new score for a player and game.",
        body: {
          username: "string (required)",
          gameName: "string (required)",
          score: "number (required)"
        }
      },
      getLeaderboard: {
        method: "GET",
        path: "/leaderboard/:gameName",
        description: "Get the top scores for a specific game.",
        parameters: {
          gameName: "string (required)"
        }
      },
      updateScore: {
        method: "PUT",
        path: "/score",
        description: "Update a score for a player and game.",
        body: {
          username: "string (required)",
          gameName: "string (required)",
          score: "number (required)"
        }
      },
      deleteScore: {
        method: "DELETE",
        path: "/score",
        description: "Delete a score for a player and game.",
        body: {
          username: "string (required)",
          gameName: "string (required)"
        }
      }
    }
  });
});

// Add a new score
app.post('/score', function (req, res) {
  const { username, gameName, score } = req.body;

  if (typeof username !== 'string' || typeof gameName !== 'string' || typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const params = {
    TableName: LEADERBOARD_TABLE,
    Item: {
      'PK': `GAME#${gameName}`,
      'SK': `USER#${username}`,
      'score': score,
      'username': username,
      'gameName': gameName
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not submit score' });
    }
    res.json({ username, gameName, score });
  });
});

// Get leaderboard for a game
app.get('/leaderboard/:gameName', function (req, res) {
  const gameName = req.params.gameName;

  const params = {
    TableName: LEADERBOARD_TABLE,
    KeyConditionExpression: 'PK = :gameKey',
    ExpressionAttributeValues: {
      ':gameKey': `GAME#${gameName}`
    },
    ScanIndexForward: false, // this will get the scores in descending order
    Limit: 10
  };

  dynamoDb.query(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not fetch leaderboard' });
    } else {
      res.json({ leaderboard: result.Items });
    }
  });
});

// Update a score for a user
app.put('/score', function (req, res) {
  const { username, gameName, score } = req.body;

  const params = {
    TableName: LEADERBOARD_TABLE,
    Key: {
      'PK': `GAME#${gameName}`,
      'SK': `USER#${username}`
    },
    UpdateExpression: 'set score = :score',
    ExpressionAttributeValues: {
      ':score': score
    }
  };

  dynamoDb.update(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not update score' });
    } else {
      res.json({ username, gameName, score });
    }
  });
});

// Delete a score for a user
app.delete('/score', function (req, res) {
  const { username, gameName } = req.body;

  const params = {
    TableName: LEADERBOARD_TABLE,
    Key: {
      'PK': `GAME#${gameName}`,
      'SK': `USER#${username}`
    }
  };

  dynamoDb.delete(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not delete score' });
    } else {
      res.json({ success: true });
    }
  });
});

module.exports.handler = serverless(app);
