
COVERAGE_TYPES = [
    ("m_property", "Minor Property"),
    ("renters", "Renter's"),
    # ("pet", "Pet"),
]

PREMIUM_POOL_TYPE = [
    ("perpetual_pool", "Perpetual Pool"),
    # ("capped_pool", "Capped Pool"),
    # ("capital_call", "Capital Call"),
]

POLICY_GOVERNANCE_TYPES = [
    # direct_democracy
    # Every claim needs to be voted on by all members of the policy
    ("direct_democracy", "Direct Democracy"),
    
    # forced_commitee (Not implemented)
    # Claims are approved by a randomly chosen, timeboxed committee
    # Sort of like jury duty where you get picked
    # ("forced_commitee", "Forced Commitee"),
    
    # voluntary_commitee (Not implemented)
    # People vote at the beginning of the policy for who gets to be the claims officator
    # ("voluntary_commitee", "Voluntary Commitee"),
]

# determines what questions to ask in the risk form
# and then used to determine the risk score which is used to determine the premium a user pays
UNDERLYING_INSURED_TYPE = [
    ("cell_phone", "Phone"),
    ("audio_equipment", "Audio Equipment")
]

PREMIUM_PAYMENT_FREQUENCY_CHOICES = [
    (1, "Monthly"),
    (3, "Quarterly"),
    (12, "Yearly"),
]

CLAIM_EVIDENCE_TYPE_CHOICES = [
    ('photo', 'Photo'),
    ('video', 'Video'),
    ('document', 'Document'),
]