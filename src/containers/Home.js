// React Required --------------------------------------
import React from 'react';
// Libs ------------------------------------------------
// usaAppContext stores - App.js - variables for the entire application
import { useAppContext } from "../libs/contextLib";
// Video------------------------------------------------
import backgroundMP4 from '../ppecwalk.mp4';
import backgroundMOV from '../ppecwalk.mov';
import promoteVideo from '../promote.mp4';
//------------------------------------------------------ \\
// This file is exported to ---> src/Routes.js
// we use "ads" ----> "SmAC"
// we use "myads" ----> "U|SmAC"
// -------------- Application Begins Bellow ------------ //

export default function Home() {
    // Important variables
    const { documentPPeC, buyPPeCLink, promotePPeCDocs, getPPeCDocs, liquidityPoolPPeCLink, minBalance, minReward, commify } = useAppContext();

    // Return UI
    return (
        <main className="container-fluid" >
            {/* Background Video */}
            <video id="background-video" playsInline autoPlay loop muted style={{ position: "fixed", zIndex: "-1", padding: "0", margin: "-12px", top: "0", height: "120%", width: "100%", objectFit: "cover", opacity: "0.25" }}>
                <source src={backgroundMP4} type="video/mp4" />
                <source src={backgroundMOV} type="video/mov" />
                Your browser does not support the video tag.
            </video>

            {/* Jumbotron */}
            <div className="row m-0">
                <div className="col col-lg-8 mx-auto d-flex justify-content-center align-content-center text-center" style={{ minHeight: "calc(100vh - 160px)"}}>
                    <div className="text-dark rounded align-self-center">
                        <h1 style={{ fontSize: "3rem", fontFamily: "'Russo One', sans-serif" }}> Decentralizing Advertisement with a <strong className=""> SmAC </strong> </h1>
                        <p className="text-dark" style={{ fontSize: "1.2rem" }}>
                            <strong> 
                                <span> Explore a brand new way to advertise and get more traffic with </span>
                                <a
                                    className=""
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://paidperclick.gitbook.io/ppec-docs/guides/smac"
                                > 
                                    <span> Smart Ads </span>
                                </a>
                            </strong>
                        </p>
                        <div className="btn-group me-0 me-sm-3 mb-3 mb-sm-0">
                            {/* Learn More */}
                            <a
                                target="_blank"
                                href={documentPPeC}
                                rel="noopener noreferrer"
                                style={{ fontSize: "1.2rem" }}
                                className="btn btn-warning border border-dark"
                            >
                                <strong> Lear|More </strong>
                            </a>

                            {/* Start Earning */}
                            <a
                                href="/ads"
                                style={{ fontSize: "1.2rem" }}
                                className="btn btn-primary border border-dark"
                            >
                                <strong> Start|Earning </strong>
                            </a>
                        </div>
                        <div className="btn-group">

                            {/* Buy PPeC */}
                            <a
                                target="_blank"
                                href={buyPPeCLink}
                                rel="noopener noreferrer"
                                style={{ fontSize: "1.2rem" }}
                                className="btn btn-primary border border-dark"
                            >
                                <strong> Get|PPeC </strong>
                            </a>

                            {/* Start Earning */}
                            <a
                                rel="noopener noreferrer"
                                href={liquidityPoolPPeCLink}
                                style={{ fontSize: "1.2rem" }}
                                className="btn btn-primary border border-dark"
                            >
                                <strong> Provide|Liquidity </strong>
                            </a>
                        </div>

                    </div>
                </div>
            </div>

            {/* Info Bar */}
            <div className="row bg-dark d-flex justify-content-center align-content-center p-0">
                <div className="col-12 col-lg-4 d-flex justify-content-center align-content-center">
                    <div className="p-3 align-self-center text-center text-white">
                        <div className="btn-group w-100">
                            <div className="btn btn-outline-light"> Minimum reward </div>
                            <div className="btn alert-light"> <strong> {commify(minReward)} </strong> PPeC </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4 d-flex justify-content-center align-content-center">
                    <div className="p-3 align-self-center text-center text-white pt-0 pt-lg-3">
                        <div className="btn-group mt-0 w-100">
                            <div className="btn btn-outline-light"> Minimum Balance </div>
                            <div className="btn alert-light"> <strong> {commify(minBalance)} </strong> PPeC </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Jumbotron */}
            <div className="row d-flex justify-content-center align-content-center p-0" style={{ minHeight: "calc(100vh)", backgroundColor: "#ffffffeb" }}>
                <div className="col-12 col-md d-flex justify-content-center align-content-center my-5 my-md-0">
                    <div className="p-3 align-self-center">
                        <h1 style={{ fontSize: "2.5rem" }}> <b>SmAC</b> </h1>
                        <p style={{ fontSize: "1.2rem" }}> Incentive-driven solutions to help your business or project grow at the blockchain speed. Launch your smart ads in <span className="border-bottom">seconds</span>. </p>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item "> <i className="fa fa-check-square-o text-success"></i> <b> No launch fees </b> </li>
                            <li className="list-group-item "> <i className="fa fa-check-square-o text-success"></i> <b> No waiting for approval </b> </li>
                            <li className="list-group-item "> <i className="fa fa-check-square-o text-success"></i> <b> No credential needed </b> </li>
                            <li className="list-group-item "> <i className="fa fa-check-square-o text-success"></i> <b> On standby audience </b> </li>
                        </ul>
                        <a href={documentPPeC} target="_blank" className="btn btn-primary border border-dark mt-3 shadow-sm" rel="noopener noreferrer">
                            <i className='fa fa-file-text'></i>
                            <b> Learn|More </b>
                        </a>
                    </div>

                </div>
                <div className="col-12 col-md d-flex justify-content-center align-content-center pb-5 pb-md-0">
                    <div className="p-4 border rounded align-self-center">
                        {/* Background Video */}
                        <video id="promote-video" playsInline autoPlay loop muted className="bg-white border border-secondary p-1 rounded shadow" style={{ width : "300px" }}>
                            <source src={promoteVideo} type="video/mp4" />
                            <source src={promoteVideo} type="video/ogg" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </div>

            {/* Jumbotron */}
            <div className="row d-flex justify-content-center align-content-center p-0" style={{ minHeight: "calc(100vh)", backgroundColor: "#f8fcfdf2" }}>
                <div className="col-12 d-flex justify-content-center align-content-center my-3 my-md-0">
                    <div className="p-3 align-self-center text-center">
                        <h1 style={{ fontSize: "2.5rem" }}> <b> Launching your SmAC </b> </h1>
                        <p> with the world's first Decentralized Advertisements <i>(DAdvers)</i> platform </p>
                    </div>
                </div>
                <div className="col-12 col-md-7 col-lg-4 d-flex justify-content-center align-content-center my-4 my-md-0">
                    <div className="p-3 align-self-center text-center">
                        <span style={{ fontSize: "4rem" }} role="img" aria-label="1"> &#10102; </span>
                        <h2 style={{ fontSize: "1.7rem" }}> Setup your wallet </h2>
                        <p>Once you've set up your MetaMask wallet with Avalanche Network, connect it by clicking the <strong> connect </strong> button in the top right corner.</p>
                        <a href={documentPPeC} target="_blank" className="btn btn-dark text-warning border border-dark shadow" rel="noopener noreferrer">
                            <i className='fa fa-file-text'></i>
                            <b> Learn|More </b>
                        </a>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center align-content-center my-4 my-md-0">
                    <div className="p-3 align-self-center text-center">
                        <span style={{ fontSize: "4rem" }} role="img" aria-label="2"> &#10103; </span>
                        <h2 style={{ fontSize: "1.7rem" }}> Fund your wallet </h2>
                        <p> When you are connected to PaidPerClick click on the <strong> Get|PPeC </strong> button on the navigation bar to swap USDC for $PPeC.</p>
                        {/* Button Group */}
                        <div className="btn-group">
                            {/* Modal Button */}
                            <a
                                target="_blank"
                                href={getPPeCDocs}
                                rel="noopener noreferrer"
                                className="btn btn-dark text-warning border border-end-0 border-dark"
                            >
                                {/* icon */}
                                <i className="fa fa-file-text"></i>
                                <strong> View Docs </strong>
                            </a>

                            {/* Link */}
                            <a
                                target="_blank"
                                href={buyPPeCLink}
                                rel="noopener noreferrer"
                                className="btn btn-primary border border-dark shadow-sm"
                            >
                                {/* name */}
                                <i className="fa fa-bitcoin"></i>
                                <strong> Get|PPeC </strong>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center align-content-center my-4 my-md-0">
                    <div className="p-3 align-self-center text-center">
                        <span style={{ fontSize: "4rem" }} role="img" aria-label="3"> &#10104; </span>
                        <h2 style={{ fontSize: "1.7rem" }}> Launch your SmAC </h2>
                        <p> With your wallet fully funded, your are ready to launch your SmAC. Click on the <strong> promote </strong> button to launch a SmAC.</p>
                        {/* Button Group */}
                        <div className="btn-group">
                            {/* Modal Button */}
                            <a
                                target="_blank"
                                href={promotePPeCDocs}
                                rel="noopener noreferrer"
                                className="btn btn-dark text-warning border border-end-0 border-dark"
                            >
                                {/* icon */}
                                <i className="fa fa-file-text"></i>
                                <strong> View Docs </strong>
                            </a>

                            {/* Link */}
                            <button
                                type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#promote"
                                className="btn btn-primary border border-dark"
                            >
                                <i className="fa fa-plus-square"></i>
                                <b> Promote|SmAC </b>
                            </button>
                        </div>
                    </div>
                </div>
                
            </div>

            {/* Jumbotron */}
            <div className="row d-flex justify-content-center align-content-center p-0" style={{ minHeight: "calc(100vh)", backgroundColor: "#fbfeffde" }}>
                <div className="col-12 d-flex justify-content-center align-content-center my-3 my-md-0">
                    <div className="p-3 align-self-center text-center">
                        <h1 style={{ fontSize: "2.5rem" }}> <b> How to use PPeC </b> </h1>
                        <p> powering the decentralized advertisement <i> (DAdvers) </i> world </p>
                    </div>
                </div>
                <div className="col-6 col-lg-3 d-flex justify-content-center align-content-center my-4 my-md-0">
                    <div className="p-3 align-self-center text-center">
                        <span style={{ fontSize: "4rem" }} role="img" aria-label="bank"> &#127974; </span>
                        <h2 style={{ fontSize: "1.7rem" }}> Hold </h2>
                        <p> Get PPeC with USDC</p>
                        <a href={buyPPeCLink} target="_blank" className="btn btn-primary border border-dark shadow-sm" rel="noopener noreferrer">
                            <i className='fa fa-bitcoin'></i>
                            <b> Get|PPeC </b>
                        </a>
                    </div>
                </div>
                <div className="col-6 col-lg-3 d-flex justify-content-center align-content-center my-4 my-md-0">
                    <div className="p-3 align-self-center text-center">
                        <span style={{ fontSize: "4rem" }} role="img" aria-label="diamond"> &#128142; </span>
                        <h2 style={{ fontSize: "1.7rem" }}> Claim </h2>
                        <p> Claiming rewards, Increase holdings </p>
                        {/* Link */}
                        <a
                            href="/ads"
                            className="btn btn-primary border border-dark shadow-sm"
                        >
                            {/* name */}
                            <i className="fa fa-bullhorn"></i>
                            <strong> SmAC </strong>
                        </a>
                    </div>
                </div>
                <div className="col-6 col-lg-3 d-flex justify-content-center align-content-center my-4 my-md-0">
                    <div className="p-3 align-self-center text-center">
                        <span style={{ fontSize: "4rem" }} role="img" aria-label="trade usd yen"> &#128177; </span>
                        <h2 style={{ fontSize: "1.7rem" }}> Trade </h2>
                        <p> Trade PPeC on Avalanche DEX</p>
                        {/* Link */}
                        <a
                            target="_blank"
                            href={buyPPeCLink}
                            rel="noopener noreferrer"
                            className="btn btn-primary border border-dark shadow-sm"
                        >
                            {/* icon */}
                            <i className='fa fa-bitcoin'></i>
                            <b> Trade|PPeC </b>
                        </a>
                    </div>
                </div>
                <div className="col-6 col-lg-3 d-flex justify-content-center align-content-center my-4 my-md-0">
                    <div className="p-3 align-self-center text-center">
                        <span style={{ fontSize: "4rem" }} role="img" aria-label="lightning bolt"> &#9889; </span>
                        <h2 style={{ fontSize: "1.7rem" }}> Vault </h2>
                        <p> Stake and Provide liquidity</p>
                        {/* Link */}
                        <a
                            target="_blank"
                            href={liquidityPoolPPeCLink}
                            rel="noopener noreferrer"
                            className="btn btn-primary border border-dark shadow-sm"
                        >
                            {/* icon */}
                            <i className="fa fa-cubes"></i>
                            <strong> Stake </strong>
                        </a>
                    </div>
                </div>
                
            </div>
            
        </main>
        );

}