import {body} from "express-validator";

export const registerValidations = [
    body("email", "Введите E-mail")
        .isEmail().withMessage("Неверный E-mail")
        .isLength({
            min: 9,
            max: 40,
        }).withMessage("Допустимое кол-во символов в почте от 9 до 40."),
    body("fullName", "Введите имя")
        .isString()
        .isLength({
            min: 2,
            max: 40,
        }).withMessage("Допустимое кол-во символов в имени от 2 до 40."),
    body("userName", "Укажите логин")
        .isString()
        .isLength({
            min: 2,
            max: 40,
        }).withMessage("Допустимое кол-во символов в логине от 2 до 40."),
    body("password", "Укажите пароль")
        .isString()
        .isLength({
            min: 8,
        }).withMessage("Минимальная длина пароля 8 символов.")
        .custom((value, { req }) => {
            if (value !== req.body.repeatPassword) {
                throw new Error("Пароли не совпадают.")
            } else {
                return value
            }
        }),
]