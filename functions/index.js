/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const fetch = require("node-fetch");

const app = express();

// Enable CORS with various options
app.use(cors({ origin: true }));

// Apply rate limiting
const limiter = rateLimit({
	windowMs: 30 * 60 * 1000, // 30 minutes
	max: 20, // limit each IP to 20 requests per windowMs
});

app.use(limiter);

app.post("/sendToSlack", (req, res) => {
	const email = req.body.email;
	const payload = { text: email };

	fetch(process.env.SLACK_EMAIL_WEB_HOOK, {
		method: "POST",
		body: JSON.stringify(payload),
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
	})
		.then((response) => response.json())
		.then((json) => res.status(200).send(json))
		.catch((error) => res.status(500).send(error));
});

// Handle unsupported methods on this route
app.all("/sendToSlack", (req, res) => {
	res.status(405).send("Method Not Allowed");
});

exports.sendToSlack = functions.https.onRequest(app);
