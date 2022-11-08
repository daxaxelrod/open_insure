import React from "react";
import { validate_bitcoin_address } from "../../../utils/stringUtils";
import venmoLogo from "../../../../assets/images/escrow/venmo-logo.jpg";
import bitcoinLogo from "../../../../assets/images/escrow/bitcoin-logo.png";

export default function EscrowPoolAddressInlineDisplay({
    address,
}: {
    address: string;
}) {
    // if the string looks like a btc wallet address, link to wallet explorer
    // otherwise just assume its a venmo address, loads more work to do before escrow is ready
    if (!address) {
        return <div>Not Set</div>;
    }
    let isValidBtcAddress = validate_bitcoin_address(address);
    if (isValidBtcAddress) {
        return (
            <a
                target={"_blank"}
                onClick={(event) => event.stopPropagation()}
                href={`https://www.blockchain.com/btc/address/${address}`}
                style={{
                    display: "flex",
                    alignItems: "center",
                }}
                rel="noreferrer"
            >
                <img
                    src={bitcoinLogo}
                    style={{ height: 20, width: 20, marginRight: 8 }}
                    alt="Bitcoin logo"
                />
                Bitcoin Wallet
            </a>
        );
    } else {
        return (
            <a
                target={"_blank"}
                onClick={(event) => event.stopPropagation()}
                href={`https://account.venmo.com/u/${address}`}
                rel="noreferrer"
                style={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <img
                    src={venmoLogo}
                    style={{ height: 18, width: 18, marginRight: 8 }}
                    alt="Venmo logo"
                />
                {address}
            </a>
        );
    }
}
