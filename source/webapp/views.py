from django.shortcuts import render, redirect
from webapp.models import Food, Order, OrderFoods
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from webapp.forms import FoodForm, OrderForm, OrderFoodForm, StatusUpdateForm
from django.urls import reverse, reverse_lazy
from django.shortcuts import redirect, get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin


# Create your views here.

def welcome_view(request):
    return render(request, 'welcome.html')


class FoodListView(LoginRequiredMixin, PermissionRequiredMixin, ListView):
    model = Food
    template_name = 'food_list.html'
    permission_required = 'webapp.view_food'


class FoodDetailView(LoginRequiredMixin, PermissionRequiredMixin, DetailView):
    model = Food
    template_name = 'food_detail.html'
    permission_required = 'webapp.view_food'


class FoodCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model = Food
    template_name = 'food_create.html'
    form_class = FoodForm
    success_url = reverse_lazy('webapp:food_list')
    permission_required = 'webapp.add_food'


class FoodUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Food
    template_name = 'food_update.html'
    form_class = FoodForm
    success_url = reverse_lazy('webapp:food_list')
    permission_required = 'webapp.change_food'


class FoodDeleteView(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    model = Food
    template_name = 'food_delete.html'
    success_url = reverse_lazy('webapp:food_list')
    permission_required = 'webapp.delete_food'


class OrderListView(LoginRequiredMixin, PermissionRequiredMixin, ListView):
    model = Order
    template_name = 'order_list.html'
    permission_required = 'webapp.view_order'


class OrderDetailView(LoginRequiredMixin, PermissionRequiredMixin, DetailView):
    model = Order
    template_name = 'order_detail.html'
    permission_required = 'webapp.view_order'


class OrderCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model = Order
    template_name = 'order_create.html'
    form_class = OrderForm
    permission_required = 'webapp.add_order'


    def form_valid(self, form):
        form.instance.status = 'new'
        return super().form_valid(form)

    def get_success_url(self):
        return reverse('webapp:orderFood_create', kwargs={'pk': self.object.pk})


class OrderFoodCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model = OrderFoods
    template_name = 'orderFood_create.html'
    form_class = OrderFoodForm
    permission_required = 'webapp.add_orderfoods'


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['orderFood_pk'] = self.kwargs.get('pk')
        return context

    def form_valid(self, form):
        form.instance.order = Order.objects.get(pk=self.kwargs.get('pk'))
        return super().form_valid(form)

    def get_success_url(self):
        return reverse('webapp:order_detail', kwargs={'pk': self.object.order.pk})


class OrderUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Order
    template_name = 'order_update.html'
    form_class = OrderForm
    permission_required = 'webapp.change_order'

    def get_success_url(self):
        return reverse('webapp:order_detail', kwargs={'pk': self.object.pk})


class OrderFoodUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = OrderFoods
    template_name = 'orderFood_update.html'
    form_class = OrderFoodForm
    permission_required = 'webapp.change_orderfoods'

    def get_success_url(self):
        return reverse('webapp:order_detail', kwargs={'pk': self.object.order.pk})


class OrderCancelView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Order
    template_name = 'order_cancel.html'
    form_class = StatusUpdateForm
    permission_required = 'webapp.change_order'

    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        if order.status in ('new', 'preparing'):
            order.status = 'canceled'
        else:
            print("Заказ нельзя отменить")
        order.save()
        return redirect('webapp:order_list')


    def get_success_url(self):
        return reverse('webapp:order_detail', kwargs={'pk': self.object.pk})


class OrderFoodDeleteView(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    model = OrderFoods
    template_name = 'orderFood_delete.html'
    permission_required = 'webapp.delete_orderfoods'

    def get_success_url(self):
        return reverse('webapp:order_detail', kwargs={'pk': self.object.order.pk})


class StatusUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Order
    form_class = StatusUpdateForm
    permission_required = 'webapp.change_order'

    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        if order.status in ('new', 'preparing'):
            order.status = 'on_way'
        elif order.status == 'on_way':
            order.status = 'delivered'
        order.save()
        return redirect('webapp:order_list')




