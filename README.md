# Leaderboard API

This is a simple leaderboard API built using Express and SQLite for my game project and can also be used for any project aswell without major modification since it only stores username and score.

## Getting Started

1. Install dependencies:
    ```sh
    npm install
    ```

2. Start the server:
    ```sh
    node index.js
    ```

The server will run on `http://localhost:3000` by default, however you may set a different port using the `PORT` environment variable.

## Endpoints

### Submit Score

- **URL:** `/submit-score`
- **Method:** `POST`
- **Description:** Submit's a players score along with their name
- **Request Body:**
  ```json
  {
      "name": "John Cena",
      "score": 123
  }
