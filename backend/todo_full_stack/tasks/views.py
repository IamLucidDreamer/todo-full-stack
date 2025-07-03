from rest_framework import viewsets
from rest_framework.decorators import action , api_view
from rest_framework.response import Response
from django.utils import timezone

from .models import Task
from .serializers import TaskSerializer

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer

    def broadcast_task_event(self, event_type, task_data):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "tasks",  
            {
                "type": "task_update", 
                "payload": {
                    "event": event_type,
                    "task": task_data
                }
            }
        )

    def perform_create(self, serializer):
        task = serializer.save()
        self.broadcast_task_event("TASK_CREATED", TaskSerializer(task).data)

    def perform_update(self, serializer):
        task = serializer.save()
        self.broadcast_task_event("TASK_UPDATED", TaskSerializer(task).data)

    def perform_destroy(self, instance):
        task_data = TaskSerializer(instance).data
        instance.delete()
        self.broadcast_task_event("TASK_DELETED", task_data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        task = self.get_object()
        if timezone.now() <= task.deadline:
            task.status = 'success'
        else:
            task.status = 'failure'
        task.save()
        return Response(self.get_serializer(task).data)


@api_view(['GET'])
def api_status(request):
    return Response({"status": "API v1 is up and running"})
