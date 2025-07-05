# todo_full_stack/celery.py

import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'todo_full_stack.settings')

app = Celery('todo_full_stack')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
