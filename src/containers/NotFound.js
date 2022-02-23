// React Required --------------------------------------
import React from 'react';
// Image -----------------------------------------------
import image from "../images/notfound.png"
//------------------------------------------------------ \\
// This file is exported to ---> src/Routes.js
// we use "ads" ----> "SmAC"
// we use "myads" ----> "U|SmAC"
// -------------- Application Begins Bellow ------------ //

// Main Function
export default function NotFound() {
    // Return UI
    return (
        <main className="App container-fluid" style={{ minHeight: "calc(100vh - 160px)" }}>
            <section className="row px-3 mb-3" style={{ height: "calc(100vh - 180px)", overflow: "hidden" }}>
                {/* 
                 * ---------------------------------------------------------------- >
                 * image - Display when user navigates to a none existing page
                 * ---------------------------------------------------------------- >
                 * */}
                <img
                    src={image}
                    alt="Page Not Found"
                    className="rounded shadow p-0"
                    style={{ objectFit: "cover", height: "inherit" }}
                />
            </section>
        </main>
        );
}