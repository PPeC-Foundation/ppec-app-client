// React Required --------------------------------------
import React from 'react';
// Amplify required ------------------------------------
import { Storage } from "aws-amplify";
// Libs ------------------------------------------------
// usaAppContext stores - App.js - variables for the entire application
import { useAppContext } from "../libs/contextLib";
// Dummy Image -----------------------------------------
//import defaultImage from "../ads.png";
//------------------------------------------------------ \\
// This file is exported to all container
// we use "ads" ----> "SmAC"
// we use "myads" ----> "U|SmAC"
// -------------- Application Begins Bellow ------------ //

// Main Component
export default function Card(props) {
    // Important variables
    const bucket = "https://" + Storage._config.AWSS3.bucket + process.env.REACT_APP_AWS_BUCKET_FILE;
    const { commify } = useAppContext();
    const {
        id,
        title,
        claim,
        button,
        coffer,
        closed,
        reclaimPPeC,
        contractAddr,
        unpledgePPeC,
        isFundedRunning,
        notFundedRunning,
    } = props;
    // css extended class for buttons
    let extClass = "btn rounded-0 rounded-end border w-100 h-100 py-1 px-2";

// ----------------------------------------------------------------------
    // Return UI
    return (
        <div className="col-12 col-lg-3 col-md-4 p-1 mb-3 d-block" key={id}>
            <div className="text-dark h-100">
                <article id="Card" className="card border-0 h-100">

                    {/* Image */}
                    <img
                        alt={contractAddr}
                        src={bucket + contractAddr}
                        className="rounded w-100 border border-dark shadow-sm"
                        title={contractAddr}
                    />

                    {/* Card Body - Heading / Title */}
                    <div className="card-body py-2 border-0 px-0">
                        <p className="m-0">
                            <b> {title} </b>
                        </p>
                    </div>

                    {/* Card Footer - Button & Value */}
                    <div className="card-footer p-0 bg-white border-0">
                        <div className="row m-0">
                            {/* Value */}
                            <div className="col-7 border border-end-0 rounded-start py-1">
                                <span className=""> <b> {isFundedRunning ? commify(coffer) : commify(claim)} PPeC </b> </span>
                            </div>

                            {/* Card Buttons - Rendered per conditions */}
                            <div className="col-5 p-0">
                                {/* 
                                 * -------------------------------------------------------------------------------------->
                                 * Button for ---> Bounty.js, Ads.js
                                 * -------------------------------------------------------------------------------------->
                                 * */}
                                {button === "bounty" || button === "ads"
                                    ? <ButtonClaim id={id} extClass={extClass} />
                                    : null
                                }

                                {/* 
                                 * -------------------------------------------------------------------------------------->
                                 * Button for ---> Digest.js
                                 * -------------------------------------------------------------------------------------->
                                 * */}
                                {button === "digest"
                                    ? <ButtonDigest id={id} extClass={extClass} />
                                    : null
                                }

                                {/* 
                                 * -------------------------------------------------------------------------------------->
                                 * Button for ---> MyAds.js
                                 * -------------------------------------------------------------------------------------->
                                 * */}
                                {button === "myAds"
                                    ? <ButtonMyAds
                                        id={id}
                                        closed={closed}
                                        extClass={extClass}
                                        unpledgePPeC={unpledgePPeC}
                                        reclaimPPeC={reclaimPPeC}
                                        isFundedRunning={isFundedRunning}
                                        notFundedRunning={notFundedRunning}
                                    />
                                    : null
                                }                                
                            </div>
                        </div>
                    </div>
                </article>
            </div>            
        </div>
    );
}

// ----------------------------------------------------------------------
// ButtonBounty Component
// for Ads.js [Card]
// for BountyAds.js [Card]
// ----------------------------------------------------------------------
function ButtonClaim(props) {
    // Important variables
    const { id, extClass } = props;

    // Return UI
    return (
        <button
            type="button"
            data-bs-toggle="modal"
            data-bs-target={`#promotion${id}`}
            className={`btn-primary border-dark shadow-sm ${extClass}`}
        >
            {/* icon */}
            <i className={``}></i>

            {/* text */}
            <span className={``}>
                <b> CLAIM </b>
            </span>

        </button>
        );
}

// ----------------------------------------------------------------------
// ButtonDigest Component
// for Digest.js [Card]
// ----------------------------------------------------------------------
function ButtonDigest(props) {
    // Important variables
    const { id, extClass } = props;

    // Return UI
    return (
        <button
            type="button"
            data-bs-toggle="modal"
            data-bs-target={`#promotion${id}`}
            className={`btn-primary alert-primary border-primary shadow-sm ${extClass}`}
        >
            {/* icon */}
            <i className={`fas fa-broadcast-tower`}></i>

            {/* text */}
            <span className={``}>
                <b> NEXT </b>
            </span>

        </button>
    );
}

// ----------------------------------------------------------------------
// ButtonMyAds Component
// for MyAds.js [Card]
// ----------------------------------------------------------------------
function ButtonMyAds(props) {
    // Important variables
    const { id, unpledgePPeC, reclaimPPeC, closed, isFundedRunning, notFundedRunning, extClass } = props;
    // Important css variables
    let expiredClass = (reclaimPPeC ? "btn-danger border-dark" : "");
    let unfundedClass = (notFundedRunning ? "btn-primary border-dark" : "");
    let finishedClass = (closed ? "alert-light btn-secondary bordertext-dark" : "");
    let closedClass = (unpledgePPeC ? "alert-danger btn-danger border border-dark" : "");
    let runningClass = (isFundedRunning ? "alert-primary btn-primary border border-dark" : "");

    // Return UI
    return (
        <button
            type="button"
            data-bs-toggle="modal"
            data-bs-target={`#promotion${id}`}
            className={`${extClass} ${runningClass} ${closedClass} ${expiredClass} ${finishedClass} ${unfundedClass}`}
        >
            {/* icon */}
            <i className={``}></i>

            {/* text */}
            <span className={``}>
                {closed ? <b> CLOSED </b> : null}
                {reclaimPPeC ? <b> RECLAIM  </b> : null}
                {unpledgePPeC ? <b> UNPLEDGE </b> : null}
                {notFundedRunning ? <b> FUND </b> : null}
                {isFundedRunning ? <b> FUNDED </b> : null}
            </span>

        </button>
    );
}
