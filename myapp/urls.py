from django.urls import path
from . import views

urlpatterns = [
    path('map/', views.map_page, name='map_page'),
    path('news/', views.news_page, name='news_page'),
    path('home/', views.home, name='home'),
    path('index/', views.index, name='index'),
    path('faq_list/',views.faq_list,name='faq_list'),
    path('bus_list/',views.bus_list,name='bus_list'),
    path('', views.front, name = 'front'),
    path('about/', views.about, name = 'about'),
    path('contact/', views.contact, name = 'contact'),
    path('course/', views.course, name = 'course'),
    path("department/", views.department, name = "department"),
    path('department/<int:department_id>/', views.department_view, name='department_view'),
]
