// React Required --------------------------------------
import React from 'react';
// Components ------------------------------------------
import {
    AdsModalDetail,
    BuyModalDetail,
    MyAdsModalDetail,
    CycleModalDetail,
    BountyModalDetail,
    DigestModalDetail
} from "./Navigation"
//------------------------------------------------------ \\
// This file is exported to ---> src/App.js
// we use "ads" ----> "SmAC"
// we use "myads" ----> "U|SmAC"
// -------------- Application Begins Bellow ------------ //

// Main Component
// Displays more information about each navigation link
export default function ModalDetails(props) {
    // Important variables
    const { name, icon, targetId, link, docsLink, target } = props;
    // Get url path for the current page
    const path = window.location.pathname;

// ----------------------------------------------------------------------
    // Return UI
    return (
        <div className={`modal fade`} id={targetId}>
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    {/* Modal Header */}
                    <div className="modal-header">
                        {/* Heading */}
                        <div className="btn-group">
                            {/* Link */}
                            <a
                                href={docsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`btn mb-3 mb-lg-0 border border-dark btn-dark text-warning`}
                            >
                                {/* icon */}
                                <i className="fa fa-file-text"></i>

                                {/* name */}
                                <strong> Docs </strong>
                            </a>

                            {/* Link */}
                            <a
                                href={link}
                                target={`${target === "newWindow" ? "_blank" : "_self"}`}
                                className={`btn mb-3 mb-lg-0 border border-dark ${path === link || targetId === "cycle" ? "disabled alert-secondary" : "btn-primary"}`}
                            >
                                {/* icon */}
                                <i className={icon}></i>

                                {/* name */}
                                <strong> {targetId === "cycle" ? "Cycle - 15 Days" : name } </strong>
                            </a>
                        </div>

                        {/* Button - Close */}
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    {/* Modal Body - Components [Navigation.js] */}
                    {targetId === "ads" ? <AdsModalDetail /> : null}
                    {targetId === "buy" ? <BuyModalDetail /> : null}
                    {targetId === "myads" ? <MyAdsModalDetail /> : null}
                    {targetId === "cycle" ? <CycleModalDetail /> : null}
                    {targetId === "digest" ? <DigestModalDetail /> : null}
                    {targetId === "bounty" ? <BountyModalDetail /> : null}

                    {/* Modal Footer */}
                    <div className="modal-footer">                        
                        {/* Button - Close */}
                        <button type="button" className="btn btn-danger border border-dark" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}