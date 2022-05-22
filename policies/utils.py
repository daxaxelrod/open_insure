import random
import string

from pods.models import User

uuid_regex = "[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}"
hash_regex = "[0-9a-f]{64}"

def email_present(email):
    if User.objects.filter(email=email).exists():
        return True
    return False

def random_string_generator(size, chars=string.ascii_lowercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

def unique_code_generator(instance, attr, size=16, klass=None):
    #attr is the instances's key that we are saving the code
    # allows for the lookup check
    key = random_string_generator(size)
    if klass is not None: # allow for the user to just pass in the class reference
        Klass = klass
    else:
        Klass = instance.__class__
    qs_exists = Klass.objects.filter(**{
        attr: key
    }).exists()
    if qs_exists:
        return unique_code_generator(instance)
    return key