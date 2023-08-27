import unittest


def suite():
    return unittest.TestLoader().discover("gatherer.tests", pattern="*.py")
