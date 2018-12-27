from django.shortcuts import render, redirect
from webapp.models import Food, Employee, Order, OrderFoods
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from webapp.forms import FoodForm, OrderForm, OrderFoodForm, StatusUpdateForm
from django.urls import reverse, reverse_lazy
from django.shortcuts import redirect, get_object_or_404


# Create your views here.
class FoodListView(ListView):
    model = Food
    template_name = 'food_list.html'

class FoodDetailView(DetailView):
    model = Food
    template_name = 'food_detail.html'

class FoodCreateView(CreateView):
    model = Food
    template_name = 'food_create.html'
    form_class = FoodForm
    success_url = reverse_lazy('food_list')


class FoodUpdateView(UpdateView):
    model = Food
    template_name = 'food_update.html'
    form_class = FoodForm
    success_url = reverse_lazy('food_list')

class FoodDeleteView(DeleteView):
    model = Food
    template_name = 'food_delete.html'
    success_url = reverse_lazy('food_list')



class OrderListView(ListView):
    model = Order
    template_name = 'order_list.html'

class OrderDetailView(DetailView):
    model = Order
    template_name = 'order_detail.html'



class OrderCreateView(CreateView):
    model = Order
    template_name = 'order_create.html'
    form_class = OrderForm

    def form_valid(self, form):
        form.instance.status = 'new'
        return super().form_valid(form)

    def get_success_url(self):
        return reverse('orderFood_create', kwargs={'pk': self.object.pk})


class OrderFoodCreateView(CreateView):
    model = OrderFoods
    template_name = 'orderFood_create.html'
    form_class = OrderFoodForm


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['orderFood_pk'] = self.kwargs.get('pk')
        return context

    def form_valid(self, form):
        form.instance.order = Order.objects.get(pk=self.kwargs.get('pk'))
        return super().form_valid(form)

    def get_success_url(self):
        return reverse('order_detail', kwargs={'pk': self.object.order.pk})


class OrderUpdateView(UpdateView):

    model = Order
    template_name = 'order_update.html'
    form_class = OrderForm

    def get_success_url(self):
        return reverse('order_detail', kwargs={'pk': self.object.pk})


class OrderFoodUpdateView(UpdateView):
    model = OrderFoods
    template_name = 'orderFood_update.html'
    form_class = OrderFoodForm

    def get_success_url(self):
        return reverse('order_detail', kwargs={'pk': self.object.order.pk})


class OrderCancelView(UpdateView):
    model = Order
    template_name = 'order_cancel.html'
    form_class = StatusUpdateForm
    # success_url = reverse_lazy('order_list')

    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        if order.status in ('new', 'preparing'):
            order.status = 'canceled'
        else:
            print("Заказ нельзя отменить")
        order.save()
        return redirect('order_list')


    def get_success_url(self):
        return reverse('order_detail', kwargs={'pk': self.object.pk})


class OrderFoodDeleteView(DeleteView):
    model = OrderFoods
    template_name = 'orderFood_delete.html'
    # success_url = reverse_lazy('order_list')

    def get_success_url(self):
        return reverse('order_detail', kwargs={'pk': self.object.order.pk})



class StatusUpdateView(UpdateView):
    model = Order
    form_class = StatusUpdateForm

    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        if order.status in ('new', 'preparing'):
            order.status = 'on_way'
        elif order.status == 'on_way':
            order.status = 'delivered'
        order.save()
        return redirect('order_list')




