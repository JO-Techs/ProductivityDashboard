from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'todos', views.TodoItemViewSet)
router.register(r'events', views.CalendarEventViewSet)
router.register(r'notes', views.NoteViewSet)
router.register(r'bookmarks', views.BookmarkViewSet)
router.register(r'shopping', views.ShoppingItemViewSet)
router.register(r'daily-plans', views.DailyPlanViewSet)
router.register(r'projects', views.ProjectViewSet)
router.register(r'tasks', views.ProjectTaskViewSet)

app_name = 'dashboard'

# urlpatterns = [
#     path('', views.dashboard, name='dashboard'),
#     path('api/', views.api_overview, name='api-overview'),
#     path('api/', include(router.urls)),
# ]

urlpatterns = [
    path('', views.home, name='home'),
    path('todos/', views.todos, name='todos'),
    path('notes/', views.notes, name='notes'),
    path('bookmarks/', views.bookmarks, name='bookmarks'),
    path('shopping/', views.shopping, name='shopping'),
    path('planner/', views.planner, name='planner'),
    path('projects/', views.projects, name='projects'),
    path('calendar/', views.calendar, name='calendar'),
]