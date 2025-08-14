from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'completed', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        # Automatically set the owner of the task to the current user
        user = self.context['request'].user
        return Task.objects.create(owner=user, **validated_data)