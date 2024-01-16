from os import stat
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    path("index/", views.index, name="index"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("register/", views.register, name="register"),
    path('activate/<uidb64>/<token>', views.activate, name = "activate"),
    path('password_reset/', views.password_reset, name='password_reset'),
    path('password_reset_confirm/<str:uidb64>/<str:token>/', views.password_reset_confirm, name='password_reset_confirm'),
    path("index/createNewClassroom/<str:name>/", views.createNewClassroom,
         name="createNewClassroom"),
    path("index/ViewClassroom/<str:code>/", views.ViewClassroom, name="ViewClassroom"),
    path("JoinClassroom/<str:code>/",
         views.JoinClassroom, name="JoinClassroom"),
    path("index/JoinClassroom/<str:code>/",
         views.JoinClassroom, name="JoinClassroom"),

    path("makeAnnouncement/", views.makeAnnouncement, name="makeAnnouncement"),
    path("addComment/", views.addComment, name="addComment"),
    path("conversations/",
         views.conversations, name="conversations"),
    # Add subject stuff
    path("add_remove/", views.add_remove, name = "add_remove"),
    path("addSubject/", views.addSubject, name= "addSubject"),
    path('api/get_subjects/', views.get_subjects, name='get_subjects'),
    path('remove_subject/', views.remove_subject, name='remove_subject'),
    path('check_subject_existence/', views.check_subject_existence, name='check_subject_existence'),
    path("submit_subjects/", views.submit_subjects, name= "submit_subjects"),
    path("addConversation/", views.addConversation, name="addConversation"),
    path("sendText/", views.sendText, name="sendText"),
    path("editProfileImage/", views.editProfileImage, name="editProfileImage"),
    # assignmentStuff
    path("ViewClassroom/<str:code>/assignments",
         views.assignments, name="assignments"),
    path("ViewClassroom/<str:code>/assignments/createAssignment",
         views.createAssignment, name="createAssignment"),
    path("ViewClassroom/<str:code>/assignments/viewAssignment/<int:id>",
         views.viewAssignment, name="viewAssignment"),

    path("ViewClassroom/<str:code>/assignments/viewAssignment/<int:id>/submit",
         views.submitAssignment, name="submitAssignment"),
    path("ViewClassroom/<str:code>/assignments/viewAssignment/<int:assignmentId>/<int:id>/grade",
         views.gradeAssignment, name="gradeAssignment"),

    # Add Notes Stuff
    path("ViewClassroom/<str:code>/addNotes",
         views.addNotes, name="addNotes"),
    path("ViewClassroom/<str:code>/addNotes/createNotes",
         views.createNotes, name="createNotes"),
    path("ViewClassroom/<str:code>/addNotes/viewNotes/<int:id>",
         views.viewNotes, name="viewNotes"),
    
    # quiz Stuff
    path("ViewClassroom/<str:code>/quizzes", views.quizzes, name="quizzes"),
    path("ViewClassroom/quizzes/createQuiz",
         views.createQuiz, name="createQuiz"),
    path("ViewClassroom/<str:code>/quizzes/viewQuiz/<int:id>",
         views.viewQuiz, name="viewQuiz"),

    path("ViewClassroom/<str:code>/quizzes/viewQuiz/<int:id>/submit",
         views.submitQuiz, name="submitQuiz"),
    
    path('contact_view/', views.contact, name = 'contact_view'),
    path('faculty/', views.faculty, name = 'faculty'),
    path('admission/', views.admission, name = 'admission'),
    path('syllabus/', views.syllabus, name = 'syllabus'),
    path('research/', views.research, name = 'research'),
    path('academics/', views.academics, name = 'academics'),
    path('cellmember/', views.cellmember, name = 'cellmember'),
    
    
    
    
]
