from pods.models import User
from linkedin_scraper import Person


def get_reputation_from_background(user: User, linkedin_profile: Person):
    education = user.education.all()
    experience = user.experience.all()
    interests = user.interests.all()
    region_info = user.region_info.all()
    
    return 100
