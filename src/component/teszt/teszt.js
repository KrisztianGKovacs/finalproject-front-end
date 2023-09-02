import React, { useEffect } from "react";


const PAT = 'e3e2e57c46984160bfd4a496e0abe5ec';
    
    const USER_ID = 'chrissmith';       
    const APP_ID = 'test';
    
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    
    
    const IMAGE_URL = `{imageUrl}`;

    

const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
});

const Teszt = ( {imageUrl} ) => {
    
    
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    
    //const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';
    useEffect(() => {
    
            console.log('run run run');
            fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
        .then(response => response.text())
        //.then(response => this.calculateFaceLocation(response))
        .then(result => console.log(result))
        .catch(error => console.log('error', error))
    
            }, []);
}

export default Teszt;