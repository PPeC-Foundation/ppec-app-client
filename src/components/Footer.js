// React Required --------------------------------------
import React from 'react';
// Libs ------------------------------------------------
// usaAppContext stores - App.js - variables for the entire application
import { useAppContext } from '../libs/contextLib';
//------------------------------------------------------ \\
// This file is exported to ---> src/App.js
// we use "ads" ----> "SmAC"
// we use "myads" ----> "U|SmAC"
// -------------- Application Begins Bellow ------------ //

// Main Function using Link Component
export default function Footer() {
    // Important variables
    const d = new Date();
    let year = d.getFullYear();
    const { howToGetPPeCLink, chartPPeCLink, documentPPeC, smartContractPPeC } = useAppContext();

    // Return UI
    return (
        <footer className="container-fluid bg-dark text-white">
            {/* Section 1 */}
            <div className="row px-3 pt-3">

                {/* Twitter, GitHub, and Discord Page Links */}
                <div className="col-12 col-lg-3 p-1 text-center">
                    {/* Twitter Page */}
                    <Link
                        title="Twitter"
                        extendCSSClass="btn-dark mb-3 w-50 border-0"
                        icon="fa fa-twitter"
                        link="https://twitter.com/Paid_PerClick"
                    />

                    {/* Discord Page */}
                    <Link
                        title="Discord"
                        icon="fa fa-commenting-o"
                        extendCSSClass="btn-dark mb-3 w-50 border-0"
                        link="https://discord.gg/5uDdmRQk4N"
                    />

                    {/* Discord Page */}
                    <Link
                        title="Chart"
                        extendCSSClass="btn-dark mb-2 w-50 border-0"
                        link={chartPPeCLink}
                        icon="fa fa-line-chart"
                    />

                    {/* GitHub Page */}
                    <Link
                        title="GitHub"
                        extendCSSClass="btn-dark mb-2 w-50 border-0"
                        icon="fa fa-github"
                        link="https://github.com/PPeC-Foundation"
                    />

                    {/* GitHub Page */}
                    <Link
                        title="Medium"
                        extendCSSClass="btn-dark mb-2 w-50 border-0"
                        icon="fa fa-medium"
                        link="https://paidperclick.medium.com/"
                    />

                    {/* GitHub Page */}
                    <Link
                        title="Youtube"
                        extendCSSClass="btn-dark mb-2 w-50 border-0"
                        icon="fa fa-youtube-play"
                        link="https://www.youtube.com/channel/UC_hACIKej0DPhwOS5hTlrow"
                    />
                </div>

                {/* NFTs Page Links */}
                <div className="col-12 col-lg-3 p-1">

                    {/* AstroEmoji NFT */}
                    <Link
                        icon=""
                        extendCSSClass="w-100 mb-3"
                        title="AstroEmoji NFT"
                        link="https://opensea.io/assets/astroemojis"
                    />

                    {/* Digital Woodworks NFT */}
                    <Link
                        icon=""
                        extendCSSClass="w-100 mb-2"
                        title="Digital Woodworks NFT"
                        link="https://opensea.io/collection/digital-woodworks"
                    />
                </div>

                {/* Docs, and PPeC Address Links */}
                <div className="col col-lg-3 p-1">
                    {/* Docs */}
                    <Link
                        title="Docs"
                        icon=" "
                        extendCSSClass="w-100"
                        link={documentPPeC}
                    />

                    {/* PPeC Address */}
                    <Link
                        title="PPeC Address"
                        icon=" "
                        extendCSSClass="w-100 my-3"
                        link={smartContractPPeC}
                    />
                </div>

                {/* Buy PPeC, and Contracts Page Links */}
                <div className="col col-lg-3 p-1">
                    {/* Buy PPeC */}
                    <Link
                        extendCSSClass="w-100"
                        title="How to get $PPeC"
                        icon=" "
                        link={howToGetPPeCLink}
                    />

                    {/* PPeC Contract */}
                    <Link
                        icon=" "
                        title="PPeC Contract"
                        extendCSSClass="w-100 my-3"
                        link="https://github.com/PPeC-Foundation/ppec-erc20-contract/blob/main/ppec.sol"
                    />
                </div>
            </div>

            {/* Copyright */}
            <div className="row p-2 text-center border-top">
                <div className="col mx-auto text-center">
                    <p className="mb-0"> <b> <i className="fa fa-copyright"></i> PPeC Foundation. {year} </b> </p>
                </div>
            </div>
        </footer>
    );
}

// Link Component
function Link(props) {
    // Important variables 
    const { link, extendCSSClass, title, icon } = props;    

    // Return UI
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-outline-light ${extendCSSClass} `}
        >
            {/* Icon */}
            <i className={`${icon} mr-2`}></i>

            {/* Title */}
            <span> <b> { title } </b> </span>
        </a>
        );
}