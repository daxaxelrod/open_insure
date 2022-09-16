FROM python:3.9

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

LABEL maintainer="David Axelrod daxaxelrod@gmail.com"

RUN pip install pipenv
RUN pip install gunicorn
RUN apt-get update

ARG EMAIL_PASSWORD=${EMAIL_PASSWORD}
ARG env=${env}
ARG APP_PORT=${APP_PORT}

WORKDIR /var/app
COPY . ${PROJECT_DIR}
RUN PIPENV_VENV_IN_PROJECT=1 pipenv install --deploy --system


EXPOSE 8000 8000

RUN ["chmod", "+x", "/var/app/boot.sh"]
CMD ./boot.sh
