// const Clarifai = require('clarifai');
// const faceDetectId = Clarifai.FACE_DETECT_MODEL;
const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 65d15935bb10450f90a088663a8041b3");

const handleApiCall = (req, res) => {

	// const returnClarifReqOptions = (imageUrl) => {

	//     const PAT = '65d15935bb10450f90a088663a8041b3';
	//     const USER_ID = 'clarifai';
	//     const APP_ID = 'main';
	//     const IMAGE_URL = imageUrl;
	    
	//     const raw = JSON.stringify({
	//         "user_app_id": {
	//             "user_id": USER_ID,
	//             "app_id": APP_ID
	//         },
	//         "inputs": [
	//             {
	//                 "data": {
	//                     "image": {
	//                         "url": IMAGE_URL
	//                     }
	//                 }
	//             }
	//         ]
	//     });

	//     const requestOptions = {
	//         method: 'POST',
	//         headers: {
	//             'Accept': 'application/json',
	//             'Authorization': 'Key ' + PAT
	//         },
	//         body: raw
	//     };

	//     return requestOptions;
	// }

	// fetch("https://api.clarifai.com/v2/models/face-detection/outputs", returnClarifReqOptions(req.body.input))
    // .then(response => response.json())
    // .then(result => {
    // 	res.json(result);
    // })
    // .catch(err => res.status(400).json('Error with API call'))

	stub.PostModelOutputs(
	    {
	        user_app_id: {
	            user_id: 'clarifai', 
	            app_id: 'main'
        	},
	        model_id: 'face-detection',
	        inputs: [{data: {image: {url: req.body.input}}}]
	    },
	    metadata,
	    (err, response) => {
	        if (err) {
	            console.log("Error: " + err);
	            return;
	        }
	        if (response.status.code !== 10000) {
	            console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
	            return;
	        }
	        res.json(response);
	    }
	);
}

const handleImage = (req, res, knex) => {
	const { id } = req.body;
	knex('users').where({id})
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0].entries);
		})
		.catch(err => res.status(400).json('Unable to get entries'))
}

module.exports = {
	handleImage: handleImage,
	handleApiCall: handleApiCall
};