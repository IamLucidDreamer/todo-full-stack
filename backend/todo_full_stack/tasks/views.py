from rest_framework import viewsets
from rest_framework.decorators import action , api_view
from rest_framework.response import Response
from django.utils import timezone

from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer

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
