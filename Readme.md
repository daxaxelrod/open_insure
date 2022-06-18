## Open insure

Take control of your insurance
- Browse and pick insurance policies that are right for you
- If premiums are not paid out for claims, they get returned to you at the end of the period
- Manage claims against your policies with a direct democracy

#### Apps overview

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

# Development 
### Setup

1. Copy .env.example to .env
2. Run the following commands:
```bash
  pipenv install
  
  pipenv run python manage.py migrate
  
  pipenv run python manage.py createsuperuser

  pipenv run python manage.py runserver 
```
Note: database is all sqlite, proper db settings setup to come

For development notes see: [roadmap.md](./roadmap.md)

### setup help

If you're running on a mac you might need to set up postgres for psycopg2, pythons postgresql driver:
```
brew install libpq --build-from-source
brew install openssl

export LDFLAGS="-L/opt/homebrew/opt/openssl@1.1/lib -L/opt/homebrew/opt/libpq/lib"
export CPPFLAGS="-I/opt/homebrew/opt/openssl@1.1/include -I/opt/homebrew/opt/libpq/include"

pipnev install
```