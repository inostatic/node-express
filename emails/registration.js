const keys = require('../keys')

module.exports = function (email, password) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Аккаунт создан',
        html: `
            <h1>Добро пожаловать в наш магазин</h1>
            <p>Вы успешно создали аккаунт</p>
            <p>Ваш email: ${email}</p>
            <p>Ваши пароль: ${password}</p>
            <a href="${keys.BASE_URL}">Магазин курсов</a>
        `
    }
}