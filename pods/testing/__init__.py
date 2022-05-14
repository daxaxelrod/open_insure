import unittest


def suite():
    return unittest.TestLoader().discover("pods.tests", pattern="*.py")
