# start_streamlit.py

import subprocess
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Starts Django and Streamlit servers'

    def handle(self, *args, **options):
        # Start Django server
        django_process = subprocess.Popen(['python', 'manage.py', 'runserver'])

        # Start Streamlit server
        streamlit_process = subprocess.Popen(['streamlit', 'run', 'app.py'])

        try:
            django_process.wait()  # Wait for Django server to finish
        except KeyboardInterrupt:
            # Terminate Streamlit process if Django server is interrupted
            streamlit_process.terminate()
