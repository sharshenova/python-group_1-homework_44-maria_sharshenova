from django import forms
from webapp.models import Food, Order, OrderFoods


class FoodForm(forms.ModelForm):
    class Meta:
        model = Food
        fields = ['name', 'description', 'photo', 'price']

class OrderUpdateForm(forms.ModelForm):
    class Meta:
        model = Order
        exclude = []

class OrderCreateForm(forms.ModelForm):
    class Meta:
        model = Order
        exclude = ['status', 'operator', 'courier']

class OrderFoodForm(forms.ModelForm):
    class Meta:
        model = OrderFoods
        exclude = ['order']

class StatusUpdateForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ['status']

