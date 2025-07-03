# tasks/routing.py

from django.urls import re_path
from .consumers import TaskConsumer  # make sure TaskConsumer exists

websocket_urlpatterns = [
    re_path(r"ws/tasks/$", TaskConsumer.as_asgi()),
]
