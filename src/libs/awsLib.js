// Amplify required
import { Storage } from "aws-amplify";
//------------------------------------------------------ \\
// This file can be exported/used across the entire App
// for uploading files to AWS S3 Bucket.
// This file is exported to ---> src/components/ModalPromote.js
// -------------- Application Begins Bellow ------------ //

// This function stores our file to AWS S3 Bucket
export async function s3Upload(file, name) {
    // S3 file name
    const filename = `${name}`;

    // Upload the file to S3 Bucket
    const store = await Storage.put(filename, file, {
        level: 'public',
        contentType: file.type
    });

    // Return the S3 key stored
    return store.key;
}