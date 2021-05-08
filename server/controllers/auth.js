import auth from '../models/auth.js';
import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'

export const login = (req, res) => {
    let { email, password } = req.body.data
    auth.login(email, password, (err, data) => {
        if (err) {
            console.log(err);
            res.json({ 'schema': data });
        } else {
            res.json({ 'schema': data });
        }
    });
};

export const changePassword = (req, res) => {
    let schema = req.body.data.schema
    if (schema.newPassword1 !== schema.newPassword2) {
        res.json({ resultCode: -2, 'msg': 'Пароли не совпадают!' });
    } else {
        auth.setPassword(schema.email, schema.newPassword1, (err, data) => {
            if (err) {
                console.log(err);
                res.json({ resultCode: -1, 'schema': data });
            } else {
                res.json({ resultCode: 0, 'schema': data });
            }
        });
    }

};


export const setPassword = (req, res) => {
    let { email, password } = req.query
    console.log(email, password)
    auth.setPassword(email, password, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            return res.send(`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body style="text-align: center;">
                <h1>Пароль успешно изменен, скоро вы будете перенаправлены...</h1>
                <script>
                let red = () => {
                    window.location.href = 'http://localhost:3001/'
                }
                    setTimeout(red, 3000)
                </script>
            </body>
            </html>`)
        }
    });
};

export const resetPassword = (req, res) => {
    let { email } = req.body.data

    let makePassword = () => {
        let password = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 10; i++) {
            password += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return password;
    }

    let transport = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        auth: {
            user: 'rt8nrt@mail.ru',
            pass: 'dsfg_SFSH24_rt1@#@$$#G$%H$^J%^KN$%J'
        }
    });

    let newPassword = makePassword()

    const message = {
        from: 'rt8nrt@mail.ru',
        to: email,
        subject: 'Востановление пароля',
        html: `<body>
                <style>
                .c {
                    border: 1px solid #333; /* Рамка */
                    display: inline-block;
                    padding: 5px 15px; /* Поля */
                    margin-left: 10px;
                    text-decoration: none; /* Убираем подчёркивание */
                    color: #000; /* Цвет текста */
                }
                .c:hover {
                    box-shadow: 0 0 5px rgba(0,0,0,0.3); /* Тень */
                    background: linear-gradient(to bottom, #fcfff4, #e9e9ce); /* Градиент */
                    color: #a00;
                }
                </style>
               <h2>Уважаемый пользователь, вы действительно желаете сменить пароль?<a class="c" href="http://localhost:3011/auth/set-password/?email=${email}&password=${newPassword}" onclick='alert(2)'>Да</a></h2>
               <div>
               <h3>Новые данные для входа:</h3>
               <ul>
               <li>Логин: ${email}</li>
               <li>Пароль: ${newPassword}</li>
               </ul>
               </div>
               <h3>*в противном случае проигнорируйте данное письмо.</h3>
               </body>`
    };

    transport.sendMail(message, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            res.send('Мы отправили письмо с инструкциями на вашу почту, пожалуйста, проверьте папку спам.')
        }
    });
};

export const createStaff = (req, res) => {
    let { email, position } = req.body.data.schema
    let position2 = ''
    if (position === 'manager') {
        position2 = 'менеджера'
    } else {
        position2 = 'администратора'
    }
    // console.log(email, position)
    let makePassword = () => {
        let password = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 10; i++) {
            password += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return password;
    }

    let transport = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        auth: {
            user: 'rt8nrt@mail.ru',
            pass: 'dsfg_SFSH24_rt1@#@$$#G$%H$^J%^KN$%J'
        }
    });

    let newPassword = makePassword()

    const message = {
        from: 'rt8nrt@mail.ru',
        to: email,
        subject: 'Добро пожаловать в компанию',
        html: `<body>
                <style>
                .c {
                    border: 1px solid #333; /* Рамка */
                    display: inline-block;
                    padding: 5px 15px; /* Поля */
                    margin-left: 10px;
                    text-decoration: none; /* Убираем подчёркивание */
                    color: #000; /* Цвет текста */
                }
                .c:hover {
                    box-shadow: 0 0 5px rgba(0,0,0,0.3); /* Тень */
                    background: linear-gradient(to bottom, #fcfff4, #e9e9ce); /* Градиент */
                    color: #a00;
                }
                </style>
               <h2>Уважаемый пользователь, рады приветствовать вас в нашей компании на позиции ${position2}!</h2>
               <div>
               <h3>Ваши данные для входа в систему:</h3>
               <ul>
               <li>Логин: ${email}</li>
               <li>Пароль: ${newPassword}</li>
               </ul>
               </div>
               </body>`
    };

    transport.sendMail(message, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            auth.createStaff(email, newPassword, position, (err, data) => {
                if (err) {
                    console.log(err);
                    res.json({ 'schema': data });
                } else {
                    res.json({ 'schema': data });
                }
            });
            res.send('Мы отправили письмо с инструкциями на вашу почту, пожалуйста, проверьте папку спам.')
        }
    });
};