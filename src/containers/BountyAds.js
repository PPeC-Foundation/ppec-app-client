// React Required --------------------------------------
import React, { Fragment, useEffect, useState } from 'react';
// Ampligy Required ------------------------------------
import { API } from "aws-amplify";
// Components ------------------------------------------
import Card from "../components/Card";
import Modal from "../components/ModalPages";
import Loader from "../components/GettingAdsLoader";
import NoAvailableAds from "../components/NoAvailableAds";
// Libs ------------------------------------------------
// usaAppContext stores - App.js - variables for the entire application
import { useAppContext } from "../libs/contextLib";
//------------------------------------------------------ \\
// This file is exported to ---> src/Routes.js
// we use "ads" ----> "SmAC"
// we use "myads" ----> "U|SmAC"
// -------------- Application Begins Bellow ------------ //

// Main Function - BountyAds
export default function BountyAds() {
    // Important variables
    const { ethers, defaultAccount, contractSmACCor, abiSmaC, signer, provider, chainId, providerId } = useAppContext();
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [ads, setAds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCleaning, setIsCleaning] = useState(false);

// ----------------------------------------------------------------------
    // Load Bounty Ads - Ads that have not expired and not funded.
// ----------------------------------------------------------------------
    useEffect(() => {
        // Cleanup variable
        let unmounted = false;        

        // Load Bounty Ads
        async function onLoad() {
            // Start Loading
            setIsLoading(true);

            try {
                // Check that we have not unmounted
                if (!unmounted && contractSmACCor != null) {
                    // Contract Information
                    let SmACCor = await contractSmACCor.contractInfo();
                    // Get the ad count for the for loop
                    let adCount = SmACCor[1].toNumber();
                    // Create a new array
                    let ads = [];

                    // Get current account ads - Looping through our array backward - MoonWalk JS ;)
                    for (let i = adCount - 1; i >= 0; i--) {
                        // Get the ad contract address
                        const ad = await contractSmACCor.advertisements(i);
                        // Set the ad contract address
                        const addressSmAC = ad.toString();
                        // Create a new contract
                        //const contractSub = new ethers.Contract(addressSmAC, abiSmaC, provider);
                        const contractSub = new ethers.Contract(addressSmAC, abiSmaC, (defaultAccount != null && chainId === providerId ? signer : provider));

                        // Get contract information
                        let items = await contractSub.getInfo();
                        const promoter = items[11].toLocaleUpperCase();
                        const currentAccount = (defaultAccount === null ? null : defaultAccount.toLocaleUpperCase());

                        // Retrieve each item
                        let object = {
                            "id": i,
                            "title": items[0],
                            "link": items[1],
                            "reach": items[2].toNumber(),
                            "reward": ethers.utils.formatUnits(items[3], 18),
                            "scamReport": items[4].toNumber(),
                            "created": items[5].toNumber(),
                            "expired": items[6].toNumber(),
                            "claimers": items[7].toNumber(),
                            "budget": ethers.utils.formatUnits(items[8], 18),
                            "coffer": ethers.utils.formatUnits(items[9], 18),
                            "hasClaimed": items[10],
                            "promoter": items[11],
                            "isPromoter": currentAccount === promoter ? true : false,
                            "isEmpty": ethers.utils.formatUnits(items[9], 18) === "0.0" ? true : false,
                            "contractAddr": addressSmAC
                        }

                        // Important variables
                        let now = new Date();
                        let timeNow = now.getTime();
                        let hasFunds = (object.coffer > 0);
                        let hasBudget = (object.budget > 0);
                        let hasExpired = ((object.expired * 1000) <= timeNow);
                        let notPromoter = (object.isPromoter === false); // Check that the current account is not the promoter.

                        // Fitler for ads that are not running, but have funds
                        if (hasExpired && hasFunds && hasBudget && notPromoter) {
                            ads.push(object);
                        }
                    };

                    // get all ads
                    setAds(ads);
                }
            } catch (e) {
                // Error Handling
                alert(e);
            }

            // Stop loading
            setIsLoading(false);
        }

        // Returning function when the screen finish loading
        onLoad();

        // Avoid data leaks by cleaning up useEffect with "unmounted" variable set to true and remove ads
        return () => {
            unmounted = true;
            setAds([]);
        };

    // Our clean up happens when we leave the page and the defaultAccount changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultAccount]);

// ----------------------------------------------------------------------
    // Handling submitted data
    // use `contractAddr` to create a new SmAC
// ----------------------------------------------------------------------
    async function handleClaimBounty(contractAddr) {
        // Disable the submit button to avoid multiple requests
        setHasSubmitted(true);
        setIsCleaning(true);

        try {
            // ------------------------------------------------------
            // Get the account key word to verify with its approved hash
            // ------------------------------------------------------
            function loadHash() {
                return API.get("hashes", `/hash/filter/${defaultAccount}`);
            }

            // Get the list of all defaultAccount hashes
            const hash = await loadHash();

            // sort by created date
            // return the latest created hash date in the first element "[0]"
            const latestHash = hash.sort(function (a, b) {
                return b.createdAt - a.createdAt;
            });

            // ------------------------------------------------------
            // Get a new unapproved hash
            // ------------------------------------------------------
            function loadNewHash() {
                return API.get("hashes", `/hash/newHashes`);
            }

            // Return hashes
            const newHash = await loadNewHash();
            // Pick a Random hash 
            const randomHash = newHash[Math.floor(Math.random() * newHash.length)];

            // ------------------------------------------------------
            // Create a new contract
            // ------------------------------------------------------
            const contractSmAC = new ethers.Contract(contractAddr, abiSmaC, signer);
            // Connect the signer to the contract
            const SmACWithSigner = contractSmAC.connect(signer);

            // ------------------------------------------------------
            // Call delegateCleaner() function in SmAC.
            // ------------------------------------------------------
            SmACWithSigner
                .delegateCleaner(latestHash[0].wordId, randomHash.hashedWord)
                .then(() => {
                    // Reload the page when the call is successfull.                    
                    SmACWithSigner.once("DelegateCleaner", (claimer, reward) => {
                        // Perform update in database
                        updateRequests(latestHash[0].wordId, randomHash.createdAt, randomHash.prefix);
                    });
                })
                .catch((error) => {
                    // Set submitted to false if the user 
                    // rejects the transaction.
                    if (error.code === 4001 || error.code === -32603) {
                        setHasSubmitted(false)
                        setIsCleaning(false)
                    }
                });

        } catch (e) {
            // Error Handling
            alert(e.message);
            setIsCleaning(false)
        }
    }
    // ----------------------------------------------------------------------
    // Performing important updates to database
    // ----------------------------------------------------------------------
    async function updateRequests(key, time, prefix) {

        // (1) Remove _ the revealed hash from our database
        await deleteHash(key);
        // (2) Set _ a new hash for the default account
        await setDefaultAccountHash({ time, prefix, "address": defaultAccount });
        // (3) Generate _ new hashes
        await createHash();

        // Redirect user
        window.location.reload();
    }

    // ----------------------------------------------------------------------
    // Deleting hash from DynamoDB
    // ----------------------------------------------------------------------
    function deleteHash(hash) {
        // Delete post based on "id" - Current user
        return API.del("hashes", `/hash/del/${hash}`);
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
// ----------------------------------------------------------------------
    return (
        <main className="App container-fluid" >
            {!isLoading
                // When the page has finish loading --------------------- >
                ? <>
                    {ads.length === 0
                        // When there are no available SmAC ------------- >
                        ? <NoAvailableAds />

                        // When there are SmAC -------------------------- >
                        : <AvailableAds ads={ads} handleClaimBounty={handleClaimBounty} hasSubmitted={hasSubmitted} isCleaning={isCleaning} />
                    }
                </>

                // When the page is loading ----------------------------- >
                : <Loader />
            }            
        </main>
        );
}

// ----------------------------------------------------------------------
// AvailableAds Component
// Return SmAC
// ----------------------------------------------------------------------
function AvailableAds(props) {
    // Important variables
    const { ads, handleClaimBounty, hasSubmitted, isCleaning } = props;

    // Return UI
    return (
        <section className="row px-3">
            {/* 
             * Mapping each "ads" as "ad" ------------------------------- >
             */}
            {ads.map((ad) => {
                // Return UI
                return (
                    <Fragment key={ad.id}>
                        {/* 
                         * --------------------------------------------- >
                         * Card Component
                         * "button" help display card buttons based on the page
                         * --------------------------------------------- >
                         * */}
                        <Card
                            id={ad.id}
                            button="bounty"
                            title={ad.title}
                            claim={ad.coffer}
                            budget={ad.budget}
                            coffer={ad.coffer}
                            reward={ad.reward}
                            key={"card" + ad.id}
                            expired={ad.expired}
                            contractAddr={ad.contractAddr}
                        />

                        {/* 
                         * -------------------------------------------- >
                         * Modal Component
                         * When "false", the element won't show in the modal
                         * -------------------------------------------- >
                         * */}
                        <Modal
                            id={ad.id}
                            link={ad.link}
                            budget={false}
                            button="bounty"
                            title={ad.title}
                            claim={ad.coffer}
                            canReport={false}
                            coffer={ad.coffer}
                            reward={ad.reward}
                            created={ad.created}
                            expired={ad.expired}
                            key={"modal" + ad.id}
                            claimers={ad.claimers}
                            promoter={ad.promoter}
                            isCleaning={isCleaning}
                            scamReport={ad.scamReport}
                            hasSubmitted={hasSubmitted}
                            contractAddr={ad.contractAddr}
                            handleClaimBounty={handleClaimBounty}
                        />
                    </Fragment>
                )
            })}
        </section>
    );
}