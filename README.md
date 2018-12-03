# lift-me
Quotes for all


# How To Run The Application

## Server

In the project root directory, run `node server.js`. 
This will start the application on port 8000.

## Client

For the react client to have access to the express api, it is important to include url for the API as a proxy in the package.json of the react application.

```
{
  "name": "client",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^16.6.3",
    "react-dom": "^16.6.3",
    "react-scripts": "2.1.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ],
  "proxy": "http://localhost:8000"
}
```

After that has been implemented, simply run `npm start`.