from django.shortcuts import render
from webapp.models import Food
from django.views.generic import ListView

# Create your views here.
class FoodListView(ListView):
    model = Food
    template_name = 'foods.html'
