import unittest


def suite():
    return unittest.TestLoader().discover("policies.tests", pattern="*.py")
