// React Required --------------------------------------
import React, { Fragment, useEffect, useState } from 'react';
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

// Main Function - MyAds
export default function MyAds() {    
    // Important variables
    const { ethers, defaultAccount, contractSmACCor, abiSmaC, signer, contractPPeC, providerId, chainId } = useAppContext();
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [ads, setAds] = useState([]);
    const [newRequest, setNewRequest] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

// ----------------------------------------------------------------------
    // Load Account Ads
// ----------------------------------------------------------------------
    useEffect(() => {
        // Cleanup variable
        let unmounted = false;

        // Update post view - count only
        async function onLoad() {
            // Stop loading
            setIsLoading(true);

            try {
                // Check that we have not unmounted and default account is not null
                if (!unmounted && defaultAccount != null && chainId === providerId) { 
                    // Get the ad count for the for loop
                    const adCount = await contractSmACCor.promoterAdCount(defaultAccount);
                    // Create a new array
                    let ads = [];

                    // Get current account ads - Looping through our array backward - MoonWalk JS ;)
                    for (let i = adCount - 1; i >= 0; i--) {
                        // Get the ad contract address for the current account
                        const ad = await contractSmACCor.promoterAds(defaultAccount, i);
                        // Set the ad contract address
                        const addressSmAC = ad.toString();
                        // Create a new contract
                        const contractSmAC = new ethers.Contract(addressSmAC, abiSmaC, signer);

                        // Get contract information
                        let items = await contractSmAC.getInfo();
                        // Get pledged balance
                        let pledged = await contractSmAC.pledgedBalance();

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
                            "pledged": ethers.utils.formatUnits(pledged, 18),
                            "coffer": ethers.utils.formatUnits(items[9], 18),
                            "hasClaimed": items[10],
                            "promoter": items[11],
                            "isPromoter": defaultAccount.toLocaleUpperCase() === items[11].toLocaleUpperCase() ? true : false,
                            "contractAddr": addressSmAC
                        }
                        // Push each item to the array
                        ads.push(object);
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

        // Return the loaded function
        onLoad();

        // Avoid data leaks by cleaning up useEffect with "unmounted" variable set to true and remove ads
        return () => {
            unmounted = true;
            setAds([]);
        };

    // Our clean up happens when we leave the page and the defaultAccount changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultAccount, newRequest]);

// ----------------------------------------------------------------------
    // Transfer tokens to smart ad
// ----------------------------------------------------------------------
    function handleTransfer(contractAddr, budget) {
        // Disable the submit button to avoid multiple requests
        setHasSubmitted(true);

        try {
            // Create a new contract
            const PPeCWithSigner = contractPPeC.connect(signer);
            // Set the fund to transfer to the smart ad
            const fund = ethers.utils.parseUnits(String(budget), 18);

            // Call transfer function in PPeC
            PPeCWithSigner
                .transfer(contractAddr, fund)
                .then(() => {
                    // Relaod the page
                    // once the transfer is successfull.
                    PPeCWithSigner.once("Transfer", (event) => {
                        window.location.reload();
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
            alert(e.message);
        }
    }

// ----------------------------------------------------------------------
    // Destroy the smart ad by reclaiming PPeC and reducing pledged balance
// ----------------------------------------------------------------------
    function handleDestroy(contractAddr) {
        // Disable the submit button to avoid multiple requests
        setHasSubmitted(true);

        try {
            // Create a new contract
            const contractSmAC = new ethers.Contract(contractAddr, abiSmaC, signer);
            // Connect the signer to the contract
            const SmACWithSigner = contractSmAC.connect(signer);

            // Call destroy function in SmAC
            SmACWithSigner
                .destroy()
                .then(() => {
                    // Relaod the page
                    // once the transfer is successfull.
                    SmACWithSigner.once("Destroy", (event) => {
                        window.location.reload();
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
            alert(e.message);
        }
    }

// ----------------------------------------------------------------------
    // Return UI
    return (
        <main className="App container-fluid" >
            {!isLoading
                // When the page has finish loading --------------------- >
                ? <>
                    {ads.length === 0
                        // When there are no available SmAC ------------- >
                        ? <NoAvailableAds myads={true} />

                        // When there are SmAC -------------------------- >
                        : <WithAds
                            ads={ads}
                            hasSubmitted={hasSubmitted}
                            setNewRequest={setNewRequest}
                            handleDestroy={handleDestroy}
                            handleTransfer={handleTransfer}
                        />
                    }
                </>

                // When the page is loading ----------------------------- >
                : <Loader />
            }
        </main>
        );
}

// ----------------------------------------------------------------------
// WithAds Component
// Return SmAC
// ----------------------------------------------------------------------
function WithAds(props) {
    // Important variables
    const { ads, handleDestroy, handleTransfer, hasSubmitted, setNewRequest } = props;

    // Return UI
    return (
        <section className="row px-3">

            {/* 
             * Mapping each "ads" as "ad" -------------------------------- >
             */}
            {ads.map((ad) => {
                // Important date variables
                const today = Date.now();
                // ------------------------------------------------------- >
                // SmAC state variables for U|SmAC page
                // ------------------------------------------------------- >
                const expired = ad.expired * 1000;
                const hasCoffer = Number(ad.coffer) > 0;
                const hasBudget = Number(ad.budget) > 0;
                const hasNoCoffer = Number(ad.coffer) === 0;
                const hasNoBudget = Number(ad.budget) === 0;
                const hasExpired = today >= expired;
                const hasNotExpired = today <= expired;

                // ------------------------------------------------------- >
                // Conditional displays for U|SmAC page
                // ------------------------------------------------------- >
                // if SmAC expires with a coffer balance make it RECLAIMABLE
                const reclaimPPeC = (hasExpired && hasCoffer);
                // if SmAC not expired with coffer balance it is FUNDED RUNNING
                const isFundedRunning = (hasNotExpired && hasCoffer);
                // if SmAC expires with no budget nor coffer balance it is CLOSED
                const closed = (hasExpired && hasNoBudget && hasNoCoffer);
                // if SmAC expires with a budget but no coffer balance it can be UNPLEDGED
                const unpledgePPeC = (hasExpired && hasNoCoffer && hasBudget);
                // if SmAC not expired with no coffer balance, but a budget it is NOT FUNDED RUNNING
                const notFundedRunning = (hasNotExpired && hasNoCoffer && hasBudget);

                // Return UI
                return (
                    <Fragment key={ad.id}>
                        {/* 
                         * ----------------------------------------------- >
                         * Card component
                         * "button" help display card buttons based on the page
                         * ----------------------------------------------- >
                         * */}
                        <Card
                            id={ad.id}
                            button="myAds"
                            closed={closed}
                            title={ad.title}
                            claim={ad.budget}
                            budget={ad.budget}
                            coffer={ad.coffer}
                            reward={ad.reward}
                            expired={ad.expired}
                            reclaimPPeC={reclaimPPeC}
                            unpledgePPeC={unpledgePPeC}
                            contractAddr={ad.contractAddr}
                            isFundedRunning={isFundedRunning}
                            notFundedRunning={notFundedRunning}
                        />

                        {/* 
                         * ----------------------------------------------- >
                         * Modal component
                         * When "false", the element won't show in the modal
                         * ----------------------------------------------- >
                         * */}
                        <Modal
                            id={ad.id}
                            link={ad.link}
                            button="myAds"
                            closed={closed}
                            title={ad.title}
                            canReport={false}
                            claim={ad.budget}
                            budget={ad.budget}
                            coffer={ad.coffer}
                            reward={ad.reward}
                            created={ad.created}
                            expired={ad.expired}
                            claimers={ad.claimers}
                            promoter={ad.promoter}
                            reclaimPPeC={reclaimPPeC}
                            scamReport={ad.scamReport}
                            unpledgePPeC={unpledgePPeC}
                            hasSubmitted={hasSubmitted}
                            setNewRequest={setNewRequest}
                            handleDestroy={handleDestroy}
                            contractAddr={ad.contractAddr}
                            handleTransfer={handleTransfer}
                            isFundedRunning={isFundedRunning}
                            notFundedRunning={notFundedRunning}
                        />
                    </Fragment>
                );
            })}
        </section>
    );
}