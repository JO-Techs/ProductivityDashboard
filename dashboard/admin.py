from django.contrib import admin
from .models import TodoItem, CalendarEvent, Note, Bookmark, ShoppingItem, DailyPlan, Project, ProjectTask

admin.site.register(TodoItem)
admin.site.register(CalendarEvent)
admin.site.register(Note)
admin.site.register(Bookmark)
admin.site.register(ShoppingItem)
admin.site.register(DailyPlan)
admin.site.register(Project)
admin.site.register(ProjectTask)