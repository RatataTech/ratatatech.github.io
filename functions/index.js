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
const cors = require("cors")({ origin: true });
const fetch = require("node-fetch");

exports.sendToSlack = functions.https.onRequest((request, response) => {
	if (request.method !== "POST") {
		return response.status(405).send("Method Not Allowed");
	}

	const email = request.body.email;
	const payload = { text: email };

	fetch(process.env.SLACK_EMAIL_WEB_HOOK, {
		method: "POST",
		body: JSON.stringify(payload),
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
	})
		.then((res) => res.json())
		.then((json) => response.status(200).send(json))
		.catch((error) => response.status(500).send(error));
});
