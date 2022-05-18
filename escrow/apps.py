from asyncio.log import logger
from django.apps import AppConfig
from django.conf import settings
from escrow.agents.BitcoinAgent import BitcoinAgent
from escrow.agents.LoggingAgent import LoggingAgent

from escrow.agents.StripeAgent import StripeAgent


escrow_agent = settings["ESCROW_AGENT"]
agent = None

class EscrowConfig(AppConfig):
    name = 'escrow'
    def ready(self):
        # Initialize main escrow agent
        if escrow_agent is 'logger':
            agent = LoggingAgent()
        elif escrow_agent is 'stripe':
            agent = StripeAgent()
        elif escrow_agent is 'bitcoin':
            agent = BitcoinAgent()
        else:
            logger.info("ESCROW_AGENT not set in .env")
            agent = LoggingAgent()
