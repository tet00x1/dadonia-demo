from django.urls import path
from apps.audit import views

urlpatterns = [
    path('activity/', views.activity_dashboard_view, name='activity_dashboard'),
]
