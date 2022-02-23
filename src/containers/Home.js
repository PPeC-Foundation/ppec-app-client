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
    const { documentPPeC, buyPPeCLink } = useAppContext();
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
                <div className="col col-lg-8 mx-auto d-flex justify-content-center align-content-center text-center" style={{ height: "calc(100vh - 100px)"}}>
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
                        <div className="btn-group">
                            {/* Learn More */}
                            <a
                                target="_blank"
                                href={documentPPeC}
                                rel="noopener noreferrer"
                                style={{ fontSize: "1.2rem" }}
                                className="btn btn-warning border border-dark shadow"
                            >
                                <strong> Lear|More </strong>
                            </a>

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
                                href="/ads"
                                style={{ fontSize: "1.2rem" }}
                                className="btn btn-dark shadow"
                            >
                                <strong> Start|Earning </strong>
                            </a>
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
                            <li className="list-group-item "> <i className="fa fa-check-square-o text-success"></i> <b> No Fees </b> </li>
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
                <div className="col-12 d-flex justify-content-center align-content-center my-5 my-md-0">
                    <div className="p-3 align-self-center">
                        <h1 style={{ fontSize: "2.5rem" }}> <b> Launching your SmAC </b> </h1>
                    </div>
                </div>
                <div className="col-12 col-md-4 d-flex justify-content-center align-content-center my-5 my-md-0">
                    <div className="p-3 align-self-center text-center">
                        <span style={{ fontSize: "4rem" }}> &#10102; </span>
                        <h2 style={{ fontSize: "1.7rem" }}> Setup your wallet </h2>
                        <p>Once you've set up your MetaMask wallet, connect it to PaidPerClick by clicking the connect button in the top right corner.</p>
                        <a href={documentPPeC} target="_blank" className="btn btn-primary border border-dark mt-3 shadow-sm" rel="noopener noreferrer">
                            <i className='fa fa-file-text'></i>
                            <b> Learn|More </b>
                        </a>
                    </div>
                </div>
                <div className="col-12 col-md-4 d-flex justify-content-center align-content-center my-5 my-md-0">
                    <div className="p-3 align-self-center text-center">
                        <span style={{ fontSize: "4rem" }}> &#10103; </span>
                        <h2 style={{ fontSize: "1.7rem" }}> Fund your wallet </h2>
                        <p>Once you've set up your MetaMask wallet, connect it to PaidPerClick by clicking the connect button in the top right corner.</p>
                        <a href={documentPPeC} target="_blank" className="btn btn-primary border border-dark mt-3 shadow-sm" rel="noopener noreferrer">
                            <i className='fa fa-file-text'></i>
                            <b> Get|PPeC </b>
                        </a>
                    </div>
                </div>
                <div className="col-12 col-md-4 d-flex justify-content-center align-content-center my-5 my-md-0">
                    <div className="p-3 align-self-center text-center">
                        <span style={{ fontSize: "4rem" }}> &#10104; </span>
                        <h2 style={{ fontSize: "1.7rem" }}> Launch your SmAC </h2>
                        <p>Once you've set up your MetaMask wallet, connect it to PaidPerClick by clicking the connect button in the top right corner.</p>
                        <a href={documentPPeC} target="_blank" className="btn btn-primary border border-dark mt-3 shadow-sm" rel="noopener noreferrer">
                            <i className='fa fa-file-text'></i>
                            <b> Promote </b>
                        </a>
                    </div>
                </div>
                
            </div>
            
        </main>
        );

}