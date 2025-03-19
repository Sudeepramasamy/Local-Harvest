#!/bin/bash
python manage.py migrate
gunicorn --chdir api_project api_project.wsgi:application
