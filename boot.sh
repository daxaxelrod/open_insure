#!/bin/bash

python manage.py migrate

gunicorn open_insure.wsgi:application --access-logfile=- --bind 0.0.0.0:8000 --capture-output --enable-stdio-inheritance 
