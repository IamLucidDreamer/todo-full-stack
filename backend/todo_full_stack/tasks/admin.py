from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'deadline', 'created_at')
    search_fields = ('title', 'description')
    list_filter = ('status',)
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'