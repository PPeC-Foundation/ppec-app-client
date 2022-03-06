// React Required --------------------------------------
import React, { useEffect, useState, Fragment } from 'react';
// Ampligy Required ------------------------------------
import { API } from "aws-amplify";
// Components ------------------------------------------
import Card from "../components/Card";
import Modal from "../components/ModalPages";
import NoAvailableAds from "../components/NoAvailableAds";
import Loader from "../components/GettingAdsLoader";
// Libs ------------------------------------------------
// usaAppContext stores - App.js - variables for the entire application
import { useAppContext } from "../libs/contextLib";
//------------------------------------------------------ \\
// This file is exported to ---> src/Routes.js
// we use "ads" ----> "SmAC"
// we use "myads" ----> "U|SmAC"
// -------------- Application Begins Bellow ------------ //

// Main Function - Ads
export default function Ads() {
    // Important variables
    const { ethers, defaultAccount, contractSmACCor, abiSmaC, signer, provider, chainId, providerId } = useAppContext();
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isClaiming, setIsClaiming] = useState(false);
    const [ads, setAds] = useState([]);

// ----------------------------------------------------------------------
    // Load All Ads - Ads that have not expired and have been funded.
// ----------------------------------------------------------------------
    useEffect(() => {
        // Cleanup variable
        let unmounted = false;

        // Load All Ads
        async function onLoad() {
            try {
                // Check that we have not unmounted
                if (!unmounted && contractSmACCor != null) {
                    // Contract Information
                    const SmACCor = await contractSmACCor.contractInfo();
                    // Get the ad count for the for loop
                    const adCount = SmACCor[1].toNumber();
                    // Create a new array
                    const ads = [];

                    // Get current account ads - Looping through our array backward - MoonWalk JS ;)
                    for (let i = adCount - 1; i >= 0; i--) {
                        // Get the ad contract address
                        const ad = await contractSmACCor.advertisements(i);
                        // Set the ad contract address
                        const addressSmAC = ad.toString();
                        // Create a new contract
                        // If the user is connect return new contract for signer else return new contract for provider
                        const contractSub = new ethers.Contract(addressSmAC, abiSmaC, (defaultAccount != null && chainId === providerId ? signer : provider));

                        // Get contract information
                        const items = await contractSub.getInfo();
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
                        let notClaimed = (object.hasClaimed === false); // Check that the current account has not claimed.
                        let notPromoter = (object.isPromoter === false); // Check that the current account is not the promoter.
                        let hasEnoughReward = (Number(object.reward) <= Number(object.coffer)); // Check that there is enough reward to be claimed.
                        let hasNotExpired = ((object.expired * 1000) > timeNow); // Check that the ad is running.

                        // Fitler for ads that are running, and have funds.
                        if (hasEnoughReward && notPromoter && notClaimed && hasNotExpired ) {
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
    }, [defaultAccount, chainId, contractSmACCor]);

// ----------------------------------------------------------------------
    // Claim smart ad reward
// ----------------------------------------------------------------------
    async function handleClaim(contractAddr, link) {
        // Disable the submit button to avoid multiple requests
        setHasSubmitted(true);
        setIsClaiming(true);

        try {

            function loadHash() {
                return API.get("hashes", `/hash/filter/${defaultAccount}`);

            }

            function loadNewHash() {
                return API.get("hashes", `/hash/newHashes`);
            }

            const hash = await loadHash();
            const newHash = await loadNewHash();
            // Pick a Random hash 
            const randomHash = newHash[Math.floor(Math.random() * newHash.length)];

            // Create a new contract
            const contractSmAC = new ethers.Contract(contractAddr, abiSmaC, signer);
            // Connect the signer to the contract
            const SmACWithSigner = contractSmAC.connect(signer);

            // Call claim() function in SmAC
            SmACWithSigner
                .claim(hash[0].wordId, randomHash.hashedWord)
                .then(() => {
                    // Redirect user to the promoter's page
                    // once the claim is successfull.
                    SmACWithSigner.once("Claim", (event) => {
                        // Perform update in database
                        updateRequests(hash[0].wordId, randomHash.createdAt, randomHash.prefix, link);
                    });                    
                })
                .catch((error) => {
                    // Set submitted to false if the user 
                    // rejects the transaction.
                    // 4001 : user rejected transaction error
                    if (error.code === 4001 || error.code === -32603) {
                        setHasSubmitted(false);
                        setIsClaiming(false);
                    }
                });

        } catch (e) {
            // Error Handling
            alert(e.message);
            setIsClaiming(false);
        }
    }

    // ----------------------------------------------------------------------
    // Performing important updates to database
    // ----------------------------------------------------------------------
    async function updateRequests(key, time, prefix, link) {

        // (1) Remove _ the revealed hash from our database
        await deleteHash(key);
        // (2) Set _ a new hash for the default account
        await setDefaultAccountHash({ time, prefix, "address": defaultAccount });
        // (3) Generate _ new hashes
        await createHash();

        // Replace the current window with the promoter link
        window.location.replace(link);
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
    return (
        <main className="App container-fluid">
            {!isLoading
                // When the page has finish loading --------------------- >
                ? <>
                    {ads.length === 0
                        // When there are no available SmAC ------------- >
                        ? <NoAvailableAds />

                        // When there are SmAC -------------------------- >
                        : <AvailableAds ads={ads} handleClaim={handleClaim} hasSubmitted={hasSubmitted} isClaiming={isClaiming} />
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
// Return available Ads/SmAC
// ----------------------------------------------------------------------
function AvailableAds(props) {
    // Important variables
    const { ads, handleClaim, hasSubmitted, isClaiming } = props;

    // Return UI
    return (
        <section className="row px-3">
            {/* 
             * Mapping each "ads" as "ad" ------------------------------ >
             */}
            {ads.map((ad) => {
                // Return UI
                return (
                    <Fragment key={"card" + ad.id}>
                        {/* 
                         * --------------------------------------------- >
                         * Card Component
                         * "button" help display card buttons based on the page
                         * --------------------------------------------- >
                         * */}
                        <Card
                            id={ad.id}
                            key={"card" + ad.id}
                            button="ads"
                            title={ad.title}
                            claim={ad.reward}
                            budget={ad.budget}
                            coffer={ad.coffer}
                            reward={ad.reward}
                            expired={ad.expired}
                            contractAddr={ad.contractAddr}
                            hasClaimed={ad.hasClaimed}
                        />

                        {/* 
                         * -------------------------------------------- >
                         * Modal Component
                         * When "false", the element won't show in the modal
                         * -------------------------------------------- >
                         * */}
                        <Modal
                            id={ad.id}
                            button="ads"
                            link={ad.link}
                            coffer={false}
                            budget={false}
                            title={ad.title}
                            canReport={true}
                            claim={ad.reward}
                            reward={ad.reward}
                            created={ad.created}
                            expired={ad.expired}
                            key={"modal" + ad.id}
                            claimers={ad.claimers}
                            promoter={ad.promoter}
                            isClaiming={isClaiming}
                            handleClaim={handleClaim}
                            scamReport={ad.scamReport}
                            hasSubmitted={hasSubmitted}
                            contractAddr={ad.contractAddr}
                        />
                    </Fragment>
                );
            })}
        </section>
        );
}