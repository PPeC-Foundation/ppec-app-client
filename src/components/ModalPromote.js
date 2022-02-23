// React Required --------------------------------------
import React, { useRef, useState } from 'react';
// Libs ------------------------------------------------
import { s3Upload } from "../libs/awsLib";
import { useFields } from "../libs/hooksLib";
import { useAppContext } from "../libs/contextLib";
// AWS Config ------------------------------------------
import config from "../config";
//------------------------------------------------------ \\
// This file is exported to ---> src/App.js
// we use "ads" ----> "SmAC"
// we use "myads" ----> "U|SmAC"
// -------------- Application Begins Bellow ------------ //

// Main Component
export default function ModalPomote() {
    // Global variables
    const {
        signer,
        ethers,
        commify,
        pledged,
        balance,
        minReward,
        buyPPeCLink,
        contractSmACCor,
    } = useAppContext();
    // Input fields
    const [fields, handleFieldChange] = useFields({
        link: "",
        title: "",
        reach: 0,
        reward: 0
    });
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const budget = fields.reach * fields.reward;
    const budgetAndPledged = budget + Number(pledged);
    const [image, setImage] = useState(null);
    const file = useRef(null);

// ----------------------------------------------------------------------
    // Handling Uploaded Images
// ----------------------------------------------------------------------
    function handleImage(event) {
        // Getting the current file at fisrt target [0]: "file"
        file.current = event.target.files[0];
        // Set image1, create an object url to display uploaded image
        setImage(file.current != null ? URL.createObjectURL(file.current) : null);
    }

// ----------------------------------------------------------------------
    // Validate user inputs
// ----------------------------------------------------------------------
    function validateForm() {
        return (
            fields.reach > 0 &&
            fields.link.length > 0 &&
            fields.reward >= Number(minReward) &&
            fields.title.length <= 30 &&
            fields.title.length > 0 &&
            (file.current && file.current.size <= config.MAX_ATTACHMENT_SIZE) &&
            budgetAndPledged < balance
        );
    }

// ----------------------------------------------------------------------
    // Handling submitted data
// ----------------------------------------------------------------------
    async function handleNewAd(event) {
        event.preventDefault();

        // Checking images' size
        if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
            alert(
                `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
                1000000} MB. Main Image`
            );
            return;
        }

        // Disable the submit button to avoid multiple requests
        setHasSubmitted(true);

        try {

            // Connect the signer
            const SmACCorWithSigner = contractSmACCor.connect(signer);
            // Set the reward
            const reward = ethers.utils.parseUnits(fields.reward, 18);

            // Call launchAd() function in SmACCor
            SmACCorWithSigner
                .launchAd(fields.title, fields.link, fields.reach, reward)
                .then(() => {
                    // When the call is successfull add the image to the database
                    // Do not change the order event(...,...,...)
                    SmACCorWithSigner.once("LaunchAd", (link, title, reach, reward, budget, created, promoter, adsContract) => {
                        addImage(adsContract);
                    });
                })
                .catch((error) => {
                    // Set submitted to false if the user 
                    // rejects the transaction.
                    // 4001 : user rejected transaction error
                    if (error.code === 4001) {
                        setHasSubmitted(false)
                    }
                });

        } catch (e) {
            // Error Handling
            alert(e);            
        }
    }

// ----------------------------------------------------------------------
    // Add Image to the database
// ----------------------------------------------------------------------
    async function addImage(adsContract) {
        // Display loading icon
        setIsLoading(true);

        try {
            // Putting the image in s3
            await s3Upload(file.current, adsContract);            
            // Redirect to myads
            window.location.href = `/myads`;

        } catch (e) {
            // Error Handling
            alert(e);
        }

        // Stop loading
        setIsLoading(false);
    }

// ----------------------------------------------------------------------
    // Return UI
    return (
        <div className={`modal fade`} id="promote">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    {/* Modal Header */}
                    <div className="modal-header">
                        {/* Heading */}
                        <div className="btn-group">
                            {/* Link */}
                            <a
                                href="https://paidperclick.gitbook.io/ppec-docs/guides/promote"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`btn mb-3 mb-lg-0 border border-dark btn-dark text-warning`}
                            >
                                {/* icon */}
                                <i className="far fa-file-alt"></i>

                                {/* name */}
                                <strong> Promote </strong>
                                <i className="fas fa-external-link-alt"></i>
                            </a>

                            {/* Disabled Link */}
                            <a
                                href={`#${fields.title}`}
                                className={`btn mb-3 mb-lg-0 border border-dark disabled alert-secondary`}
                            >
                                {/* name */}
                                <strong> {fields.title} </strong>
                            </a>
                        </div>

                        {/* Button - Close */}
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body">
                        {/* Image failure Alert */}
                        <div className="alert alert-danger border border-danger">                            
                            <small>
                                <i className="fas fa-exclamation-triangle"></i>
                                <strong> Do not refresh the page while your request is processing. </strong>
                            </small>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleNewAd}>

                            {/* 
                             * -------------------------------------------------------------------------------------->
                             * Image - Display when there is no image uploaded
                             * -------------------------------------------------------------------------------------->
                             * */}
                            <span className={`d-block p-5 border mb-3 rounded ${image === null ? "d-flex justify-content-center" : "d-none"}`}>
                                <i className="far fa-image" style={{ fontSize: "3rem" }}></i>
                            </span>

                            {/* 
                             * -------------------------------------------------------------------------------------->
                             * Image upload - Dislpay the uploaded image
                             * -------------------------------------------------------------------------------------->
                             * */}
                            <img
                                title="upload"
                                alt="upload"
                                src={image === null ? null : image}
                                className={`mb-3 rounded ${image === null ? "d-none" : "align-self-center"}`}
                            />

                            {/* 
                             * -------------------------------------------------------------------------------------->
                             * Image Input Field
                             * -------------------------------------------------------------------------------------->
                             * */}
                            <div className="form-group mb-3">
                                {/* Input Field */}
                                <input
                                    required={image === null ? null : "required"}
                                    accept="image/*"
                                    type="file"
                                    name="image"
                                    id="image"
                                    onChange={handleImage}
                                    className="p-0 m-0 btn btn-primary"
                                />

                                {/* Label */}
                                <small className={`d-block ${image === null || (file.current && file.current.size) > config.MAX_ATTACHMENT_SIZE ? "text-danger" : "text-success"}`}>
                                    Aspect ratio (16:9 Widescreen). The image must be less than 1MB. 
                                    {file.current && file.current.size > config.MAX_ATTACHMENT_SIZE
                                        ? <b> YOUR FILE IS TOO LARGE! {parseFloat(file.current.size / config.MAX_ATTACHMENT_SIZE).toFixed(2) + " MB "} </b>
                                        : null
                                    }
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
                                    min="1"
                                    max="30"
                                    id="title"
                                    type="text"
                                    name="title"
                                    required="required"
                                    value={fields.title}
                                    className="form-control"
                                    onChange={handleFieldChange}
                                />

                                {/* Label */}
                                <label htmlFor="title"> Ad headline </label>

                                {/* Info */}
                                <small className={`${fields.title.length > 30 || fields.title.length === 0 ? "text-danger" : "text-success"}`}>
                                    {fields.title.length}/30 Characters. The headline is CaSe senSitiVe.
                                </small>
                            </div>

                            {/* 
                             * -------------------------------------------------------------------------------------->
                             * Promotion Link Input Field
                             * -------------------------------------------------------------------------------------->
                             * */}
                            <div className="form-floating mt-3">
                                {/* Input */}
                                <input
                                    id="link"
                                    type="url"
                                    name="link"
                                    value={fields.link}
                                    required="required"
                                    className="form-control"
                                    onChange={handleFieldChange}
                                />

                                {/* Label */}
                                <label htmlFor="link"> Link </label>

                                {/* Info */}
                                <small className={`${fields.link.length === 0 ? "text-danger" : "text-success"}`}>
                                    Enter the link starting with http://... or https://...
                                </small>
                            </div>

                            {/* Reach Input Field, minReward Input Field */}
                            <div className="row mb-3 border-bottom">
                                {/* 
                                 * ---------------------------------------------------------------------------------->
                                 * Reach Input Field
                                 * ---------------------------------------------------------------------------------->
                                 * */}
                                <div className="col">
                                    <div className="form-floating mb-md-3 mt-3">
                                        {/* Input */}
                                        <input
                                            min="30"
                                            id="reach"
                                            name="reach"
                                            type="number"
                                            value={fields.reach}
                                            className="form-control"
                                            onChange={handleFieldChange}
                                        />

                                        {/* Label */}
                                        <label htmlFor="reach"> Reach </label>

                                        {/* Info */}
                                        <small className={`${fields.reach === 0 || fields.reach === "" ? "text-danger" : "text-success"}`}>
                                           Min. people to reach is 30
                                        </small>
                                    </div>
                                </div>

                                {/* 
                                 * ---------------------------------------------------------------------------------->
                                 * minReward Input Field
                                 * ---------------------------------------------------------------------------------->
                                 * */}
                                <div className="col">
                                    <div className="form-floating mb-3 mt-3">
                                        {/* Input */}
                                        <input
                                            id="reward"
                                            min={minReward}
                                            name="reward"
                                            type="number"
                                            value={fields.reward}
                                            className="form-control"
                                            onChange={handleFieldChange}
                                        />

                                        {/* Label */}
                                        <label htmlFor="reward"> Reward PPeC </label>

                                        {/* Info */}
                                        <small className={`${fields.reward >= Number(minReward) ? "text-success" : "text-danger"}`}>
                                            Min. reward per click is {commify(minReward)}
                                        </small>
                                    </div>
                                </div>
                            </div>

                            {/* Description, Budget amount, Balance amount, Pledged amount */}
                            <div className="row">

                                {/* 
                                 * ---------------------------------------------------------------------------------->
                                 * Description
                                 * ---------------------------------------------------------------------------------->
                                 * */}
                                <small className={`mb-2 ${budgetAndPledged > balance ? "text-danger" : "text-secondary"}`}>
                                    Your required budget and pledged amount cannot exceed your available PPeC balance.
                                    {budgetAndPledged > balance
                                        ? <span>
                                            <span> Your are {commify(budgetAndPledged - balance)} PPeC short! </span>
                                            <a href={buyPPeCLink} target="_blank" rel="noopener noreferrer">
                                                <b> GET MORE PPeC </b>
                                                <i className="fas fa-external-link-alt"></i>
                                            </a>
                                        </span>
                                        : null
                                    }                                    
                                </small>

                                {/* 
                                 * -------------------------------------------------------------------------------------->
                                 * Budget amount
                                 * -------------------------------------------------------------------------------------->
                                 * */}
                                <div className="col-12 col-md-4">
                                    <div className="form-floating mb-3 mb-md-0">
                                        <span className="form-control"> {commify(budget)} </span>
                                        <label htmlFor="budget"> Budget PPeC </label>
                                    </div>
                                </div>

                                {/* 
                                 * -------------------------------------------------------------------------------------->
                                 * Balance amount
                                 * -------------------------------------------------------------------------------------->
                                 * */}
                                <div className="col col-md-4">
                                    <div className="form-floating">
                                        <span className="form-control"> {commify(balance)} </span>
                                        <label htmlFor="balance"> Available PPeC </label>
                                    </div>
                                </div>

                                {/* 
                                 * -------------------------------------------------------------------------------------->
                                 * Pledged amount
                                 * -------------------------------------------------------------------------------------->
                                 * */}
                                <div className="col col-md-4">
                                    <div className="form-floating">
                                        <span className="form-control"> {commify(pledged)} </span>
                                        <label htmlFor="pledged"> Pledged PPeC </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Modal Footer */}
                    <div className="modal-footer">
                        {/* Button - Submit */}
                        <button
                            type="button"
                            onClick={handleNewAd}
                            disabled={!validateForm()}
                            className={`btn btn-primary border border-dark ${hasSubmitted ? "disabled" : null}`}
                        >
                            {/* 
                             * ------------------------------------------------------------------------------------------>
                             * Icon - Display spinner when loading
                             * ------------------------------------------------------------------------------------------>
                             * */}
                            {isLoading
                                // Display icon when the request is loading
                                ? <small> <i className="spinner-border text-light spinner-border-sm"></i> </small>
                                // Display icon when the request is not loading
                                : <i className="fa fa-plus-square"></i>
                            }                            

                            {/* Label */}
                            <span> {hasSubmitted ? "PROMOTING" : "PROMOTE"} </span>
                        </button> 
                        
                        {/* Button - Close */}
                        <button type="button" className="btn btn-danger border border-dark" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}