const express = require('express');
const server = express();
const cors = require('cors');
const port = process.env.API_PORT || 5665;
const bcrypt = require('bcrypt');
const saltRounds = 5;
const users = require('./data').users;