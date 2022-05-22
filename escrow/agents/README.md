An escrow agent should be a service that can provide a place for premium pools to live within withdrawl/claim payout events

Attempting to be unopinionated, maybe its a stripe account, maybe its a bitcoin address or maybe even someones venmo account. 

Another idea is to use an open source billing api, killbill or lago comes to mind


Agents:
    Bitcoin
    Logging/Dummy:
        - uses redis and logging to simulate a pool
        - just used for development and debugging
    Stripe
