from django.shortcuts import render
from rest_framework import viewsets, permissions

from .models import Task
from .serializers import TaskSerializer
from .permissions import IsOwner

# Create your views here.
class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        # Return only tasks that belong to the authenticated user
        return Task.objects.filter(owner=self.request.user).order_by('-created_at')
    
