// React Required --------------------------------------
import React, { Fragment } from 'react';
// Libs ------------------------------------------------
// usaAppContext stores - App.js - variables for the entire application
import { useAppContext } from "../libs/contextLib";
// Components ------------------------------------------
import Modal from "./ModalDetails"
// Images ----------------------------------------------
import logo from "../images/favicon-32x32.png"
//------------------------------------------------------ \\
// This file is exported to ---> src/App.js
// we use "ads" ----> "SmAC"
// we use "myads" ----> "U|SmAC"
// -------------- Application Begins Bellow ------------ //

// ----------------------------------------------------------------------
// Main Navigation Component
// ----------------------------------------------------------------------
function Navigation() {
    // Important variables
    // Get url path for the current page
    const path = window.location.pathname;

    // Return UI
    return (
        <Fragment>

            {/* 
             * ----------------------------------------------------------------------------------------->
             * NavBar Component - Dislpay links with modals (ModalDetails.js)
             * ----------------------------------------------------------------------------------------->
             * */}
            <NavBar path={path} />

            {/* 
             * ----------------------------------------------------------------------------------------->
             * InfoBar Component - Display information about the default account and SmACCor
             * ----------------------------------------------------------------------------------------->
             * */}
            <InfoBar path={path} />
           
        </Fragment>
        );
}

// ----------------------------------------------------------------------
// NavBar Component - Uses NavLink Component
// ----------------------------------------------------------------------
function NavBar(props) {
    // Important variables
    const { path } = props;
    const { connected, buyPPeCLink, defaultAccount, connectWalletHandler, claimPPeCDocs, promotePPeCDocs, getPPeCDocs, needMetaMask } = useAppContext();
    // We are truncating `defaultAccount` address. Get the first 5 and the last 3 digits
    const first5Digits = (defaultAccount === null ? "xxx" : defaultAccount.substr(0, 5));
    const last3Digits = (defaultAccount === null ? "xxx" : defaultAccount.substr(39));

    // Return UI
    return (
        <nav className={`navbar navbar-expand-md ${path === "/" ? null : "bg-white"} navbar-dark`}>
            <div className="container-fluid" style={{ alignItems: "flex-start" }}>
                {/* Nav Brand */}
                <a href="/" className="btn btn-white border border-secondary navbar-brand text-dark shadow-sm">
                    <img src={logo} alt="Avatar Logo" style={{ width : "30px"}} className="rounded-pill" /> 
                    <b> PPeC </b>
                    <small className="text-secondary d-none d-block"> <small> <small> Smack an ad at a time </small> </small> </small>
                </a>

                {/* Nav Toggle */}
                <button className="navbar-toggler bg-dark shadow-sm" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Nav Links */}
                <div className="collapse navbar-collapse" id="collapsibleNavbar">
                    <div className="row my-3 my-md-0 w-100 mx-0">
                        {/* Links */}
                        <NavLink link="/ads" path={path} name={`SmAC`} icon="fa fa-bullhorn" targetId="ads" docsLink={claimPPeCDocs}/>
                        <NavLink link="/myads" path={path} name="U|SmAC" icon="fa fa-sitemap" targetId="myads" docsLink={promotePPeCDocs}/>
                        <NavLink link="/digest" path={path} name="Digest" icon="fa fa-cube" targetId="digest" docsLink="https://paidperclick.gitbook.io/ppec-docs/guides/smac/what-is-a-smac-cycle#a-digest-smac-cycle"/>
                        <NavLink link="/bounty" path={path} name="Bounty" icon="fa fa-heartbeat" targetId="bounty" docsLink="https://paidperclick.gitbook.io/ppec-docs/guides/smac/what-is-a-smac-cycle#a-bounty-smac-cycle" />
                        <NavLink link={buyPPeCLink} target="newWindow" path={path} name="Get|PPeC" icon="fa fa-bitcoin" targetId="buy" docsLink={getPPeCDocs} />
                        <NavLink link="#cycle" path={path} name="15|Days" icon="fa fa-history" targetId="cycle" disabled="disabled" docsLink="https://paidperclick.gitbook.io/ppec-docs/guides/promote#smac-cycles-states" />

                        {/* Connect Button, Address Button*/}
                        <div className="col-12 col-md">
                            {needMetaMask
                                //-----------------------------------------------------------------------------------
                                // When the user needs to install MetaMask
                                //-----------------------------------------------------------------------------------
                                ? <button
                                    type="button"
                                    className="btn disabled btn-danger border border-dark btn-primary w-100"
                                    >
                                        <strong> Get MetaMask </strong>

                                </button>

                                //-----------------------------------------------------------------------------------
                                // When the user has MetaMask
                                //-----------------------------------------------------------------------------------
                                : connected

                                    //-------------------------------------------------------------------------------
                                    // When the user is connected
                                    //-------------------------------------------------------------------------------
                                    ? <div className="btn-group w-100">
                                        {/* Connect Button */}
                                        <button
                                            type="button"
                                            data-bs-toggle="modal"
                                            data-bs-target="#accountInformation"
                                            className={`btn btn-dark border-dark text-warning shadow-sm`}
                                        >
                                            <strong>  Connected  </strong>

                                        </button>

                                        {/* Address Button */}
                                        <button type="button" className="btn alert-dark border border-dark disabled">
                                            <b> {first5Digits}...{last3Digits} </b>
                                        </button>
                                    </div>

                                    //-------------------------------------------------------------------------------
                                    // When the user is not connected
                                    //-------------------------------------------------------------------------------
                                    : <div className="btn-group w-100">
                                        {/* Connect Button */}
                                        <button
                                            type="button"
                                            onClick={connectWalletHandler}
                                            className={`btn btn-primary`}
                                        >
                                            <strong>  Connect </strong>

                                        </button>

                                        {/* Address Button */}
                                        <button type="button" className="btn alert-dark border border-dark disabled">
                                            <b> {first5Digits}...{last3Digits} </b>
                                        </button>
                                    </div>
                            }                                    
                            
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

// ----------------------------------------------------------------------
// InfoBar Component - Uses ListItem Component
// ----------------------------------------------------------------------
function InfoBar(props) {
    // Important variables
    const { path } = props;
    const {
        pledged,
        balance,
        decimal,
        adCount,
        minReward,
        minBalance,
        treasuryBalance
    } = useAppContext();

    // Return UI
    return (
        <div className={`row text-center m-0 px-3 mb-3 ${path === "/" ? "d-none" : null}`}>
            {/* Total Ads, Treasury Balance, Min. Reward, Min. Balance */}
            <div className="col-12 col-lg-8">
                <div className="row">
                    <ListItem title="Total SmAC" value={adCount} />
                    <ListItem title="Treasury Balance" value={decimal(treasuryBalance)} />
                    <ListItem title="Min. Reward" value={decimal(minReward)} />
                    <ListItem title="Min. Balance" value={decimal(minBalance)} />
                </div>
            </div>

            {/* Promote, Pledged */}
            <div className="col-12 col-lg-4">
                <div className="row">
                    {/* Promote - value, button */}
                    <div className="col-6 p-1">
                        <div className="list-group">
                            {/* value */}
                            <div className="list-group-item border-primary py-1">
                                <span className="" > <b> {decimal(balance)} </b> </span>
                            </div>

                            {/* button */}
                            <div className="list-group-item border-dark bg-primary p-0 shadow-sm">
                                <button
                                    type="button"
                                    data-bs-toggle="modal"
                                    data-bs-target="#promote"
                                    className="btn-primary text-uppercase py-1 border-0 w-100 rounded-bottom"
                                >
                                    <i className="fa fa-plus-square"></i>
                                    <b> Promote </b>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Pledged - value, title */}
                    <div className="col-6 p-1">
                        <div className="list-group h-100">
                            {/* value */}
                            <div className="list-group-item py-1 h-100">
                                <span className="" > <b> {decimal(pledged)} </b> </span>
                            </div>

                            {/* title */}
                            <div className="list-group-item py-1 shadow-sm px-0">
                                <b className="text-secondary"> Pledged </b>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// ListItem Component
// ----------------------------------------------------------------------
function ListItem(props) {
    // Important variables
    const { title, value } = props;

    // Return UI
    return (
        <div className="col-6 col-lg-3 col-md-3 p-1">
            <ul className="list-group h-100">
                {/* Info Value */}
                <li className="list-group-item py-1 h-100" style={{ overflow: "hidden" }}>
                    <span className="text-dark"> <b> {value} </b> </span>
                </li>

                {/* Info Name */}
                <li className="list-group-item py-1 shadow-sm px-0">
                    <span className="text-secondary"> <b> {title} </b> </span>
                </li>
            </ul>
        </div>
    );
}

// ----------------------------------------------------------------------
// NavLink Component - with Modal Component
// ----------------------------------------------------------------------
function NavLink(props) {
    // Important variables
    const { link, name, icon, targetId, path, disabled, docsLink, target } = props;

    // Return UI
    return (
        <Fragment>
            <div className="col-6 col-md">
                {/* Button Group */}
                <div className="btn-group w-100 mb-3">
                    {/* Modal Button */}
                    <button
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target={`#${targetId}`}
                        className={`btn btn-dark text-warning border border-end-0 border-dark`}
                    >
                        {/* icon */}
                        <i className={`${icon}`}></i>
                    </button>

                    {/* Link */}
                    <a
                        href={link}
                        target={`${target === "newWindow" ? "_blank" : "_self"}`}
                        className={`btn ${path === link || disabled ? `alert-secondary border border-dark disabled` : "btn-primary border border-dark shadow-sm"}`}>
                        {/* name */}
                        <strong> {name} </strong>
                    </a>
                </div>
            </div>

            {/* Modal Component */}
            <Modal
                name={name}
                icon={icon}
                link={link}
                target={target}
                targetId={targetId}
                docsLink={docsLink}
            />
        </Fragment>
        );
}

// ----------------------------------------------------------------------
// AdsModalDetail Component
// ----------------------------------------------------------------------
function AdsModalDetail() {
    // Important variables
    const {
        decimal,
        adCount,
        minReward,
        claimerFee
    } = useAppContext();

    // Return UI
    return (
        <div className="modal-body">
            {/* Headings and Descriptions */}
            <h3 className=""> <strong> What are SmAC? </strong> </h3>
            <p className=""> <b>SmAC</b> or <b>Smart Ads Contracts</b>, are smart ads that reward their audience with <b>$PPeC</b>. </p>
            <h3 className=""> <strong> What's in the SmAC tab? </strong> </h3>
            <p className=""> In the SmAC tab, find all running SmAC and claim rewards. </p>
            <h3 className=""> <strong> Claiming Rewards. </strong> </h3>
            <p className="mb-0"> <i className="fa fa-check-square"></i> You can tag a SmAC as a scam. </p>
            <p className="mb-0"> <i className="fa fa-check-square"></i> Each SmAC can only be claimed once. </p>
            <p className=""> <i className="fa fa-check-square"></i> You need a minimun amount of tokens to claim rewards. </p>

            {/* Minimum PPeC Required, Claim Fee, Total Ad count */}
            <div className="row">

                {/* Minimum PPeC Required */}
                <div className="col-12 col-md-12 mb-0 mb-md-3">
                    <div className="form-floating mb-3 mb-md-0">
                        <span className="form-control">  <b>{decimal(minReward)} </b> </span>
                        <label htmlFor="budget">  <b>Min. required $PPeC </b> </label>
                    </div>
                </div>

                {/* Claim Fee */}
                <div className="col col-md-6">
                    <div className="form-floating">
                        <span className="form-control"> <b> {claimerFee/100} </b> </span>
                        <label htmlFor="balance"> <b> Claim Fee (%) </b> </label>
                    </div>
                </div>

                {/* Total Ad count */}
                <div className="col col-md-6">
                    <div className="form-floating">
                        <span className="form-control"> <b> {adCount} </b> </span>
                        <label htmlFor="pledged"> <b> Total SmAC </b> </label>
                    </div>
                </div>
            </div>
        </div>
        );
}

// ----------------------------------------------------------------------
// MyAdsModalDetail Component
// ----------------------------------------------------------------------
function MyAdsModalDetail() {
    // Important variables
    const {
        decimal,
        minReward,
        promoterFee
    } = useAppContext();

    // Return UI
    return (
        <div className="modal-body">
            {/* Headings and Descriptions */}
            <h3 className=""> <strong> What's in the U|SmAC tab? </strong> </h3>
            <p className=""> In the U|SmAC tab, you can manage all your SmAC. </p>
            <h3 className=""> <strong> Who can Launch a SmAC? </strong> </h3>
            <p className="mb-0"> <i className="fa fa-check-square text-success"></i> Anyone, can launch a SmAC.  </p>
            <h3 className=""> <strong> Launch a SmAC </strong> </h3>
            <p className="mb-0"> <i className="fa fa-check-square"></i> Each SmAC runs/cycles for 15 days. </p>
            <p className="mb-0"> <i className="fa fa-check-square"></i> After 15 days, leftover $PPeC can be claimed back.  </p>
            <p className="mb-0"> <i className="fa fa-check-square"></i> You need a minimun amount of $PPeC to launch SmAC. </p>
            <p className="mb-0"> <i className="fa fa-check-square text-danger"></i> Once launched, a SmAC <b className="text-danger"> CANNOT </b> be edited nor deleted. </p>
            <p className=""> <i className="fa fa-check-square text-warning"></i> After 19 days, a SmAC becomes a Bounty SmAC if/when it has $PPeC in its coffer.  </p>

            {/* Minimum Reward required, Promoter Fee, U|SmAC */}
            <div className="row">

                {/* Minimum Reward required */}
                <div className="col col-md-12 mb-0 mb-md-3">
                    <div className="form-floating mb-3 mb-md-0">
                        <span className="form-control">  <b>{decimal(minReward)} </b> </span>
                        <label htmlFor="budget">  <b>Minimum Reward required $PPeC </b> </label>
                    </div>
                </div>

                {/* Promoter Fee */}
                <div className="col-12">
                    <div className="form-floating">
                        <span className="form-control"> <b> {promoterFee/100} </b> </span>
                        <label htmlFor="balance"> <b> Reclaim/Refund Fee (%) </b> </label>
                    </div>
                </div>

                {/* My SmAC */}
                <div className="col col-md-6 d-none">
                    <div className="form-floating">
                        <span className="form-control"> <b> 0 </b> </span>
                        <label htmlFor="pledged"> <b> U|SmAC </b> </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// DigestModalDetail Component
// ----------------------------------------------------------------------
function DigestModalDetail() {
    // Important variables
    const {
        adCount,
    } = useAppContext();

    // Return UI
    return (
        <div className="modal-body">
            {/* Headings and Descriptions */}
            <h3 className=""> <strong> What's in the Digest tab? </strong> </h3>
            <p className=""> You will find all SmAC waiting for $PPeC in their coffers to run. </p>
            <h3 className=""> <strong> Digest SmAC. </strong> </h3>
            <p className="mb-0"> <i className="fa fa-check-square"></i> A preview of the SmAC link or URL.  </p>
            <p className="mb-0"> <i className="fa fa-check-square"></i> A preview of the SmAC contract address. </p>
            <p className="mb-0"> <i className="fa fa-check-square"></i> A preview of the SmAC minimum reward. </p>
            <p className=""> <i className="fa fa-check-square"></i> A preview of the SmAC promoter's address. </p>

            {/* Digest SmAC */}
            <div className="row d-none">

                {/* Digest SmAC */}
                <div className="col">
                    <div className="form-floating">
                        <span className="form-control"> <b> {adCount} </b> </span>
                        <label htmlFor="pledged"> <b> Digest SmAC </b> </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// BountyModalDetail Component
// ----------------------------------------------------------------------
function BountyModalDetail() {
    // Important variables
    const {
        adCount,
    } = useAppContext();

    // Return UI
    return (
        <div className="modal-body">
            {/* Headings and Descriptions */}
            <h3 className=""> <strong> What's in the Bounty tab? </strong> </h3>
            <p className=""> You will find all expired SmAC with $PPeC in their coffers. Once a SmAC becomes a Bounty SmAC, you can claim all $PPeC in its coffer. </p>
            <h3 className=""> <strong> Bounty SmAC </strong> </h3>
            <p className="mb-0"> <i className="fa fa-check-square"></i> After 19 days, a SmAC will become <b>Bounty SmAC</b>. </p>
            <p className="mb-0"> <i className="fa fa-check-square"></i> For Bounty SmAC, the reward is the entire $PPeC coffer. </p>
            <p className=""> <i className="fa fa-check-square"></i> You need a minimun amount of $PPeC to claim rewards. </p>

            {/* Bounty SmAC */}
            <div className="row d-none">

                {/* Bounty SmAC */}
                <div className="co">
                    <div className="form-floating">
                        <span className="form-control"> <b> {adCount} </b> </span>
                        <label htmlFor="pledged"> <b> Bounty SmAC </b> </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// BountyModalDetail Component
// ----------------------------------------------------------------------
function BuyModalDetail() {
    // Important variables
    const {
        decimal,
        adCount,
        minReward,
        buyPPeCLink
    } = useAppContext();

    // Return UI
    return (
        <div className="modal-body">
            {/* Title Input */}
            <h3 className=""> <strong> What is $PPeC? </strong> </h3>
            <p className="mb-0"> $PPeC is the token used to fund SmAC and to reward smart smart ad viewers. </p>
            <a
                target="_blank"
                rel="noopener noreferrer"
                className=""
                href="https://paidperclick.gitbook.io/ppec-docs/guides/how-to-buy-usdppec"
            >
                {/* Title */}
                <strong> - How to get $PPeC? </strong>

                {/* Icon */}
                <i className="fas fa-external-link-alt"></i>
            </a>
            <a
                target="_blank"
                rel="noopener noreferrer"
                className="mb-3 d-block"
                href={buyPPeCLink}
            >
                {/* Title */}
                <strong> - Get $PPeC? </strong>

                {/* Icon */}
                <i className="fas fa-external-link-alt"></i>
            </a>
            <h3 className=""> <strong> What can I use $PPeC for? </strong> </h3>
            <p className=""> $PPeC is a cryptocurrency, thus it can be held, transfered, and donated. Just like other cryptos out there. </p>
            <h3 className=" mb-0">
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://paidperclick.gitbook.io/ppec-docs/using-the-web-site/ppec-1.0"
                >
                    <strong> What is PPeC 1.0? </strong>
                </a>
            </h3>
            <p className=""> It is the first phase of DAdvers.  </p>
            <h3 className=" mb-0">
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://paidperclick.gitbook.io/ppec-docs/using-the-web-site/ppec-2.0"
                >
                    <strong> What is PPeC 2.0? </strong>
                </a>
            </h3>
            <p className=""> It is the second phase of DAdvers.  </p>
            <h3 className=""> <strong> Why should I buy $PPeC? </strong> </h3>
            <p className="mb-0"> <i className="fa fa-check-square"></i> Claim rewards.  </p>
            <p className="mb-0"> <i className="fa fa-check-square"></i> Hold and/or transfer.   </p>
            <p className="mb-0"> <i className="fa fa-check-square"></i> Launch smart advertisments.   </p>
            <p className=""> <i className="fa fa-check-square text-primary"></i> In short, by using $PPeC, you are funding PPeC 2.0. This applies to claimers, promoters, and holders. </p>
            <h4> <strong> Join the SmAC and PPeC community </strong> </h4>

            {/* Description, Budget amount, Balance amount, Pledged amount */}
            <div className="row d-none">

                {/* Budget amount */}
                <div className="col-12 col-md-12 mb-0 mb-md-3">
                    <div className="form-floating mb-3 mb-md-0">
                        <span className="form-control">  <b>{decimal(minReward)} </b> </span>
                        <label htmlFor="budget">  <b>Minimum Reward required $PPeC </b> </label>
                    </div>
                </div>

                {/* Balance amount */}
                <div className="col col-md-6">
                    <div className="form-floating">
                        <span className="form-control"> <b> {adCount} </b> </span>
                        <label htmlFor="balance"> <b> Reclaim/Refund Fee (%) </b> </label>
                    </div>
                </div>

                {/* Pledged amount */}
                <div className="col col-md-6">
                    <div className="form-floating">
                        <span className="form-control"> <b> {adCount} </b> </span>
                        <label htmlFor="pledged"> <b> My SmAC </b> </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// BountyModalDetail Component
// ----------------------------------------------------------------------
function CycleModalDetail() {
    // Important variables
    const {
        decimal,
        adCount,
        minReward,
    } = useAppContext();

    // Return UI
    return (
        <div className="modal-body">
            {/* Title Input */}
            <h3 className=""> <strong> What's a SmAC cycle? </strong> </h3>
            <p className=""> A cycle is how long an SmAC can run for. </p>
            <h3 className=""> <strong> SmAC cycle </strong> </h3>
            <p className="mb-0"> <i className="fa fa-check-square"></i> Each SmAC has a 15 day cycle. </p>
            <p className="mb-0"> <i className="fa fa-check-square"></i> SmAC become Bounty SmAC after 19 days. </p>
            <p className="mb-0"> <i className="fa fa-check-square"></i> After 15 days, a SmAC coffer can only be claimed by the promoter. </p>
            <p className=""> <i className="fa fa-check-square"></i> After 19 days, a SmAC coffer can be claimed by anyone with the required minimum PPeC balance. </p>

            {/* Description, Budget amount, Balance amount, Pledged amount */}
            <div className="row d-none">

                {/* Budget amount */}
                <div className="col-12 col-md-12 mb-0 mb-md-3">
                    <div className="form-floating mb-3 mb-md-0">
                        <span className="form-control">  <b>{decimal(minReward)} </b> </span>
                        <label htmlFor="budget">  <b>Min. required PPeC </b> </label>
                    </div>
                </div>

                {/* Balance amount */}
                <div className="col col-md-6">
                    <div className="form-floating">
                        <span className="form-control"> <b> {adCount} </b> </span>
                        <label htmlFor="balance"> <b> Claim Fee % </b> </label>
                    </div>
                </div>

                {/* Pledged amount */}
                <div className="col col-md-6">
                    <div className="form-floating">
                        <span className="form-control"> <b> {adCount} </b> </span>
                        <label htmlFor="pledged"> <b> Total Ads </b> </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
export {
    Navigation,
    BuyModalDetail,
    AdsModalDetail,
    MyAdsModalDetail,
    CycleModalDetail,
    BountyModalDetail,
    DigestModalDetail
};