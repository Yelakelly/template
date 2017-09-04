<?php

    require_once('Library/mail.php');


    $data = array(
        'Имя' => $_POST['name'],
        'Телефон' => $_POST['phone'],
        'Сообщение' => $_POST['message'],
        'Источник' => $_POST['source']
    );

    $mail = new Mail();
    $subject = 'Сайт - заявка от клиента';

    $mail->send_message($data, 'sqrt361@yandex.ru', 'admin@markup.space', 'Info', $subject);

    