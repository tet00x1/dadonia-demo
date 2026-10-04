from django.urls import path, re_path
from apps.core import views, api

urlpatterns = [
    path('', views.home_view, name='home'),
    path('products/', views.products_view, name='products'),
    path('about/', views.about_view, name='about'),
    path('calendar/', views.seasonality_view, name='calendar'),
    path('contact/', views.contact_view, name='contact'),
    path('track/', views.track_view, name='track'),
    path('api/products/', api.api_products, name='api_products'),
    path('api/track/', api.api_track, name='api_track'),
    path('api/inquiry/', api.api_inquiry, name='api_inquiry'),
    path('api/health/', api.api_health, name='api_health'),
    re_path(r'^api/', api.api_not_found),
]
