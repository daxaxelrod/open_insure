import logging
from escrow.agents.Base import Agent


logger = logging.getLogger(__name__)

class LoggingAgent(Agent):

    def __init__(self, name, balance):
        super().__init__(name, balance)
        logger.error(f"USING SIMPLE LOGGING ESCROW AGENT, not meant for production use")
        self.log = []
    pass

    def deposit(address, amount):
        logger.info(f"Depositing {amount} to {address}")

    def withdraw(address, amount):
        logger.info(f"Withdrawing {amount} from {address}")

    def get_balance_for_policy(address):
        logger.info(f"Getting balance for policy {address}")
