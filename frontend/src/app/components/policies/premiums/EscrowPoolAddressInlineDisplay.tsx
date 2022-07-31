import React from "react";
function validate_bitcoin_address(btc_address: string) {
    return btc_address.match("^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$") !== null;
}

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
                onClick={(event) => event.stopPropagation()}
                href={`https://www.blockchain.com/btc/address/${address}`}
            >
                Bitcoin Wallet
            </a>
        );
    } else {
        return (
            <a
                onClick={(event) => event.stopPropagation()}
                href={`https://account.venmo.com/u/${address}`}
            >
                {address}
            </a>
        );
    }
}
