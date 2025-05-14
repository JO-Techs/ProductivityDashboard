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

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('api/', views.api_overview, name='api-overview'),
    path('api/', include(router.urls)),
]