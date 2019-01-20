// объявляем функцию, добавляющую новый элемент в список блюд в заказе
function addOrderFood(orderFood) {
    // генерирует html-код для новой строки
    let html = "<li id=\"orderFood_" + orderFood.pk + "\">" +
        "<span class=\"food_name\">" + orderFood.food_name + "</span>: " +
        "<span class=\"food_amount\">" + orderFood.amount + "</span>\n" +
        "<a href=\"/order_food/" + orderFood.pk + "/update\" class=\"edit_food\" data-food_pk=\"" + orderFood.food_pk +
        "\" data-food_amount=\"" + orderFood.amount + "\"><i class=\"fa fa-edit\"></i></a>\n" +
        "<a href=\"/order_food/" + orderFood.pk + "/delete\" class=\"delete_food\"><i class=\"fa fa-trash\"></i></a>\n" +
        "</li>";

    // добавляет строку в конец списка
    $('#order_food_list').append(html);

    // вызывает функцию добавления события на клик по ссылкам "Изменить" и "Удалить"
    orderFoodUpdateSetup($('#orderFood_' + orderFood.pk + ' .edit_food'));
    orderFoodDeleteSetup($('#orderFood_' + orderFood.pk + ' .delete_food'));
}

// объявляем функцию, изменяющую параметры блюда в списке блюд в заказе
function updateOrderFood(existingOrderFood, orderFood) {
    $('.food_name', existingOrderFood).text(orderFood.food_name);
    $('.food_amount', existingOrderFood).text(orderFood.amount);
    $('.edit_food', existingOrderFood).data('food_pk', orderFood.food_pk);
    $('.edit_food', existingOrderFood).data('food_amount', orderFood.amount);
}

// объявляем функцию, которая ищет блюдо в заказе по ID. если блюда с таким номером еще нет, то она вызывает
// функцию, добавляющую новое блюдо, а если есть - вызывает функцию, изменяющую существующее блюдо
function addOrUpdateFood(orderFood) {
    let existingOrderFood = $('#orderFood_' + orderFood.pk);

    if (existingOrderFood.length > 0) {
        updateOrderFood(existingOrderFood, orderFood)
    } else {
        addOrderFood(orderFood)
    }
}

// объявляем функцию, отправляющую AJAX-запрос с заполненными в форме данными о блюде на URL из формы
function formSend(form) {

    // собираем введенные в форму данные и csrf-token в один объект data
    let data = {
        food: $('#id_food').val(),
        amount: $('#id_amount').val(),
        csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]', form).val()
    };

    // находим нужный url, хранящийся в атрибуте action (перенаправляющий на создание или редактирование блюда)
    let url = form.attr('action');

    // отправляем данные
    // опции success, error и complete - это функции, которые jQuery вызовет
    // при успешной и неуспешной отправке запроса и в финале, соответственно
    // (т.н. "колбэки" - "callback" - функции обратной связи).
    $.ajax({
        url: url,
        method: 'POST',
        data: data,
        success: function(response, status) {
            // прячем модальное окно
            $('#food_modal').modal('hide');

            // вызываем функцию, добавляющую или изменяющую блюдо в заказе, передаем ей в качестве аргумента
            // JSON-response - параметры блюда в заказе (pk, название, количество и др)
            addOrUpdateFood(response);
        },
        error: function() {
            alert("Неправильно введены данные");
        },
        complete: function(xhr, status) {
            // выводим содержимое ответа и статус в консоль
            console.log(xhr.responseJSON);
            console.log(status);
        }
    });
}

// объявляем функцию для обработки событий в модалке - нажатия кнопки "Добавить" и отправки формы
function modalSetup() {
    // назначаем действие на нажатие кнопки "Добавить" в модалке
    $('#food_submit').on('click', function(event) {
        // предотвращаем появление стандартного действия
        event.preventDefault();

        // отправляем форму
        $('#food_form').submit();
    });

    // назначаем действие на отправку формы (событие "submit")
    $('#food_form').on('submit', function (event) {
        // предотвращаем появление стандартного действия
        event.preventDefault();

        // вызываем функцию formSend, передаем в качестве аргумента объект - текущую форму
        formSend($(this))
    })
}

// объявляем функцию для передачи данных в модалку и ее вывода на экран
function modalShow(options) {
    // передаем необходимые данные в модалку
    $('#food_modal .modal-title').text(options.title);
    $('#food_submit').text(options.button);
    $('#id_food').val(options.foodPk);
    $('#id_amount').val(options.foodAmount);
    $('#food_form').attr('action', options.url);

    // выводим модалку на экран
    $('#food_modal').modal('show');
}

// объявляем функцию для создания блюда в заказе
function orderFoodCreateSetup(link) {
    // объявляем событие, происходящее по клику на ссылку "Добавить блюдо" в заказе
    link.on('click', function(event) {
        // предотвращаем появление стандартного действия
        event.preventDefault();

        // передаем данные в модалку
        modalShow({
            title: 'Добавить блюдо',
            button: 'Добавить',
            foodPk: '',
            foodAmount: '',
            // передаем атрибут 'href' из ссылки, по которой была открыта модалка
            url: $(this).prop('href')
        });
    })
}

// объявляем функцию для изменения блюда в заказе
function orderFoodUpdateSetup(link) {
    // объявляем событие, происходящее по клику на ссылку "Изменить блюдо" в заказе
    link.on('click', function(event) {
        // предотвращаем появление стандартного действия
        event.preventDefault();

        // сохраняем data-атрибуты из ссылки
        let data = $(this).data();

        // передаем данные в модалку
        modalShow({
            title: 'Изменить блюдо',
            button: 'Изменить',
            foodPk: data.food_pk,
            foodAmount: data.food_amount,
            url: $(this).prop('href')
        });

    })
}

// объявляем функцию для удаления блюда в заказе
function orderFoodDeleteSetup(link) {
    // объявляем событие, происходящее по клику на ссылку "Удалить блюдо" в заказе
    link.on('click', function(event) {
        // // предотвращаем появление стандартного действия
        event.preventDefault();

        // вызываем модальный запрос с подтверждением удаления
        if (confirm('Вы действительно хотите удалить блюдо?')) {
            // если пользователь подтверждает удаление, сохраняем ссылку на удаляемое блюдо
            // из атрибута 'href' в переменную url
            let url = $(this).attr('href');

            // находим родительский элемент (само блюдо) и сохраняем его в переменную item
            let item = $(this).parent('li');

            // делаем AJAX-запрос на удаление блюда
            $.ajax({
                url: url,
                method: 'POST',
                data: {
                    csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
                },
                success: function (response, status) {
                    // если от сервера пришло подтверждение удаления, удаляем html-элемент на странице
                    item.remove()
                }
            })
        }
    })

}


// объявляем функции, которые будут вызываны при загрузке окна
window.onload = function() {
    modalSetup();
    // передаем в качестве аргумента объект JQuery - ссылку на удаление, создание или редактирование
    // блюда в заказе, которую находим по названию класса в HTML-разметке
    orderFoodDeleteSetup($('.delete_food'));
    orderFoodCreateSetup($('.add_food'));
    orderFoodUpdateSetup($('.edit_food'));
};
