// React Required --------------------------------------
import React from 'react';
// Image -----------------------------------------------
import image from "../images/nosmacfound.png"
import imageSecondary from "../images/nosmacfromyou.png"
//------------------------------------------------------ \\
// This file is exported to all pages
// we use "ads" ----> "SmAC"
// we use "myads" ----> "U|SmAC"
// -------------- Application Begins Bellow ------------ //

// Main Function
export default function NoAvailableAds(props) {
    // Important variables
    const { myads } = props;

    // Return UI
    return (
        <section className="row px-3 mb-3" style={{ height: "calc(100vh - 180px)", overflow: "hidden" }}>
            <img src={myads === true ? imageSecondary : image} alt="Page Not Found" className="rounded shadow p-0" style={{ objectFit: "cover", height: "inherit" }} />
        </section>
    );
}