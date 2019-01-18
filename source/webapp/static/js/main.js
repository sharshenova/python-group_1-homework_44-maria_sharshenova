function addOrderFood(orderFood) {
    let html = "<li id=\"orderFood_" + orderFood.pk + "\">" +
        "<span class=\"food_name\">" + orderFood.food_name + "</span>: " +
        "<span class=\"food_amount\">" + orderFood.amount + "</span>\n" +
        "<a href=\"/order_food/" + orderFood.pk + "/update\" class=\"edit_food\" data-food_pk=\"" + orderFood.food_pk + "\" data-food_amount=\"" + orderFood.amount + "\"><i class=\"fa fa-edit\"></i></a>\n" +
        "<a href=\"/order_food/" + orderFood.pk + "/delete\" class=\"delete_food\"><i class=\"fa fa-trash\"></i></a>\n" +
        "</li>";

    $('#order_food_list').append(html);

    orderFoodUpdateSetup($('#orderFood_' + orderFood.pk + ' .edit_food'));
}

function updateOrderFood(existingOrderFood, orderFood) {
    $('.food_name', existingOrderFood).text(orderFood.food_name);
    $('.food_amount', existingOrderFood).text(orderFood.amount);
    $('.edit_food', existingOrderFood).data('food_pk', orderFood.food_pk);
    $('.edit_food', existingOrderFood).data('food_amount', orderFood.amount);
}

function addOrUpdateFood(orderFood) {
    let existingOrderFood = $('#orderFood_' + orderFood.pk);

    if (existingOrderFood.length > 0) {
        updateOrderFood(existingOrderFood, orderFood)
    } else {
        addOrderFood(orderFood)
    }
}

function formSend(form) {
    let data = {
        food: $('#id_food').val(),
        amount: $('#id_amount').val(),
        csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]', form).val()
    };

    let url = form.attr('action');

    // отправляем данные
    // опции success и error должны быть функциями,
    // которые jQuery вызовет при успешной и неуспешной отправке запроса, соответственно
    // (т.н. "колбэки" - "callback" - функции обратной связи).
    $.ajax({
        url: url,
        method: 'POST',
        data: data,
        success: function(response, status) {
            $('#food_modal').modal('hide');
            addOrUpdateFood(response);
        },
        error: function() {
            alert("Неправильно введены данные");
        },
        complete: function(xhr, status) {
            // выводим содержимое ответа и статус в консоль.
            console.log(xhr.responseJSON);
            console.log(status);
        }
    });
}


function modalSetup() {
    // назначаем действие на нажатие кнопки "Добавить" в модалке
    $('#food_submit').on('click', function(event) {
        event.preventDefault();

        // отправляем форму
        $('#food_form').submit();
    });

    $('#food_form').on('submit', function (event) {
        event.preventDefault();

        formSend($(this))
    })
}

function modalShow(options) {
    $('#food_modal .modal-title').text(options.title);
    $('#food_submit').text(options.button);
    $('#id_food').val(options.foodPk);
    $('#id_amount').val(options.foodAmount);
    $('#food_form').attr('action', options.url);

    $('#food_modal').modal('show');
}

function orderFoodCreateSetup(link) {
    link.on('click', function(event) {
        event.preventDefault();

        modalShow({
            title: 'Добавить блюдо',
            button: 'Добавить',
            foodPk: '',
            foodAmount: '',
            url: $(this).prop('href')
        });
    })
}

function orderFoodUpdateSetup(link) {
    link.on('click', function(event) {
        event.preventDefault();

        data = $(this).data();

        modalShow({
            title: 'Изменить блюдо',
            button: 'Изменить',
            foodPk: data.food_pk,
            foodAmount: data.food_amount,
            url: $(this).prop('href')
        });

    })
}


window.onload = function() {
    modalSetup();
    orderFoodCreateSetup($('.add_food'));
    orderFoodUpdateSetup($('.edit_food'));
};
