from django import forms
from webapp.models import Food, Employee, Order, OrderFoods


class FoodForm(forms.ModelForm):
    class Meta:
        model = Food
        fields = ['name', 'description', 'photo', 'price']

class OrderForm(forms.ModelForm):
    class Meta:
        model = Order
        exclude = ['status']


class OrderFoodForm(forms.ModelForm):
    class Meta:
        model = OrderFoods
        exclude = ['order']
