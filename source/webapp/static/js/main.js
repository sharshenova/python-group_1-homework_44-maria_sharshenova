function clearForm() {
    // очищаем форму в модалке
    $('#id_food').val('');
    $('#id_amount').val('');
}

function orderFoodBaseSetup() {
    // назначаем действие на нажатие кнопки "Добавить" в модалке.
    $('#food_submit').on('click', function(e) {
        // отправляем форму
        $('#food_form').submit();
    });
}

function sendFormData(url, success, error) {
    // собираем данные, указанные в форме food_form
    let data = {
        food: $('#id_food').val(),
        amount: $('#id_amount').val(),
        csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
    };
    // отправляем данные
    // опции success и error должны быть функциями,
    // которые jQuery вызовет при успешной и неуспешной отправке запроса, соответственно
    // (т.н. "колбэки" - "callback" - функции обратной связи).
    $.ajax({
        url: url,
        method: 'POST',
        data: data,
        success: success,
        error: error
    });
}


function orderFoodCreateSetup() {
    // функция, которая обрабатывает успешный AJAX-запрос
    function addOrderFoodSuccess(response, status) {
        // выводим содержимое ответа и статус в консоль.
        console.log(response);
        console.log(status);


        // создаём новый пункт списка блюд
        let newFoodLi = document.createElement('li');
        // заполняем новый пункт списка блюд разметкой - текстом и ссылками
        // т.к. ответ - это JSON-объект,
        // то с ним можно работать, как с объектом JS,
        // и обращаться к его свойствам через точку.
        // используем форматированную строку,
        // которая обозначается апострофами (``)
        // и позволяет подставлять в неё переменные через ${}.
        $(newFoodLi).html(
            `${response.food_name}: ${response.amount}шт. (<a href="#">Изменить</a>/<a href="#">Удалить</a>)`
        );

        // добавляем новый пункт в список
        $('#order_food_list').append(newFoodLi);
        // выключаем модальное окно (toggle меняет состояние с выключенного на включенное и наоборот)
        $('#food_edit_modal').modal('toggle');

        clearForm()
    }


    // функция, которая обрабатывает неуспешный AJAX-запрос
    function submitOrderFoodError(response, status) {
        // выводим содержимое ответа и статус в консоль.
        console.log(response);
        console.log(status);
    }

    // функция, которая отправляет AJAX-запрос с формой
    // по клику на кнопку "Добавить"
    function addOrderFood() {
        // определяем url для отправки формы food_form по свойству action:
        let url = $('.add_link').attr('href');

        // отправляем данные на URL через Ajax
        sendFormData(url, addOrderFoodSuccess, submitOrderFoodError)
    }



    // назначаем действие на отправку формы food_form.
    $('#food_form').on('submit', function(event) {
        // отменить обычную отправку формы (действие по умолчанию с перезагрузкой страницы)
        event.preventDefault();
        // отправить форму с помощью функции addOrderFood, которая использует AJAX-запрос.
        addOrderFood();
    });
}



function orderFoodUpdateSetup() {

    // функция, которая обрабатывает успешный AJAX-запрос
    function updateOrderFoodSuccess(response, status) {
        // выводим содержимое ответа и статус в консоль.
        console.log(response);
        console.log(status);


        // // заполняем новый пункт списка блюд разметкой - текстом и ссылками
        // // т.к. ответ - это JSON-объект,
        // // то с ним можно работать, как с объектом JS,
        // // и обращаться к его свойствам через точку.
        // // используем форматированную строку,
        // // которая обозначается апострофами (``)
        // // и позволяет подставлять в неё переменные через ${}.
        $("#orderFood_" + response.pk).html(
            `${response.food_name}: ${response.amount} шт. (<a href="#">Изменить</a>/<a href="#">Удалить</a>)`
        );

        // выключаем модальное окно (toggle меняет состояние с выключенного на включенное и наоборот)
        $('#food_edit_modal').modal('toggle');

    }

    // функция, которая обрабатывает неуспешный AJAX-запрос
    function submitOrderFoodError(response, status) {
        // выводим содержимое ответа и статус в консоль.
        console.log(response);
        console.log(status);
    }

    // функция, которая отправляет AJAX-запрос с формой
    // по клику на кнопку "Добавить"
    function updateOrderFood(url) {

        //
        // // определяем url для отправки формы food_form по свойству action:
        // let url = $('.update_link').attr('href');
        //
        // let orderFoodPK = $('.update_link').data('pk');
        //
        //
        // // собираем данные, указанные в форме food_form
        // let data = {
        //     food: $('#id_food').val(),
        //     amount: $('#id_amount').val(),
        //     csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
        // };
        // // отправляем данные
        // // опции success и error должны быть функциями,
        // // которые jQuery вызовет при успешной и неуспешной отправке запроса, соответственно
        // // (т.н. "колбэки" - "callback" - функции обратной связи).
        // $.ajax({
        //     url: url,
        //     method: 'POST',
        //     data: data,
        //     pk: orderFoodPK,
        //     success: updateOrderFoodSuccess,
        //     error: submitOrderFoodError
        // });
        // отправляем данные на URL через Ajax
        sendFormData(url, updateOrderFoodSuccess, submitOrderFoodError)
    }


    $('#order_food_list .update_link').on('click', function(event) {
        event.preventDefault();

        $('#food_edit_modal').modal('toggle');

        let url = $(this).attr('href')

        // // передаем в качестве action ссылку из атрибута href {% url 'webapp:order_food_update' orderFood.pk %}
        let foodForm = $('#food_form');
        // foodForm.attr('action', $(this).attr('href')); // this - указывает на текущий элемент, к которому применено событие: кнопку, ссылку и тд
        //


        // получаем название блюда и количество
        let foodPk = $(this).data('pk');
        let foodName = $('#orderFood_' + foodPk + ' .food_name').data('food_pk'); // '#order_food_1 .food_name'
        let foodAmount = $('#orderFood_' + foodPk + ' .food_amount').text(); // '#order_food_1 .food_amount'

        // передаем название блюда и количество в модалку
        $('#id_food').val(foodName);
        $('#id_amount').val(foodAmount);

        // отключаем событие Submit у формы
        foodForm.off('submit');

        // назначаем действие на отправку формы food_form.
        foodForm.on('submit', function(event) {
            // отменить обычную отправку формы (действие по умолчанию с перезагрузкой страницы)
            event.preventDefault();
            // отправить форму с помощью функции updateOrderFood, которая использует AJAX-запрос.
            updateOrderFood(url);
        });
    })
}

window.onload = function() {
    orderFoodBaseSetup();
    orderFoodCreateSetup();
    orderFoodUpdateSetup();
};
