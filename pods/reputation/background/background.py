import json
from pods.models import Education, Experience, Interest, RegionInfo, User
from linkedin_scraper import Person

# source data sets
# region_info https://corgis-edu.github.io/corgis/json/state_crime/


def get_reputation_from_background(user: User, linkedin_profile: Person):
    education = user.education.all()
    experience = user.experience.all()
    interests = user.interests.all()
    region_info = user.region_info.all()

    total_score = 0

    if education:
        total_score += determine_edu_score(education)
    if experience:
        total_score += determine_exp_score(experience)
    if interests:
        total_score += determine_interest_score(interests)
    if region_info:
        total_score += determine_region_info_score(region_info)

    
    return total_score

def determine_edu_score(education: list[Education]):
    has_bachelors = False
    for edu in education:
        if edu.institution_name.includes("University") or edu.institution_name.includes("College"):
            has_bachelors = True
    if has_bachelors:
        return 25
    else:
        if len(education) > 0:
            return 15
        return 10


def determine_exp_score(experience: list[Experience]):
    return 0


def determine_interest_score(interests: list[Interest]):
    return 0


def determine_region_info_score(region_info: list[RegionInfo]):
    referenceData = json.load(open("./2019_ranked_state_crime.json"))
    state = region_info.state
    crime_rank = referenceData[state]["Rank"]
    return (52 - crime_rank / 52) * 25

    

