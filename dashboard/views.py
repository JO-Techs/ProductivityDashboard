from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import TodoItem, CalendarEvent, Note, Bookmark, ShoppingItem, DailyPlan, Project, ProjectTask
from .serializers import (
    TodoItemSerializer, CalendarEventSerializer, NoteSerializer, 
    BookmarkSerializer, ShoppingItemSerializer, DailyPlanSerializer,
    ProjectSerializer, ProjectTaskSerializer
)

# API ViewSets
class TodoItemViewSet(viewsets.ModelViewSet):
    queryset = TodoItem.objects.all()
    serializer_class = TodoItemSerializer

class CalendarEventViewSet(viewsets.ModelViewSet):
    queryset = CalendarEvent.objects.all()
    serializer_class = CalendarEventSerializer

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

class BookmarkViewSet(viewsets.ModelViewSet):
    queryset = Bookmark.objects.all()
    serializer_class = BookmarkSerializer

class ShoppingItemViewSet(viewsets.ModelViewSet):
    queryset = ShoppingItem.objects.all()
    serializer_class = ShoppingItemSerializer

class DailyPlanViewSet(viewsets.ModelViewSet):
    queryset = DailyPlan.objects.all()
    serializer_class = DailyPlanSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class ProjectTaskViewSet(viewsets.ModelViewSet):
    queryset = ProjectTask.objects.all()
    serializer_class = ProjectTaskSerializer

# Dashboard View
def dashboard(request):
    return render(request, 'dashboard/dashboard.html')

def home(request):
    return render(request, 'dashboard/home.html')

def todos(request):
    return render(request, 'dashboard/todos.html')

def notes(request):
    return render(request, 'dashboard/notes.html')

def bookmarks(request):
    return render(request, 'dashboard/bookmarks.html')

def shopping(request):
    return render(request, 'dashboard/shopping.html')

def planner(request):
    return render(request, 'dashboard/planner.html')

def projects(request):
    return render(request, 'dashboard/projects.html')

def calendar(request):
    return render(request, 'dashboard/calendar.html')

# API Overview
@api_view(['GET'])
def api_overview(request):
    api_urls = {
        'Todo List': '/api/todos/',
        'Calendar Events': '/api/events/',
        'Notes': '/api/notes/',
        'Bookmarks': '/api/bookmarks/',
        'Shopping Items': '/api/shopping/',
        'Daily Plans': '/api/daily-plans/',
        'Projects': '/api/projects/',
        'Project Tasks': '/api/tasks/',
    }
    return Response(api_urls)