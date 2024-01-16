# Register your models here.

from django.contrib import admin
from .models import News
from .models import FAQ
from .models import Bus
from .models import Topic
from .models import Route

admin.site.register(News)
admin.site.register(Topic)
admin.site.register(FAQ)
admin.site.register(Bus)
admin.site.register(Route)

