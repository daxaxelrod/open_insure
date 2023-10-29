"""
Django settings for open_insure project.

Generated by 'django-admin startproject' using Django 4.0.2.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.0/ref/settings/
"""
from datetime import timedelta
import os
import environ
import sys
from pathlib import Path

# read config from .env file
env = environ.Env(
    DEBUG=(bool, False),
    IS_MAIN_SCHEDULER=(bool, False),
    PG_HOST=(str, "localhost"),
    PG_PORT=(int, 5432),
    PG_USER=(str, "postgres"),
    PG_PASSWORD=(str, "postgres"),
    PG_DBNAME=(str, "open_insure"),
    NOTIFY_ADMINS_OF_EVENTS=(bool, False),
    DESIRED_CONTRIBUTION_TO_PREMIUM_CONFIDENCE_LEVEL=(float, 0.95),
    REPUTATION_REFRESH_COOLDAY_DAYS=(int, 7),
)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env("DEBUG")

TESTING = "test" in sys.argv

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "192.168.0.104",
    "192.168.1.17",
    "[::1]",
]
CORS_ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:8000"]
CSRF_TRUSTED_ORIGINS = ["http://localhost:3000"]


ADMIN_EMAIL = env("ADMIN_EMAIL")

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt",
    "pods",
    "policies",
    "elections",
    "gatherer",
]
IS_MAIN_SCHEDULER = env("IS_MAIN_SCHEDULER")
if IS_MAIN_SCHEDULER:
    INSTALLED_APPS.append("django_apscheduler")

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "open_insure.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "open_insure.wsgi.application"


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {
    # 'default': {
    #     'ENGINE': 'django.db.backends.postgresql',
    #     'NAME': env('PG_DBNAME'),
    #     'USER': env('PG_USER'),
    #     'PASSWORD': env('PG_PASSWORD'),
    #     'HOST': env('PG_HOST'),
    #     'PORT': env('PG_PORT'),
    # },
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

AUTH_USER_MODEL = "pods.User"


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = "static/"
STATIC_ROOT = "/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
MEDIA_URL = "/media/"

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# Auth standard is JWT,
# I've mostly used token authentication, but jwt saves a db hit for each request
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}
# tried to do this inline, but it didn't work
if DEBUG or TESTING:
    REST_FRAMEWORK["DEFAULT_AUTHENTICATION_CLASSES"].append(
        "rest_framework.authentication.SessionAuthentication"
    )

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=int(env("ACCESS_TOKEN_LIFETIME_MINUTES"))
    ),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=int(env("REFRESH_TOKEN_LIFETIME_DAYS"))),
    "UPDATE_LAST_LOGIN": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_OBTAIN_SERIALIZER": "pods.serializers.TokenObtainPairSerializer",
}

ESCROW_AGENT = env("ESCROW_AGENT")
# more escrow agent config from env ...
DESIRED_CONTRIBUTION_TO_PREMIUM_CONFIDENCE_LEVEL = env(
    "DESIRED_CONTRIBUTION_TO_PREMIUM_CONFIDENCE_LEVEL"
)

REPUTATION_REFRESH_COOLDAY_DAYS = env("REPUTATION_REFRESH_COOLDAY_DAYS")

if IS_MAIN_SCHEDULER:
    APSCHEDULER_DATETIME_FORMAT = "N j, Y, f:s a"
    APSCHEDULER_RUN_NOW_TIMEOUT = 25  # Seconds

if TESTING:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
else:
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    EMAIL_HOST = env("EMAIL_HOST")
    EMAIL_PORT = env("EMAIL_PORT")
    EMAIL_HOST_USER = env("EMAIL_HOST_USERNAME")
    EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")

FRONTEND_URL = env("FRONTEND_URL")

LOG_DIR = os.path.join(BASE_DIR, "logs")
LOG_FILE = "/api.log"
LOG_PATH = LOG_DIR + LOG_FILE

# send admins an email when important events happen
NOTIFY_ADMINS_OF_EVENTS = env("NOTIFY_ADMINS_OF_EVENTS")
DEFAULT_FROM_EMAIL = "Open Insure <noreply@openinsure.app>"  # todo, env-ify

LOGGING = {
    "version": 1,
    "formatters": {
        "verbose": {
            "format": "%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s"
        },
        "simple": {"format": "%(levelname)s %(message)s"},
    },
    "handlers": {
        "console": {
            "level": "INFO",
            "class": "logging.StreamHandler",
            "formatter": "simple",
        },
        "file": {
            "level": "DEBUG",
            "class": "logging.FileHandler",
            "filename": LOG_PATH,
            "formatter": "simple",
        },
        "request_handler": {
            "level": "DEBUG",
            "class": "logging.FileHandler",
            "filename": LOG_DIR + "/requests.log",
            "formatter": "verbose",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["file"],
            "level": "INFO",
            "propagate": True,
        },
        "django.request": {
            "handlers": ["request_handler"],
            "level": "DEBUG",
            "propagate": False,
        },
    },
}

# for deeper debugging, uncomment the following
if DEBUG:
    # make all loggers use the console.
    for logger in LOGGING["loggers"]:
        LOGGING["loggers"][logger]["handlers"] = ["console"]

if TESTING:
    LOGGING = {}
