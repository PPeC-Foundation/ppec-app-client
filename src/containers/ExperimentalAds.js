// React Required --------------------------------------
import React, { Fragment, useEffect, useState } from 'react';
// Components ------------------------------------------
import Card from "../components/Card";
import Modal from "../components/ModalPages";
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
    const { ethers, defaultAccount, contractSmACCor, abiSmaC, signer, contractPPeC } = useAppContext();
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [ads, setAds] = useState([]);
    const [numberOfAds, setNumberOfAds] = useState(0);

// ----------------------------------------------------------------------
    // Load Account Ads
// ----------------------------------------------------------------------
    useEffect(() => {
        // Cleanup variable
        let unmounted = false;

        // Update post view - count only
        async function onLoad() {
            try {
                // Check that we have not unmounted
                if (!unmounted) {
                    // Get the ad count for the for loop
                    const adCount = await contractSmACCor.promoterAdCount(defaultAccount);
                    // Create a new array
                    let ads = [];

                    // Get current account ads - Looping through our array backward - MoonWalk JS ;)
                    for (let i = 0; i < (numberOfAds > Number(adCount) ? adCount : numberOfAds); i++) {
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
                        ads.unshift(object);
                    };
                    // get all ads
                    setAds(ads);
                }
            } catch (e) {
                // Error Handling
                alert(e);
            }
        }

        // Return the loaded function
        onLoad();

        // Avoid data leaks by cleaning up useEffect with "unmounted" variable set to true and remove ads
        return () => {
            unmounted = true;
            setAds([]);
        };

        // Our clean up happens when we leave the page and the defaultAccount changes
    }, [defaultAccount, numberOfAds]);

// ----------------------------------------------------------------------
    // Transfer tokens to smart ad
// ----------------------------------------------------------------------
    function handleTransfer(contractAddr, budget, modalId) {

        try {
            // Create a new contract
            const PPeCWithSigner = contractPPeC.connect(signer);
            // Set the fund to transfer to the smart ad
            const fund = ethers.utils.parseUnits(String(budget), 18);

            // Call transfer function in PPeC
            PPeCWithSigner.transfer(contractAddr, fund);

            // When the call is successfull reload the page
            PPeCWithSigner.on("Transfer", (event) => {
                setHasSubmitted(true);
                PPeCWithSigner.off("Transfer");
                //window.location.replace("/myads");
                //setNewRequest(Date.now())
                ("#" + modalId).modal("hide");
                console.log(modalId);
                console.log("#" + modalId);
            });

        } catch (e) {
            // Error Handling
            alert(e.message);
        }
    }

// ----------------------------------------------------------------------
    // Destroy the smart ad
// ----------------------------------------------------------------------
    function handleDestroy(contractAddr) {

        try {
            // Create a new contract
            const contractSmAC = new ethers.Contract(contractAddr, abiSmaC, signer);
            // Connect the signer to the contract
            const SmACWithSigner = contractSmAC.connect(signer);

            // Call destroy function in SmAC
            SmACWithSigner.destroy();

            // When the call is successfull reload the page
            SmACWithSigner.on("Destroy", (event) => {
                setHasSubmitted(true);
                SmACWithSigner.off("Destroy");
                window.location.replace("/myads");
            });

        } catch (e) {

            // Error Handling
            alert(e.message);
        }
    }

// ----------------------------------------------------------------------
    // Return UI
    return (
        <main className="App container-fluid">
            <section className="row px-3">
                <div className="col-12">
                    <div class="input-group mb-3">
                        {/* Input */}
                        <input
                            min="0"
                            id="adCountx"
                            name="adCountx"
                            type="number"
                            value={numberOfAds}
                            className="form-control"          
                            onChange={e => setNumberOfAds(e.target.value)}
                        />
                        <button className="btn btn-success" type="submit"> Filter </button>
                        <label htmlFor="adCountx"> </label>
                    </div>

                </div>

                {ads.map((ad) => {
                    // Important date variables
                    const today = Date.now();
                    const hasFinished = (ad.budget == 0);
                    const hasExpiredWithBudget = (today >= ad.expired * 1000 && ad.budget > 0);
                    const hasClosed = (today >= ad.expired * 1000 && ad.coffer == 0 && ad.budget > 0);
                    const isFundedRunning = (ad.coffer > 0 && today <= ad.expired * 1000);
                    const notFundedRunning = (ad.coffer == 0 && today <= ad.expired * 1000 && ad.budget > 0);

                    // Return UI
                    return (
                        <Fragment>
                            {/* Card component */}
                            <Card
                                id={ad.id}
                                button="myAds"
                                title={ad.title}
                                claim={ad.budget}
                                budget={ad.budget}
                                coffer={ad.coffer}
                                reward={ad.reward}
                                expired={ad.expired}
                            />

                            {/* Modal component */}
                            <Modal
                                id={ad.id}
                                link={ad.link}
                                button="myAds"
                                title={ad.title}
                                canReport={false}
                                claim={ad.budget}
                                budget={ad.budget}
                                coffer={ad.coffer}
                                reward={ad.reward}
                                created={ad.created}
                                expired={ad.expired}
                                hasClosed={hasClosed}
                                claimers={ad.claimers}
                                promoter={ad.promoter}
                                hasFinished={hasFinished}
                                scamReport={ad.scamReport}
                                hasSubmitted={hasSubmitted}
                                handleDestroy={handleDestroy}
                                contractAddr={ad.contractAddr}
                                handleTransfer={handleTransfer}
                                isFundedRunning={isFundedRunning}
                                notFundedRunning={notFundedRunning}
                                hasExpiredWithBudget={hasExpiredWithBudget}
                            />
                        </Fragment>
                    );
                })}

            </section>
        </main>
        );
}