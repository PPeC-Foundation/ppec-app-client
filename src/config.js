// Developement AWS credentials
// These variables are exported to -- > /index.js
const dev = {
    s3: {
        REGION: process.env.REACT_APP_AWS_REGION,
        BUCKET: process.env.REACT_APP_AWS_BUCKET
    },
    apiGateway: {
        REGION: process.env.REACT_APP_AWS_REGION,
        URL: process.env.REACT_APP_AWS_URL
    },
    cognito: {
        REGION: process.env.REACT_APP_AWS_REGION,
        IDENTITY_POOL_ID: process.env.REACT_APP_AWS_IDENTITY_POOL_ID
    }
};

// Production AWS credentials
const prod = {
    s3: {
        REGION: process.env.REACT_APP_AWS_REGION,
        BUCKET: process.env.REACT_APP_AWS_BUCKET
    },
    apiGateway: {
        REGION: process.env.REACT_APP_AWS_REGION,
        URL: process.env.REACT_APP_AWS_URL
    },
    cognito: {
        REGION: process.env.REACT_APP_AWS_REGION,
        IDENTITY_POOL_ID: process.env.REACT_APP_AWS_IDENTITY_POOL_ID,
    }
};

// Default stage to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
    ? prod
    : dev;

// Add common config values in export default
export default {
    // file sizes 1048576 Bytes or 1MB (images) ---> for file uploads
    MAX_ATTACHMENT_SIZE: 1048576,
    ...config // AWS credentials
};