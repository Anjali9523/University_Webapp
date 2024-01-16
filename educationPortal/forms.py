from django import forms
from .models import Subject

class PasswordResetForm(forms.Form):
    email = forms.EmailField(label="Email", max_length=255, required=True)
    
class AddSubjectForm(forms.Form):
    subjects = forms.ModelChoiceField(
        queryset=Subject.objects.all(),
        widget=forms.Select(attrs={'class': 'subject-dropdown'}),
    )