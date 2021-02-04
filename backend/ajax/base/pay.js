const { Iamporter, IamporterError } = require('iamporter');
const axios = require('axios');
const express = require('express');
const router = express.Router();

//상수 초기화
const IMPID = "imp48416773";
const APIKEY = "4165658327188490";
const SECRET = "ny2ZHdkcnZH2zAmRnxFc0BdtqDA6nnvLVxKDL5P84xaE7wvu4aG4LUxcx8iVvOHrlr46wUeBrpfzWL30";

const iamporter = new Iamporter({ //for production
	apiKey: APIKEY,
	secret: SECRET
});

//