# Create your views here.
from django.shortcuts import render
import os
from datetime import datetime
from django.db.models import Min, Max, Q

from educationPortal.models import Department
from .models import News
from .models import FAQ,Topic
from .models import Bus,Route,Stop,RouteStop



def faq_list(request):
    topics = Topic.objects.all()
    faqs_by_topic = {topic: FAQ.objects.filter(topic_id=topic) for topic in topics}
    return render(request, 'myapp/faq_list.html', {'faqs_by_topic': faqs_by_topic})




from django.shortcuts import render

def bus_list(request):
    filter_option = request.GET.get('filter_option', 'source_dest')
    source = request.GET.get('source', '')
    destination = request.GET.get('destination', '')
    bus_no = request.GET.get('bus_no', '')

    buses = Bus.objects.all()

    if filter_option == 'source_dest':
        if source and destination:
            buses = buses.filter(route__source=source, route__destination=destination)
    elif filter_option == 'bus_no':
        if bus_no:
            buses = buses.filter(bus_no=bus_no)
    elif filter_option == 'all_bus':
        pass  

    sources = Bus.objects.values_list('route__source', flat=True).distinct()
    destinations = Bus.objects.values_list('route__destination', flat=True).distinct()
    bus_numbers = Bus.objects.values_list('bus_no', flat=True).distinct()

    return render(request, 'myapp/bus_list.html', {'buses': buses, 'sources': sources, 'destinations': destinations, 'bus_numbers': bus_numbers})



def map_page(request):
    return render(request, 'myapp/map.html')

def home(request):
    return render(request, 'myapp/home.html')

def base(request):
    return render(request, 'myapp/base.html')

def index(request):
    return render(request, 'myapp/index.html')


def news_page(request):
    all_news = News.objects.all().order_by('-date_of_issue').values()

    filter_date_str = request.GET.get('filter_date')
    filter_date = datetime.strptime(filter_date_str, '%Y-%m-%d').date() if filter_date_str else None
    
    filtered_news = all_news.filter(date_of_issue=filter_date) if filter_date else all_news

    return render(request, 'myapp/news_template.html', {'all_news': filtered_news})


def streamlit_page(request):
    context = {
        'streamlit_app_url': 'http://localhost:8501',
    }
    return render(request, 'myapp/chatbot_template.html', context)

def front(request):
    return render(request, "myapp/front.html")

def about(request):
    return render(request, "myapp/about.html")

def course(request):
    return render(request, "myapp/course.html")

def contact(request):
    return render(request, "myapp/contact.html")

def department(request):
    departments = Department.objects.all()
    return render(request, 'myapp/front.html', { 'departments' : departments})

def department_view(request, department_id):
    department = Department.objects.get(dept_id=department_id)
    return render(request, 'educationPortal/department.html', {'department': department})