// React Required --------------------------------------
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
// Amplify - User interation with Cognito and S3 -------
import Amplify from 'aws-amplify';
// config - AWS credentials ----------------------------
import config from './config';
// Container -------------------------------------------
import App from './App';
// CSS -------------------------------------------------
import './index.css';
//------------------------------------------------------ \\
// This file is the main application and renders to --> public/index.html
// we use "ads" ----> "SmAC"
// we use "myads" ----> "U|SmAC"
// -------------- Application Begins Bellow ------------ //

// Amplify enables connection with AWS
// Informations from ---> src/config.js
Amplify.configure({

    // Auth - to authenticate requests
    Auth: {
        mandatorySignIn: false,
        region: config.s3.REGION,
        identityPoolId: config.cognito.IDENTITY_POOL_ID
    },

    API: {
        endpoints: [
            {
                name: "hashes",
                endpoint: config.apiGateway.URL,
                region: config.apiGateway.REGION
            },
        ]
    },

    // Storage - AWS S3 Bucket for file storage
    Storage: {
        region: config.s3.REGION,
        bucket: config.s3.BUCKET,
        identityPoolId: config.cognito.IDENTITY_POOL_ID
    }
});

ReactDOM.render(
    <Router>
        <App />
    </Router>,
    document.getElementById('root')
);