# Create your models here.
from django.db import models

class News(models.Model):
    news_title = models.CharField(max_length=200)
    news_link = models.URLField()
    date_of_issue = models.DateField()

    def __str__(self):
        return self.news_title

    class Meta:
        app_label = 'myapp'


class Topic(models.Model):
    topic_id = models.AutoField(primary_key=True)
    topic_name = models.CharField(max_length=255)

    def __str__(self):
        return self.topic_name

    class Meta:
        app_label = 'myapp'


class FAQ(models.Model):
    ques_id = models.AutoField(primary_key=True)
    question = models.CharField(max_length=255)
    answer = models.TextField()
    topic_id = models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self):
        return self.question

    class Meta:
        app_label = 'myapp'



class Stop(models.Model):
    stop_name = models.CharField(max_length=200)

    def __str__(self):
        return self.stop_name

class Route(models.Model):
    route_no = models.CharField(max_length=200, unique=True)
    source = models.CharField(max_length=200)
    destination = models.CharField(max_length=200)
    stops = models.ManyToManyField(Stop, through='RouteStop')

    def __str__(self):
        return f"{self.route_no} - {self.source} to {self.destination}"

class RouteStop(models.Model):
    route = models.ForeignKey(Route, on_delete=models.CASCADE)
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE)
    order = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.route.route_no} - {self.stop.stop_name}"

class Bus(models.Model):
    bus_no = models.CharField(max_length=200)
    route = models.ForeignKey(Route, to_field='route_no', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.bus_no} - {self.route.route_no}"



