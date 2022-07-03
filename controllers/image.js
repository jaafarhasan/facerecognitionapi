require("dotenv").config();
const { USER_ID, CLARIFAI_API_URL, PAT, APP_ID, FACE_MODEL_ID, AGE_MODEL_ID } =
    process.env;

module.exports.handleApiCall = (req, res) => {
    const { input } = req.body;
    const raw = JSON.stringify({
        user_app_id: {
            user_id: USER_ID,
            app_id: APP_ID,
        },
        inputs: [
            {
                data: {
                    image: {
                        url: input,
                    },
                },
            },
        ],
    });

    const requestOptions = {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: "Key " + PAT,
        },
        body: raw,
    };

    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id

    console.log("requestOptions: ", requestOptions);
    fetch(CLARIFAI_API_URL + FACE_MODEL_ID + "/outputs", requestOptions)
        .then((data) => data.json())
        .then((data) => res.json(data))
        .catch(() => res.status(400).json("fail"));
};

module.exports.handlePredictAge = (req, res) => {
    const { input } = req.body;
    const raw = JSON.stringify({
        user_app_id: {
            user_id: USER_ID,
            app_id: APP_ID,
        },
        inputs: [
            {
                data: {
                    image: {
                        url: input,
                        // base64: this.state.imageBase64,
                    },
                },
            },
        ],
    });

    const requestOptions = {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: "Key " + PAT,
        },
        body: raw,
    };

    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id
    fetch(
        CLARIFAI_API_URL +
            AGE_MODEL_ID +
            // "/versions/" +
            // AGE_MODEL_VERSION_ID +
            "/outputs",
        requestOptions
    )
        .then((data) => data.json())
        .then((data) => res.json(data))
        .catch(() => res.status(400).json("fail"));
};

module.exports.handleImageSubmit = (db) => (req, res) => {
    const { id } = req.body;
    db("users")
        .where("id", id)
        .increment("entries", 1)
        .returning("entries")
        .then((entries) => res.json(entries[0].entries))
        .catch(() => res.status(400).json("fail"));
};
