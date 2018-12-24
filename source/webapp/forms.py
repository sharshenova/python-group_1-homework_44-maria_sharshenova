from django import forms
from webapp.models import Food, Employee, Order, OrderFoods


class FoodForm(forms.ModelForm):
    class Meta:
        model = Food
        fields = ['name', 'description', 'photo', 'price']

