from random import random
import string

import random


def random_string_generator(str_size=32, allowed_chars=string.ascii_letters):
    return "".join(random.choice(allowed_chars) for x in range(str_size))
