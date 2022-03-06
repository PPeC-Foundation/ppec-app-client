// React Required --------------------------------------
import React, { Fragment, useState } from 'react';
// Components ------------------------------------------
import LoaderButton from "./LoaderButton";
// Libs ------------------------------------------------
// usaAppContext stores - App.js - variables for the entire application
import { useAppContext } from "../libs/contextLib";
//------------------------------------------------------ \\
// This file is exported to all containers
// we use "ads" ----> "SmAC"
// we use "myads" ----> "U|SmAC"
// -------------- Application Begins Bellow ------------ //

// ----------------------------------------------------------------------
// Main Component
// Displays more information about each SmAC
// ----------------------------------------------------------------------
export default function Modal(props) {
    // Important variables
    const { commify, ethers, signer, abiSmaC, founder, defaultAccount } = useAppContext();
    const [hasReported, setHasReported] = useState(false);
    const [isReporting, setIsReporting] = useState(false);
    const {
        id,
        link,
        title,
        claim,
        reward,
        budget,
        button,
        coffer,
        closed,
        created,
        expired,
        claimers,
        promoter,
        isLoading,
        canReport,
        hasClaimed,
        isClaiming,
        scamReport,
        isCleaning,
        reclaimPPeC,
        handleClaim,
        hasSubmitted,
        unpledgePPeC,
        contractAddr,
        handleDestroy,
        handleTransfer,
        isFundedRunning,
        notFundedRunning,
        handleClaimBounty
    } = props;
    // Dates variables
    const createdOn = new Date(created * 1000);
    const expiredOn = new Date(expired * 1000);
    const createdAt = createdOn.toLocaleString();
    const expiredAt = expiredOn.toLocaleString();
    // Extended variables
    const today = Date.now();
    const hasExpired = (today >= (expired * 1000)); // Ad has expired

// ----------------------------------------------------------------------
    // Report smart ad as a scam
// ----------------------------------------------------------------------
    function handleScamReport(contractAddr) {
        // Disable the submit button to avoid multiple requests
        setHasReported(true);
        setIsReporting(true);

        try {
            // Create a new contract
            const contractSmAC = new ethers.Contract(contractAddr, abiSmaC, signer);
            // Connect the signer to the contract
            const SmACWithSigner = contractSmAC.connect(signer);

            // Call scamReport() function in SmAC
            SmACWithSigner
                .scamReport()
                .then(() => {
                    // Reload the page when the call is successfull.                    
                    SmACWithSigner.once("ScamReport", (event) => {
                        window.location.reload();
                    });
                })
                .catch((error) => {
                    // Set submitted to false if the user 
                    // rejects the transaction.
                    if (error.code === 4001) {
                        setHasReported(false);
                        setIsReporting(false);
                    }
                });

        } catch (e) {
            // Error Handling
            alert(e.message);
            setIsReporting(false);
        }
    }

// ----------------------------------------------------------------------
    // Return UI
    return (
        <div className={`modal fade`} id={`promotion${id}`} aria-labelledby={title} aria-describedby="Promotional ad">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    {/* Modal Header */}
                    <div className="modal-header">
                        {/* Heading */}
                        <h4 className="modal-title">
                            <small className="px-2 mx-1 border rounded text-secondary">headline</small>
                            <small> { title } </small>
                        </h4>

                        {/* Button - Close */}
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body"> 
                        {/* 
                         * ---------------------------------------------------------------------------------->
                         * Overfunding Alert 
                         * ---------------------------------------------------------------------------------->
                         * */}
                        {notFundedRunning
                            ? <div className="alert alert-danger border border-danger">
                                <small>
                                    <i className="fa fa-exclamation-triangle"></i>
                                    <strong> Do not send multiple funding requests for a single SmAC. </strong>
                                </small>
                            </div>
                            : null
                        }

                        {/* Promotion Link */}
                        <div className="form-floating mb-3">
                            <span className="form-control" style={{ userSelect : "none" }}> {link} </span>
                            <label htmlFor="budget"> Link </label>
                        </div>

                        <a
                            href={`http://google.com/safebrowsing/diagnostic?site=${link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`btn btn-warning mb-3 w-100 border border-secondary shadow-sm ${button === "bounty" || button === "ads" || button === "digest" ? "" : "d-none"} `}
                        >
                            <i className="fa fa-exclamation-triangle"></i>
                            <b> Check link safety on Google </b>
                        </a>

                        {/* Reward, Coffer, Budget */}
                        <div className="row">                                
                            {/* Reward */}
                            <Tab type={reward} title={`Reward PPeC`} commifyType={reward === false ? null : commify(reward)} />  
                            
                            {/* Coffer */}
                            <Tab type={coffer} title={`Coffer PPeC`} commifyType={coffer === false ? null : commify(coffer)} />  
                            
                            {/* Budget */}
                            <Tab type={budget} title={`Budget PPeC`} commifyType={budget === false ? null : commify(budget)} />                              
                        </div>           
                        
                        {/* Claimers, Scam Report */}
                        <div className="row">                                
                            {/* Claimers */}
                            <Tab type={claimers} title={`Claimers`} commifyType={claimers} />  

                            {/* Scam Report */}
                            <Tab type={scamReport} title={`Scam Report`} commifyType={scamReport} />  
                        </div>

                        {/* Promoter Address, Contract Address, Created, Expired */}
                        <div className="row">
                            {/* Promoter Address */}
                            <Tab type={promoter} title={`Promoter Address`} commifyType={promoter} />  

                            {/* Contract Address */}
                            <Tab type={contractAddr} title={`Contract Address`} commifyType={contractAddr} />

                            {/* Created */}
                            <div className={`col-6`}>
                                <div className="form-floating">
                                    <span className="form-control"> {createdAt} </span>
                                    <label htmlFor="budget"> Created </label>
                                </div>
                            </div>

                            {/* Expired */}
                            <div className="col-6">
                                <div className="form-floating">
                                    <span className="form-control"> {expiredAt} </span>
                                    <label htmlFor="expired" className={`${hasExpired ? "text-danger" : null}`}> {hasExpired ? "Expired" : "Expiration"} </label>
                                </div>
                            </div>
                        </div> 
                    </div>

                    {/* Modal Footer - Buttons rendered per containers */}
                    <div className="modal-footer">
                        {/*
                         * ---------------------------------------------------------------------------->
                         * ButtonBounty Component 
                         * ---------------------------------------------------------------------------->
                         * */}
                        {button === "bounty"
                            // Display button
                            ? <ButtonBounty
                                claim={claim}
                                isCleaning={isCleaning}
                                handle={handleClaimBounty}
                                contractAddr={contractAddr}
                                hasSubmitted={hasSubmitted}
                            />
                            // Display nothing
                            : null
                        }
                        
                        {/* 
                         * ---------------------------------------------------------------------------->
                         * ButtonAds Component 
                         * ---------------------------------------------------------------------------->
                         * */}
                        {button === "ads"
                            // Display button
                            ? <ButtonAds
                                link={link}
                                claim={claim}
                                closed={closed}
                                handle={handleClaim}
                                hasExpired={hasExpired}
                                hasClaimed={hasClaimed}
                                isClaiming={isClaiming}
                                reclaimPPeC={reclaimPPeC}
                                hasReported={hasReported}
                                contractAddr={contractAddr}
                                hasSubmitted={hasSubmitted}
                                isFundedRunning={isFundedRunning}
                                notFundedRunning={notFundedRunning}
                            />
                            // Display nothing
                            : null
                        }

                        {/* 
                         * ---------------------------------------------------------------------------->
                         * ButtonMyAds Component 
                         * ---------------------------------------------------------------------------->
                         * */}
                        {button === "myAds"
                            // Display button
                            ? <ButtonMyAds
                                id={id}
                                claim={claim}
                                closed={closed}
                                budget={budget}
                                isLoading={isLoading}
                                reclaimPPeC={reclaimPPeC}
                                contractAddr={contractAddr}
                                hasSubmitted={hasSubmitted}
                                handleDestroy={handleDestroy}
                                handleTransfer={handleTransfer}
                                isFundedRunning={isFundedRunning}
                                notFundedRunning={notFundedRunning}
                                unpledgePPeC={unpledgePPeC}
                            />
                            // Display nothing
                            : null
                        }

                        {/* 
                         * ---------------------------------------------------------------------------->
                         * ButtonReportScam Component
                         * ---------------------------------------------------------------------------->
                         * */}
                        {canReport
                            // Display button
                            ? <ButtonReportScam
                                hasClaimed={hasClaimed}
                                isReporting={isReporting}
                                hasReported={hasReported}
                                contractAddr={contractAddr}
                                handleScamReport={handleScamReport}
                            />
                            // Display nothing
                            : null
                        }

                        {/* Button - Close */}
                        
                        <button
                            type="button"
                            className={`btn btn-danger border border-dark ${founder === defaultAccount ? "" : "d-none"} `}
                            data-bs-dismiss="modal"
                        >
                            <span> Scam </span>
                        </button>

                        <button type="button" className="btn btn-danger border border-dark" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// Tab Component
// ----------------------------------------------------------------------
function Tab(props) {
    // Important variables
    const { type, title, commifyType } = props;

    // Return UI
    return (
        <div className={`col ${type === false ? "d-none" : null}`}>
            <div className="form-floating mb-3">
                <span className="form-control"> {commifyType} </span>
                <label htmlFor="budget"> { title } </label>
            </div>
        </div>
        );
}

// ----------------------------------------------------------------------
// ButtonAds Component 
// for Ads.js [Modal]
// ----------------------------------------------------------------------
function ButtonAds(props) {
    // Important variables
    const { balance, minBalance, buyPPeCLink, commify, registered } = useAppContext();
    const {
        link,
        claim,
        handle,
        isClaiming,
        hasClaimed,
        hasReported,
        hasSubmitted,
        contractAddr
    } = props;

    // Return UI
    return (
        <Fragment>
            {Number(balance) < Number(minBalance)
                // ----------------------------------------------------------------------------------
                // Display when address has less token than minBalance required
                // ----------------------------------------------------------------------------------
                ? <a
                    href={buyPPeCLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn btn-primary border border-dark`}
                >
                    <strong> YOU NEED </strong>
                    <strong className="badge border border-info shadow"> {commify(minBalance)} PPeC </strong>
                    <strong> TO CLAIM </strong>
                </a>

                // ----------------------------------------------------------------------------------
                // Display when address has the minBalance required
                // ----------------------------------------------------------------------------------
                : <div>
                    {hasClaimed === true
                        // --------------------------------------------------------------------------
                        // After reward is claimed
                        // --------------------------------------------------------------------------
                        ? <div className="btn alert-primary rounded border border-primary disabled">
                            <b> CLAIMED </b>
                        </div>

                        // --------------------------------------------------------------------------
                        // Before reward is claimed
                        // --------------------------------------------------------------------------
                        : <LoaderButton
                            type="button"
                            isLoading={isClaiming}
                            onClick={() => handle(contractAddr, link)}
                            className={`btn btn-primary border border-dark ${hasSubmitted || hasReported || !registered ? "disabled" : null}`}
                        >
                            {/* Title */}
                            <span>
                                {hasSubmitted
                                    ? <strong> CLAIMING </strong>
                                    : <strong> {registered === false ? "Initialize Address to Claim" : "CLAIM"} </strong>
                                }
                            </span>

                            {/* Reward */}
                            <span className={`badge border border-info shadow ${registered === false ? "d-none" : ""}`}>
                                {commify(claim)} PPeC
                            </span>
                        </LoaderButton>
                    }
                </div>
            }
            
        </Fragment>
        );
}

// ----------------------------------------------------------------------
// ButtonBounty Component
// for Bounty.js [Modal]
// ----------------------------------------------------------------------
function ButtonBounty(props) {
    // Important variables
    const { balance, minBalance, buyPPeCLink, commify } = useAppContext();
    const {
        claim,
        handle,
        isCleaning,
        contractAddr,
        hasSubmitted
    } = props;

    // Return UI
    return (
        <Fragment>
            {Number(balance) < Number(minBalance)
                // Display when address has less token than minBalance required
                ? <a
                    href={buyPPeCLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn btn-primary border border-dark`}
                >
                    <strong> YOU NEED </strong>
                    <strong className="badge border border-info shadow"> {commify(minBalance)} PPeC </strong>
                    <strong> TO CLAIM </strong>
                </a>

                // Display when address as the minimum token balance required
                : <LoaderButton
                    type="button"
                    isLoading={isCleaning}
                    onClick={() => handle(contractAddr)}
                    className={`btn btn-primary border border-dark ${hasSubmitted ? "disabled" : null}`}
                >
                    {/* Action */}
                    {hasSubmitted
                        ? <strong> CLAIMING </strong>

                        : <strong> CLAIM </strong>
                    }
                    <strong className="badge border border-info shadow"> {commify(claim)} PPeC </strong>

                </LoaderButton>
            }
        
        </Fragment>
        );
}

// ----------------------------------------------------------------------
// ButtonReportScam Component
// This button is use in modals to report scams
// for Ads.js [Modal]
// for Digest.js [Modal]
// ----------------------------------------------------------------------
function ButtonReportScam(props) {
    // Important variables
    const { balance, minBalance } = useAppContext();
    const {
        hasClaimed,
        isReporting,
        hasReported,
        contractAddr,
        handleScamReport
    } = props;

    // Return UI
    return (
        <Fragment>
            {Number(balance) < Number(minBalance)
                // Display when address has less token than minBalance required
                ? null

                : <LoaderButton
                    isLoading={isReporting}
                    onClick={() => handleScamReport(contractAddr)}
                    className={`btn btn-warning border border-dark ${hasClaimed || hasReported ? "disabled" : null}`}
                >
                    <strong> Report Scam </strong>
                </LoaderButton>
            }            
        </Fragment>
        );
}

// ----------------------------------------------------------------------
// ButtonMyAds Component
// for MyAds.js [Modal]
// ----------------------------------------------------------------------
function ButtonMyAds(props) {
    // Important variables
    const { commify } = useAppContext();
    const {
        id,
        claim,
        closed,
        budget,
        isLoading,
        reclaimPPeC,
        hasSubmitted,
        contractAddr,
        handleDestroy,
        handleTransfer,
        isFundedRunning,
        notFundedRunning,
        unpledgePPeC
    } = props;

    const modalId = "promotion" + id;

    // Return UI
    return (
        <Fragment>
            {/* When the smart ad is funded */}
            {isFundedRunning
                // --------------------------------------------------------------------------
                // A button is returned
                // --------------------------------------------------------------------------
                ? <div className="btn alert-primary rounded border border-primary disabled">
                    <b> FUNDED </b>
                </div>

                // --------------------------------------------------------------------------
                // No button is returned
                // --------------------------------------------------------------------------
                : null
            }

            {/* When the smart ad was closed by the promoter */}
            {closed
                // --------------------------------------------------------------------------
                // A button is returned
                // --------------------------------------------------------------------------
                ? <div className="btn alert-dark rounded border border-dark disabled">
                    <span></span>
                    <b> FINISHED </b>
                </div>

                // --------------------------------------------------------------------------
                // No button is returned
                // --------------------------------------------------------------------------
                : null
            }

            {/* When the smart ad is not funded */}
            {notFundedRunning
                // --------------------------------------------------------------------------
                // A button is returned
                // --------------------------------------------------------------------------
                ? <LoaderButton
                    type="submit"
                    isLoading={isLoading}
                    onClick={() => handleTransfer(contractAddr, claim, modalId)}
                    className={`btn btn-primary border border-dark ${hasSubmitted ? "disabled" : null}`}
                >
                    <b>                       
                        
                        {/* Action */}
                        {hasSubmitted
                            ? <strong> FUNDING </strong>
                            : <strong> FUND </strong>
                        }
                        {/* Amount */}
                        <strong className="badge border border-info shadow"> {commify(claim)} PPeC </strong>
                    </b>
                </LoaderButton>

                // --------------------------------------------------------------------------
                // No button is returned
                // --------------------------------------------------------------------------
                : null
            }

            {/* When the smart ad has expired and waiting for promoter to reclaim funds */}
            {reclaimPPeC || unpledgePPeC

                // --------------------------------------------------------------------------
                // A button is returned
                // --------------------------------------------------------------------------
                ? <LoaderButton
                    type="submit"
                    isLoading={isLoading}
                    onClick={() => handleDestroy(contractAddr, claim)}
                    className={`btn btn-primary border border-dark ${hasSubmitted ? "disabled" : null}`}
                >
                    <b>
                        {/* Display for reclaim */}
                        {reclaimPPeC
                            ? <span>
                                {hasSubmitted
                                    ? <span>
                                        <small> <i className="spinner-border text-light spinner-border-sm"></i> </small>
                                        <strong> RECLAIMING </strong>
                                    </span>
                                    : <strong> RECLAIM </strong>
                                }
                                <span className="badge border border-info shadow"> {commify(claim)} PPeC </span>
                            </span>
                            : null
                        }

                        {/* Display for unpledge */}
                        {unpledgePPeC

                            // ----------------------------------------------------------------
                            // A button is returned
                            // ----------------------------------------------------------------
                            ? <span>
                                {hasSubmitted
                                    ? <span>
                                        <small> <i className="spinner-border text-light spinner-border-sm"></i> </small>
                                        <strong> UNPLEDGING </strong>
                                    </span>
                                    : <strong> UNPLEDGE </strong>
                                }
                                <span className="badge border border-info shadow"> {commify(budget)} PPeC </span>
                            </span>

                            // ----------------------------------------------------------------
                            // No button is returned
                            // ----------------------------------------------------------------
                            : null
                        }
                    </b>
                </LoaderButton>

                // --------------------------------------------------------------------------
                // No button is returned
                // --------------------------------------------------------------------------
                : null
            }

        </Fragment>
        );
}