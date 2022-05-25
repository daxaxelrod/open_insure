## Open insure

A platform that lets you take control of your own insurance

#### Model list

Pods
  - User profile
  - Groups of users
  - Permissions/Roles
  - User authentication

Policies
  - Coverage types (e.g. property, renters, etc.)
  - Policy types (Capped Pool, Perpetual Pool, Capital Call)
  - Claims
    - Settlement type (Commitee or direct democracy)
    - Claim evidence (Pictures, statements)

Development 
# Setup
Copy .env.example to .env and then run
```pipenv install```
```pipenv run python manage.py migrate```
```pipenv run python manage.py createsuperuser```
```pipenv run python manage.py runserver```
