export {};
const keys = require("../keys");

module.exports = function (
  email: string,
  token: string
): Record<string, string> {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: "Аккаунт создан",
    html: `
      <h1>Добро пожаловать в наш магазин</h1>
      <p>Вы успешно создали аккаунт c email - ${email}</p>
      <p><a href="${keys.BASE_URL}/confirm/${token}" target="_blank">Подтвердить емейл</a></p>
      <hr />
      <a href="${keys.BASE_URL}" target="_blank">Магазин курсов</a>
    `,
  };
};
