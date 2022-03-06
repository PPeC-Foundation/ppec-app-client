// React Required --------------------------------------
import React, { useEffect, useState } from 'react';
// Ampligy Required ------------------------------------
import { API } from "aws-amplify";
// ethers Required -------------------------------------
import { ethers } from "ethers";
// Components ------------------------------------------
import { Navigation } from "./components/Navigation";
import Footer from "./components/Footer";
import Modal from "./components/ModalPromote";
import ModalAccount from "./components/ModalAccount";
import Router from "./Router";
// Libs ------------------------------------------------
// usaAppContext stores - App.js - variables for the entire application
import { AppContext } from "./libs/contextLib";
import { abiPPeC, abiSmaCCor, abiSmaC } from "./libs/abiLib";
//------------------------------------------------------ \\
// This file is exported to ---> src/index.js
// we use "ads" ----> "SmAC"
// we use "myads" ----> "U|SmAC"
// https://eips.ethereum.org/EIPS/eip-1193
// -------------- Application Begins Bellow ------------ //

// Main App Component
export default function App() {
    // ----------------------------------------------------------------------
    // Important variables
    // ----------------------------------------------------------------------
    const ethereum = window.ethereum;
    const providerId = Number(process.env.REACT_APP_PROVIDER_CHAINID);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [treasuryBalance, setTreasuryBalance] = useState(0);
    const [alertMetaMask, setAlertMetaMask] = useState("");
    const [connected, setConnected] = useState(false);
    const [promoterFee, setPromoterFee] = useState(0);
    const [minBalance, setMinBalance] = useState(0);
    const [claimerFee, setClaimerFee] = useState(0);
    const [minReward, setMinReward] = useState(0);
    const [founder, setFounder] = useState(null);
    const [accountHash, setAccountHash] = useState(false);
    const [approvedHash, setApprovedHash] = useState(false);
    const [pledged, setPledged] = useState(0);
    const [adCount, setAdCount] = useState(0);
    const [balance, setBalance] = useState(0);
    const [chainId, setChainId] = useState(0);
    const [registered, setRegistered] = useState(false);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [needMetaMask, setNeedMetaMask] = useState(false);
    const [contractPPeC, setContractPPeC] = useState(null);
    const [contractSmACCor, setContractSmACCor] = useState(null);
    // ----------------------------------------------------------------------
    // Important Links
    // ----------------------------------------------------------------------
    const documentPPeC = "https://paidperclick.gitbook.io/ppec-docs/";
    const claimPPeCDocs = "https://paidperclick.gitbook.io/ppec-docs/guides/claim";
    const promotePPeCDocs = "https://paidperclick.gitbook.io/ppec-docs/guides/promote";
    const getPPeCDocs = "https://paidperclick.gitbook.io/ppec-docs/guides/how-to-buy-usdppec";
    const howToGetPPeCLink = "https://paidperclick.gitbook.io/ppec-docs/guides/how-to-buy-usdppec";
    const smartContractPPeC = "https://snowtrace.io/address/0xe1498556390645ca488320fe979bc72bdecb6a57"; // PPeC Full contract snowtrace
    const smaccorSnowTraceLink = "https://snowtrace.io/address/0xc3121c3689b738f025e0a7963105b08b9ee9a16d#code"; // SmACCor Full contract snowtrace
    const chartPPeCLink = "https://analytics.traderjoexyz.com/pairs/0x6fa8417e81fbc0c6bc048f99b01b632ade4b98e4";
    const liquidityPoolPPeCLink = "https://traderjoexyz.com/pool/0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e/0xe1498556390645ca488320fe979bc72bdecb6a57#/";
    const buyPPeCLink = "https://traderjoexyz.com/trade?inputCurrency=0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e&outputCurrency=0xe1498556390645ca488320fe979bc72bdecb6a57#/";

    // ----------------------------------------------------------------------
    // Contract addresses and definitions
    // SmACCor : Smart Ads Contract Creator
    // PPeC : Paid Per Click [ERC20] Token
    // SmAC : Smart Ads Contract (multiple addresses)
    // ---------------------------------------------------------------------- 
    const addressPPeC = process.env.REACT_APP_PPEC_ADDRESS; 
    const addressSmACCor = process.env.REACT_APP_SMACCOR_ADDRESS;

    // ----------------------------------------------------------------------
    // Detecting if the use has MetaMask
    // ----------------------------------------------------------------------
    // Return elements if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {

        // --------------------------------------------------------------
        // Listen to the chain changes event
        // --------------------------------------------------------------
        ethereum.on("chainChanged", (chainId) => window.location.reload());

        // --------------------------------------------------------------
        // Get the new chaid id
        // --------------------------------------------------------------
        ethereum
            .request({
                method: "eth_chainId"
            })
            .then((chainId) => {
                setChainId(parseInt(chainId, 16)); // Return the chain id as a number
            })
            .catch((err) => {
                console.error(`Error fetching chainId: ${err.code}: ${err.message}`);
            });       

        // --------------------------------------------------------------        
        // Listen to account changes
        // --------------------------------------------------------------        
        ethereum.on("accountsChanged", handleAccountsChanged);

    }

    // ----------------------------------------------------------------------
    // Reload the application when the user changes the account
    // ----------------------------------------------------------------------

    // Handle connection to MetaMask
    function handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            // MetaMask is locked or the user has not connected any accounts
            setAlertMetaMask("Please connect to MetaMask.");
        } else if (accounts[0] !== defaultAccount) {
            // Set the default account to the first account
            setDefaultAccount(accounts[0]);
            // Set the button to connected
            setConnected(true);
        }
    }

    // ----------------------------------------------------------------------
    // //Request an ethereum account 1800000000000000000000000
    // ---------------------------------------------------------------------- 
    if (window.ethereum.isConnected()) {

        ethereum
            .request({
                method: "eth_requestAccounts"
            })
            .then(handleAccountsChanged)
            .catch((err) => {
                console.error(err);
            });
    }
 
    // ----------------------------------------------------------------------
    // Connecting to metamask using a button
    // ----------------------------------------------------------------------
    function connectWalletHandler() {
        ethereum
            .request({ method: "eth_requestAccounts" })
            .then(handleAccountsChanged)
            .catch((err) => {
                if (err.code === 4001) {
                    setAlertMetaMask('Please connect to MetaMask.');
                } else {
                    console.error(err);
                }
            });
    }

    // ----------------------------------------------------------------------
    // Get Contract information
    // We are returning information based on the user connection
    // (1) if the user is connected to MetaMask, we use Web3 Connection
    //     - We need the signer to send calls for the Smart Ads Contract Creator (SmACCor)
    //     - (Read and Write)
    // (2) if the user is not connected to MetaMask, we use RPC Connection
    //     - We do not need the signer to send calls. We only need the provider to return views
    //     - (Read Only)
    // ----------------------------------------------------------------------
    useEffect(() => {
        // Get contract information on load
        async function onLoad() {
            try {

                // (1) using Web3 connection
                // When metamask is installed and connected 
                // Getting the current account/signer information
                if (typeof window.ethereum !== 'undefined' && chainId === providerId) {

                    // MetaMask Connection
                    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
                    // Get the signer
                    const signer = provider.getSigner();
                    // Used for user balance.
                    const contractPPeC = new ethers.Contract(addressPPeC, abiPPeC, provider);
                    // Set the contract for Smart Contract Creator 
                    const contractSmACCor = new ethers.Contract(addressSmACCor, abiSmaCCor, provider);

                    // Set variables
                    setSigner(signer);
                    setProvider(provider);
                    setContractPPeC(contractPPeC);
                    setContractSmACCor(contractSmACCor);

                    // Get the smart contract creator information
                    getSmACCor(contractSmACCor); 
                }
                // (2) using RPC connection
                // When metamask is not installed
                // Return the provider information
                else {
                    const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC);
                    const contractPPeC = new ethers.Contract(addressPPeC, abiPPeC, provider);
                    const contractSmACCor = new ethers.Contract(addressSmACCor, abiSmaCCor, provider);

                    // Set variables
                    setProvider(provider);
                    setContractPPeC(contractPPeC);
                    setContractSmACCor(contractSmACCor);

                    // Get the smart contract creator (SmACCor) information
                    getSmACCor(contractSmACCor);
                }

                // Retrieve the smart contract creator (SmACCor) information
                async function getSmACCor(contractSmACCor) {

                    if (contractSmACCor !== null) {
                        //Contract Information                
                        let SmACCor = await contractSmACCor.contractInfo();
                        let treasuryBalance = ethers.utils.formatUnits(SmACCor[0], 18);
                        let minBalance = ethers.utils.formatUnits(SmACCor[2], 18);
                        let promoterFee = SmACCor[3].toNumber();
                        let claimerFee = SmACCor[4].toNumber();
                        let minReward = ethers.utils.formatUnits(SmACCor[5], 18);
                        let adCount = SmACCor[1].toNumber();
                        //Setter for Contract
                        setTreasuryBalance(treasuryBalance);
                        setPromoterFee(promoterFee);
                        setMinBalance(minBalance);
                        setClaimerFee(claimerFee);
                        setMinReward(minReward);
                        setAdCount(adCount);
                    }
                }

            } catch (e) {
                // Error Handling
                alert(e);
            }
        }

        // Returning function when the screen finish loading
        onLoad();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chainId]);

    // ----------------------------------------------------------------------
    // Get User information
    // ----------------------------------------------------------------------
    useEffect(() => {
        // Update post view - count only
        async function onLoad() {
            try {
                // Checking MetaMask connection on each render
                if (window.ethereum && defaultAccount != null && chainId === providerId) {
                    setConnected(true);
                    // Get the account approved hash
                    function loadHash() {
                        return API.get("hashes", `/hash/filterhash/${defaultAccount}`);
                    }
                    const hash = await loadHash();
                    const accountHash = (hash.length === 0 ? false : hash[0].hashedWord)

                    // Default Account Information
                    const approvedHash = (hash.length === 0 ? false : await contractSmACCor.senderHash(defaultAccount, hash[0].hashedWord));
                    const founder = await contractSmACCor.founder();
                    const registered = await contractSmACCor.registered(defaultAccount);
                    const owner = await contractSmACCor.ownerInfo(defaultAccount);
                    const balance = ethers.utils.formatUnits(owner[0], 18); // PPeC balance
                    const pledged = ethers.utils.formatUnits(owner[1], 18); // PPeC pledged balance

                    // Setter for Default Account
                    setPledged(pledged);
                    setBalance(balance);
                    setFounder(founder);
                    setRegistered(registered);
                    setAccountHash(accountHash);
                    setApprovedHash(approvedHash);
                }

            } catch (e) {
                // Error Handling
                alert(e);
            }
        }

        // Returning function when the screen finish loading
        onLoad();

        // Our clean up happens when we leave the page
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultAccount]);

    // ----------------------------------------------------------------------
    // Check MetaMask connection
    // ----------------------------------------------------------------------
    useEffect(() => {
        // Get contract information on load
        async function onLoad() {
            try {

                // Return elements if MetaMask is installed
                if (typeof window.ethereum !== 'undefined') {
                    setNeedMetaMask(false);
                }
                // Return elements if MetaMask is not installed
                else {
                    setNeedMetaMask(true);
                }
            } catch (e) {
                // Error Handling
                alert(e);
            }
        }

        // Returning function when the screen finish loading
        onLoad();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ----------------------------------------------------------------------
    // Returns a string with value grouped by 3 digits, separated by a "," and "."
    // ----------------------------------------------------------------------
    function commify(number) {
        return ethers.utils.commify(number)
    }

    // ----------------------------------------------------------------------
    // Returns a specified amount of digits for numbers.
    // ----------------------------------------------------------------------
    function decimal(number) {
        return Number(number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // ----------------------------------------------------------------------
    // Return UI
    return (
        // Global accessible values (entire app)
        // use ---> import { useAppContext } from "../libs/contextLib";
        // then --> const { commify, ... } = useAppContext();
        <AppContext.Provider
            value={{
                signer,
                ethers,
                founder,
                commify,
                adCount,
                abiSmaC,
                balance,
                pledged,
                decimal,
                provider,
                minReward,
                connected,
                minBalance,
                claimerFee,
                registered,
                promoterFee,
                buyPPeCLink,
                getPPeCDocs,
                accountHash,
                approvedHash,
                contractPPeC,
                documentPPeC,
                needMetaMask,
                claimPPeCDocs,
                chartPPeCLink,
                defaultAccount,
                promotePPeCDocs,
                treasuryBalance,
                contractSmACCor,
                howToGetPPeCLink,
                smartContractPPeC,
                providerId, chainId,
                connectWalletHandler,
                smaccorSnowTraceLink,
                liquidityPoolPPeCLink
            }}
        >
            {/* Navigation Component */}
            <Navigation />

            {/* Route Component */}
            <Router />

            {/* Modal Components */}
            <Modal />
            <ModalAccount />

            {/* Footer Component */}
            <Footer />

            <Errors alertMetaMask={alertMetaMask} providerId={providerId} chainId={chainId} needMetaMask={needMetaMask} buyPPeCLink={buyPPeCLink} />

        </AppContext.Provider>
    );
}

function Errors(props) {
    // Important variables
    const { alertMetaMask, providerId, chainId, needMetaMask, buyPPeCLink } = props;

    // Return UI
    return (
        <div className="px-3" style={{ position: "fixed", bottom: "0", right: "0" }}>

            <div className={`alert alert-danger alert-dismissible fade text-center show shadow border border-dark ${alertMetaMask === "" ? "d-none" : ""}`}>
                <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                <strong> {alertMetaMask} </strong>
            </div>

            <div className={`alert alert-danger alert-dismissible fade show text-center shadow border border-dark ${needMetaMask === true ? "" : "d-none"}`}>
                <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                {/* Alert text */}
                <p className=""><strong> Please install MetaMask to use the app. </strong></p>
                {/* Link */}
                <a
                    className="btn btn-danger border border-dark shadow-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={buyPPeCLink}
                >
                    <i className="fa fa-file-text"></i>
                    <strong> Learn more </strong>
                </a>
            </div>

            <div className={`alert alert-danger alert-dismissible fade text-center show shadow border border-dark ${typeof window.ethereum !== 'undefined' && chainId === providerId ? "d-none" : ""}`}>
                <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                <strong>Please connect to Avalanche Network.</strong>
            </div>
        </div>
    );
}