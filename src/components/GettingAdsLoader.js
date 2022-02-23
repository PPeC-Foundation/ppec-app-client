// React Required --------------------------------------
import React from 'react';
//------------------------------------------------------ \\
// This file is exported to all pages
// we use "ads" ----> "SmAC"
// we use "myads" ----> "U|SmAC"
// -------------- Application Begins Bellow ------------ //

// Main Function
export default function GettingAdsLoader() {

    // Return UI
    return (
        <div className="d-flex justify-content-center align-content-center">
            <div className="my-4 p-5 bg-primary shadow text-white rounded text-center border border-dark">
                <p style={{ fontSize: "2.5rem" }}> <b> Getting SmAC </b> </p>
                <div className="spinner-grow text-light py-3"></div>
            </div>
        </div>
    );
}