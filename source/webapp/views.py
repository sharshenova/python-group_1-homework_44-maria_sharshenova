from django.shortcuts import render
from webapp.models import Food, Employee, Order, OrderFoods
from django.views.generic import ListView, DetailView, FormView, CreateView, UpdateView
from webapp.forms import FoodForm
from django.urls import reverse, reverse_lazy


# Create your views here.
class FoodListView(ListView):
    model = Food
    template_name = 'food_list.html'

class FoodDetailView(DetailView):
    model = Food
    template_name = 'food_detail.html'

