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

// Main Function - DigestAds
export default function DigestAds() {
    // Important variables
    const { ethers, defaultAccount, contractSmACCor, abiSmaC, provider } = useAppContext();
    const [ads, setAds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

// ----------------------------------------------------------------------
    // Load Digest Ads - Ads that have not expired and not funded.
// ----------------------------------------------------------------------
    useEffect(() => {
        // Cleanup variable
        let unmounted = false;

        // Load Digest Ads
        async function onLoad() {

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
                        const contractSub = new ethers.Contract(addressSmAC, abiSmaC, provider);

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
                        let notFunded = (Number(object.coffer) === 0);
                        let hasBudget = (object.budget > 0);
                        let hasNotExpired = ((object.expired * 1000) > timeNow);

                        // Fitler for ads that are running, but not funded 
                        if (notFunded && hasBudget && hasNotExpired) {
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
    // Return UI
// ----------------------------------------------------------------------
    return (
        <main className="App container-fluid">
            {!isLoading
                // When the page has finish loading --------------------- >
                ? <>
                    {ads.length === 0
                        // When there are no available SmAC ------------- >
                        ? <NoAvailableAds />

                        // When there are SmAC -------------------------- >
                        : <WithAds ads={ads} />
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
    const { ads } = props;

    // Return UI
    return (
        <section className="row px-3">
            {/* 
             * Mapping each "ads" as "ad" ------------------------------- >
             */}
            {ads.map((ad) => {
                // Return UI
                return (
                    <Fragment>
                        {/* 
                         * --------------------------------------------- >
                         * Card Component
                         * "button" help display card buttons based on the page
                         * --------------------------------------------- >
                         * */}
                        <Card
                            id={ad.id}
                            button="digest"
                            title={ad.title}
                            claim={ad.reward}
                            budget={ad.budget}
                            coffer={ad.coffer}
                            reward={ad.reward}
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
                            coffer={false}
                            budget={false}
                            button="digest"
                            title={ad.title}
                            claimers={false}
                            canReport={false}
                            claim={ad.reward}
                            reward={ad.reward}
                            created={ad.created}
                            expired={ad.expired}
                            promoter={ad.promoter}
                            scamReport={false}
                            contractAddr={ad.contractAddr}
                        />
                    </Fragment>
                );
            })}
        </section>
    );
}