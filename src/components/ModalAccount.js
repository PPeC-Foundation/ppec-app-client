// React Required --------------------------------------
import React, { useState } from 'react';
// Ampligy Required ------------------------------------
import { API } from "aws-amplify";
// Components ------------------------------------------
import LoaderButton from "./LoaderButton";
// Libs ------------------------------------------------
// usaAppContext stores - App.js - variables for the entire application
import { useAppContext } from "../libs/contextLib";
//------------------------------------------------------ \\
// This file is exported to ---> src/App.js
// we use "ads" ----> "SmAC"
// we use "myads" ----> "U|SmAC"
// -------------- Application Begins Bellow ------------ //

// Main Component
export default function ModalAccount() {
    // ----------------------------------------------------------------------
    // Important variables
    // ----------------------------------------------------------------------
    const { contractSmACCor, signer, defaultAccount, registered, balance, minBalance, approvedHash, accountHash, commify } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);

    // ----------------------------------------------------------------------
    // Initialize account to claim rewards
    // ----------------------------------------------------------------------
    async function handleInitialization() {
        // Start loading
        setIsLoading(true);

        try {

            // --------------------------------------------------------------
            // Get a random key for an approved hash
            // --------------------------------------------------------------
            function loadHash() {
                return API.get("hashes", `/hash/requestKey`);
            }
            // Save the random key
            const hash = await loadHash();

            // --------------------------------------------------------------
            // Get three random unapproved hashes (one) for the 
            // sender(two) other hashes for approval.
            // --------------------------------------------------------------
            function loadNewHash() {
                return API.get("hashes", `/hash/newHashes`); // for the new hash return the time and prefix only
            }
            // save the three hashes
            const hashes = await loadNewHash();

            // --------------------------------------------------------------
            // Connect the signer
            // --------------------------------------------------------------
            const SmACCorWithSigner = contractSmACCor.connect(signer);

            // --------------------------------------------------------------
            // Call transfer function in PPeC
            // --------------------------------------------------------------
            SmACCorWithSigner
                .getHash(hash[0].wordId, hashes[0].hashedWord, hashes[1].hashedWord, hashes[2].hashedWord)
                .then(() => {
                    // Once the transfer is successfull.
                    SmACCorWithSigner.once("GetHash", (event) => {
                        // Perform update in database
                        updateRequests(
                            hash[0].wordId,
                            hashes[0].createdAt,
                            hashes[0].prefix,
                            hashes[1].createdAt,
                            hashes[1].prefix,
                            hashes[2].createdAt,
                            hashes[2].prefix,
                        );
                    });
                })
                .catch((error) => {
                    // Set submitted to false if the user 
                    // rejects the transaction.
                    // 4001 : user rejected transaction error
                    if (error.code === 4001 || error.code === -32603) {
                        // Stop loading
                        setIsLoading(false);
                    }
                });

        } catch (e) {
            // Error Handling
            alert(e.message);

            // Stop loading
            setIsLoading(false);
        }
    }

    // ----------------------------------------------------------------------
    // Reinitialize account to claim rewards
    // If there is a problem with the current hash, the user can reset for 
    // a new hash.
    // ----------------------------------------------------------------------
    async function handleReinitialization() {
        // Start loading
        setIsLoading(true);

        try {

            // --------------------------------------------------------------
            // Get a random key for an approved hash
            // --------------------------------------------------------------
            function loadHash() {
                return API.get("hashes", `/hash/requestKey`);
            }
            // Save the random key
            const hash = await loadHash();

            // --------------------------------------------------------------
            // Get three random unapproved hashes (one) for the 
            // sender(two) other hashes for approval.
            // --------------------------------------------------------------
            function loadNewHash() {
                return API.get("hashes", `/hash/newHashes`); // for the new hash return the time and prefix only
            }
            // save the three hashes
            const hashes = await loadNewHash();

            // --------------------------------------------------------------
            // Connect the signer
            // --------------------------------------------------------------
            const SmACCorWithSigner = contractSmACCor.connect(signer);

            // --------------------------------------------------------------
            // Call transfer function in PPeC
            // --------------------------------------------------------------
            SmACCorWithSigner
                .resetHash(hash[0].wordId, hashes[0].hashedWord, hashes[1].hashedWord, hashes[2].hashedWord)
                .then(() => {
                    // Once the transfer is successfull.
                    SmACCorWithSigner.once("GetHash", (event) => {
                        // Perform update in database
                        updateRequests(
                            hash[0].wordId,
                            hashes[0].createdAt,
                            hashes[0].prefix,
                            hashes[1].createdAt,
                            hashes[1].prefix,
                            hashes[2].createdAt,
                            hashes[2].prefix,
                        );
                    });
                })
                .catch((error) => {
                    // Set submitted to false if the user 
                    // rejects the transaction.
                    // 4001 : user rejected transaction error
                    if (error.code === 4001 || error.code === -32603) {
                        // Stop loading
                        setIsLoading(false);
                    }
                });

        } catch (e) {
            // Error Handling
            alert(e.message);

            // Stop loading
            setIsLoading(false);
        }
    }

    // ----------------------------------------------------------------------
    // Performing important updates to database
    // ----------------------------------------------------------------------
    async function updateRequests(key, signerTime, signerPrefix, timeA, prefixA, timeB, prefixB) {

        // (1) Remove _ the revealed hash from our database
        await deleteHash(key);
        // (2) Set _ a new hash for the default account
        await setDefaultAccountHash({ "time": signerTime, "prefix": signerPrefix, "address": defaultAccount });
        // (3) Update _ approved hashes status
        await setApprovedHash({ timeA, prefixA, timeB, prefixB });
        // (4) Generate _ new hashes
        await createHash();

        // Reload the page
        window.location.reload();
    }

    // ----------------------------------------------------------------------
    // Updating hash with a new account in DynamoDB
    // ----------------------------------------------------------------------
    function setDefaultAccountHash(items) {
        return API.put("hashes", `/hash/newUserHash`, {
            body: items
        });
    }

    // ----------------------------------------------------------------------
    // Updating new hash status in DynamoDB
    // ----------------------------------------------------------------------
    function setApprovedHash(items) {
        return API.put("hashes", `/hash/newApprovedHash`, {
            body: items
        });
    }

    // ----------------------------------------------------------------------
    // Deleting hash from DynamoDB
    // ----------------------------------------------------------------------
    function deleteHash(hash) {
        // Delete post based on "id" - Current user
        return API.del("hashes", `/hash/del/${hash}`);
    }

    // ----------------------------------------------------------------------
    // Creating/Generating a new hash for DynamoDB
    // ----------------------------------------------------------------------
    function createHash(items) {
        // Create a post
        return API.post("hashes", "/hash/create", {
            body: items
        });
    }

    // ----------------------------------------------------------------------
    // Return UI
    // Display the register notification only if :
    // (1) Default account is not registered
    // (2) Default account has the minimum required balance
    // ----------------------------------------------------------------------
    return (
        <div className={`modal fade`} id="accountInformation">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    {/* Modal Header */}
                    <div className="modal-header">
                        {/* Heading */}
                        <div className="btn-group">
                            {/* Link */}
                            <div 
                                className={`btn mb-3 mb-lg-0 border border-dark btn-light`}
                            >
                                {/* name */}
                                <strong> Account </strong>
                            </div>

                            {/* Disabled Link */}
                            <div 
                                className={`btn mb-3 mb-lg-0 border border-dark btn-success`}
                            >
                                {/* name */}
                                <strong> Connected </strong>
                            </div>
                        </div>

                        {/* Button - Close */}
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body pb-0">
                        {/* Account status Alert */}
                        <div className={`alert border ${Number(balance) >= Number(minBalance) ? "" : "d-none"} ${approvedHash === true ? "alert-success border-success" : "alert-danger border-danger"}`}>
                            <small>
                                <i className="fa fa-exclamation-triangle"></i>
                                {approvedHash === true
                                    ? <strong> Your account's claiming status is active </strong>
                                    : <strong> Initialize your account and start claiming rewards </strong>
                                }
                                
                            </small>
                        </div>

                        <div className={`alert border ${Number(balance) >= Number(minBalance) ? "d-none" : "alert-warning border-warning"}`}>
                            <small>
                                <i className="fa fa-exclamation-triangle"></i>
                                <strong> You need {commify(minBalance)} PPeC to Initialize your address </strong>
                            </small>
                        </div>

                        {/* 
                            * -------------------------------------------------------------------------------------->
                            * Title Input Field
                            * -------------------------------------------------------------------------------------->
                            * */}
                        <div className="form-floating mb-3">
                            {/* Input */}
                            <input 
                                id="account"
                                type="text"
                                name="account"
                                disabled="disabled"
                                value={defaultAccount === null ? "" : defaultAccount}
                                className="form-control"
                            />

                            {/* Label */}
                            <label htmlFor="title"> Account </label>

                            {/* Info */}
                            <small className={``}>
                                    Your current account address
                            </small>
                        </div>

                        {/* 
                            * -------------------------------------------------------------------------------------->
                            * Promotion Link Input Field
                            * -------------------------------------------------------------------------------------->
                            * */}
                        <div className={`form-floating my-3`}>
                            {/* Input */}
                            <input
                                id="hash"
                                type="text"
                                name="hash"
                                value={accountHash === false ? "N/A" : accountHash}
                                disabled="disabled"
                                className={`form-control ${accountHash === false ? "border border-danger" : ""}`}
                            />

                            {/* Label */}
                            <label htmlFor="link"> Hash </label>

                            {/* Info */}
                            <small className={`${accountHash === false ? "text-danger" : ""}`}>
                                {accountHash === false
                                    ? "Initialize your address to get a claiming hash"
                                    : "Your current claiming hash"
                                }                                
                            </small>
                        </div>

                        <div className="form-floating my-3">
                            {/* Input */}
                            <input
                                id="status"
                                type="text"
                                name="status"
                                value={approvedHash === true ? "Active" : "Inactive"}
                                disabled="disabled"
                                className={`form-control ${accountHash === false ? "border border-danger" : ""}`}
                            />

                            {/* Label */}
                            <label htmlFor="link"> Status </label>

                            {/* Info */}
                            <small className={`${approvedHash === false ? "text-danger" : ""}`}>
                                
                                {accountHash === false
                                    ? "Your current claiming status is inactive"
                                    : "Your current claiming status"
                                }
                            </small>
                        </div>

                        {/* Modal Footer */}
                        <div className="modal-footer">
                                {/* Button - Submit */}
                                {approvedHash === true || (registered === true && Number(balance) >= Number(minBalance))
                                    ? <LoaderButton
                                        type="button"
                                        isLoading={isLoading}
                                    onClick={() => handleReinitialization()}
                                    className={`btn btn-danger alert-danger border border-danger ${approvedHash ? "disabled" : ""}`}
                                    >
                                        {!isLoading
                                            // when not loading
                                            ? <strong> Reinitialize </strong>
                                            // when loading
                                            : <strong> Reinitializing </strong>
                                        }
                                    </LoaderButton>

                                    // Disable the button if the account is not registered
                                    // and when it does not have the minimum required balance
                                    : <LoaderButton
                                        type="button"
                                        isLoading={isLoading}
                                        onClick={() => handleInitialization()}
                                        className={`btn btn-primary border border-dark shadow-sm ${registered === false && Number(balance) >= Number(minBalance) ? "" : "disabled"}`}
                                    >
                                        {!isLoading
                                            // when not loading
                                            ? <strong> Initialize </strong>
                                            // when loading
                                            : <strong> Initializing </strong>
                                        }
                                    </LoaderButton>
                                }
                        
                        
                            {/* Button - Close */}
                            <button type="button" className="btn btn-danger border border-dark" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}