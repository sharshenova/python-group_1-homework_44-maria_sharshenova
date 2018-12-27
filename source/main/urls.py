"""main URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings


from webapp.views import FoodListView, FoodDetailView, FoodCreateView, FoodUpdateView, \
    FoodDeleteView, OrderListView, OrderDetailView, OrderCreateView, OrderFoodCreateView, \
    OrderUpdateView, OrderFoodUpdateView, OrderCancelView, OrderFoodDeleteView, StatusUpdateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', FoodListView.as_view(), name='food_list'),
    path('foods/<int:pk>', FoodDetailView.as_view(), name='food_detail'),
    path('foods/create', FoodCreateView.as_view(), name='food_create'),
    path('foods/<int:pk>/update', FoodUpdateView.as_view(), name='food_update'),
    path('foods/<int:pk>/delete', FoodDeleteView.as_view(), name='food_delete'),
    path('orders', OrderListView.as_view(), name='order_list'),
    path('orders/<int:pk>', OrderDetailView.as_view(), name='order_detail'),
    path('orders/create', OrderCreateView.as_view(), name='order_create'),
    path('orders/<int:pk>/order_food/create', OrderFoodCreateView.as_view(), name='orderFood_create'),
    path('orders/<int:pk>/update', OrderUpdateView.as_view(), name='order_update'),
    path('orders/<int:pk>/cancel', OrderCancelView.as_view(), name='order_cancel'),
    path('order_food/<int:pk>/update', OrderFoodUpdateView.as_view(), name='orderFood_update'),
    path('order_food/<int:pk>/delete', OrderFoodDeleteView.as_view(), name='orderFood_delete'),
    path('orders/<int:pk>/status_update', StatusUpdateView.as_view(), name='status_update')

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
