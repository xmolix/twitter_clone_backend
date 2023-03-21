import {body} from "express-validator";

export const tweetsValidations = [
    body("text", "Введите текст твита")
        .isString()
        .isLength({
            min: 1,
            max: 280,
        }).withMessage("Допустимое кол-во символов в твите от 1 до 280.")
]