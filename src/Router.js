// React required --------------------------------------
import React from "react";
import { Route, Routes } from "react-router-dom";
// Containers - Pages ----------------------------------
import Ads from "./containers/Ads";
import Home from "./containers/Home";
import MyAds from "./containers/MyAds";
import NotFound from "./containers/NotFound";
import DigestAds from "./containers/DigestAds";  
import BountyAds from "./containers/BountyAds";  
//------------------------------------------------------ \\
// This file is exported to ---> src/App.js
// we use "ads" ----> "SmAC"
// we use "myads" ----> "U|SmAC"
// -------------- Application Begins Bellow ------------ //

// Main Function
export default function Router() {

    // Return UI
    return (
        <Routes>

            {/* Routes */}
            <Route path="/" exact element={<Home/>} />
            <Route path="/ads" exact element={<Ads/>} />
            <Route path="/myads" exact element={<MyAds/>} />
            <Route path="/digest" exact element={<DigestAds/>} />
            <Route path="/bounty" exact element={<BountyAds/>} />

            {/* 404 Page */}
            <Route path="*" element={<NotFound/>} />

        </Routes>
    );
}