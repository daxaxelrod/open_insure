import logging
from escrow.agents.Base import Agent

logger = logging.getLogger(__name__)

class LoggingAgent(Agent):

    def __init__(self, name, balance):
        super().__init__(name, balance)
        logger.error(f"USING SIMPLE LOGGING ESCROW AGENT, not meant for production use")
        self.log = []
    pass
