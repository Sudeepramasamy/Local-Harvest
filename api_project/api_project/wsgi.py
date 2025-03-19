import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api_project.settings')

# Run migrations before application starts
from django.core.management import execute_from_command_line
execute_from_command_line(['manage.py', 'migrate'])

application = get_wsgi_application()
