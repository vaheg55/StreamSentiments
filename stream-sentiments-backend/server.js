const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const { auth } = require("google-auth-library");

const app = express();
const port = process.env.PORT || 8000; // fall back to port 8000 if process.env.PORT is not defined

const twitch_client_id = process.env.TWITCH_CLIENT_ID;
const twitch_client_secret = process.env.TWITCH_CLIENT_SECRET;

// Middlewares
app.use(express.json()); // parser for JSON request bodies
app.use(cors());

// authenticate app with GCP
app.get("/auth_gcp", (req, res) => {
    try {
        async function getAccessToken() {
            try {
                const keysEnvVar = process.env["CREDS"];
                const keys = JSON.parse(keysEnvVar);

                const client = auth.fromJSON(keys);
                client.scopes = [
                    "https://www.googleapis.com/auth/cloud-platform",
                ];
                const accessToken = await client.getAccessToken();
                res.status(200).send(accessToken);
            } catch {
                res.status(500).send("ERROR");
            }
        }
        getAccessToken();
    } catch (error) {
        res.status(500).send("An error occurred when getting the GCP token.");
    }
});

// authenticate app with Twitch
app.get("/auth_twitch", (req, res) => {
    try {
        const getAccessToken = async () => {
            try {
                const response = await axios.post(
                    (url = `https://id.twitch.tv/oauth2/token?client_id=${twitch_client_id}&client_secret=${twitch_client_secret}&grant_type=client_credentials`)
                );
                res.status(200).send({
                    token: response.data.access_token,
                    client_id: twitch_client_id,
                });
            } catch {
                res.status(500).send("ERROR");
            }
        };
        getAccessToken();
    } catch (error) {
        res.status(500).send(
            "An error occurred when getting the Twitch token."
        );
    }
});

// API route for making predictions
app.post("/predict", (req, res) => {
    try {
        const getPredictions = async () => {
            try {
                // const response = await axios.post(
                //     `${process.env.AI_PLATFORM_API_ENDPOINT}/v1/projects/${process.env.GCP_PROJECT_ID}/models/${process.env.MODEL_NAME}:predict`,
                //     {
                //         instances: req.body.messages.map((msg) => ({
                //             model_2_input: msg,
                //         })),
                //     },
                //     {
                //         headers: {
                //             Authorization: `OAuth ${req.body.token}`,
                //             "Content-Type": "application/json",
                //         },
                //     }
                // );
                // const predictions = response.data.predictions.map(
                //     (pred) => pred.model_3["0"]
                // );
                // const pairedPredictions = predictions
                //     .map((pred, i) => [req.body.messages[i], pred])
                //     .filter((pair) => isFinite(pair[1]));
                const pairedPredictions = req.body.messages
                    .map((messg) => [messg, Math.random() + 0.055]);
                res.status(201).send(pairedPredictions);
            } catch {
                res.status(500).send("ERROR");
            }
        };
        getPredictions();
    } catch (error) {
        res.status(500).send(
            "An error occurred when getting GCP AI Platform predictions."
        );
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
