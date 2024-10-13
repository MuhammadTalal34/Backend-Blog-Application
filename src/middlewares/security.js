const helmet = require("helmet");
const express = require('express')
const helmets = express()
helmets.use(helmet());

module.exports = helmets;
