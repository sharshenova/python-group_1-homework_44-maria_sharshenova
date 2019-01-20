from django.urls import path
from webapp.views import FoodListView, FoodDetailView, FoodCreateView, FoodUpdateView, \
    FoodDeleteView, OrderListView, OrderDetailView, OrderCreateView, OrderFoodAjaxCreateView, \
    OrderUpdateView, OrderFoodAjaxUpdateView, OrderCancelView, OrderFoodAjaxDeleteView, StatusUpdateView, welcome_view

from django.conf.urls.static import static
from django.conf import settings


app_name = 'webapp'

urlpatterns = [
    path('', welcome_view, name='welcome'),
    path('foods', FoodListView.as_view(), name='food_list'),
    path('foods/<int:pk>', FoodDetailView.as_view(), name='food_detail'),
    path('foods/create', FoodCreateView.as_view(), name='food_create'),
    path('foods/<int:pk>/update', FoodUpdateView.as_view(), name='food_update'),
    path('foods/<int:pk>/delete', FoodDeleteView.as_view(), name='food_delete'),
    path('orders', OrderListView.as_view(), name='order_list'),
    path('orders/<int:pk>', OrderDetailView.as_view(), name='order_detail'),
    path('orders/create', OrderCreateView.as_view(), name='order_create'),
    path('orders/<int:pk>/update', OrderUpdateView.as_view(), name='order_update'),
    path('orders/<int:pk>/cancel', OrderCancelView.as_view(), name='order_cancel'),
    path('orders/<int:pk>/order_food/create', OrderFoodAjaxCreateView.as_view(), name='order_food_create'),
    path('order_food/<int:pk>/update', OrderFoodAjaxUpdateView.as_view(), name='order_food_update'),
    path('order_food/<int:pk>/delete', OrderFoodAjaxDeleteView.as_view(), name='order_food_delete'),
    path('orders/<int:pk>/status_update', StatusUpdateView.as_view(), name='status_update'),

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)