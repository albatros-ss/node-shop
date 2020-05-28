export {};
const keys = require("../keys");

module.exports = function (
  email: string,
  token: string
): Record<string, string> {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: "Восстановление доступа",
    html: `
      <h1>Вы забыли пароль?</h1>
      <p>Если нет, то проигнорируйте данное письмо</p>
      <p>Иначе нажмите на ссылку ниже:</p>
      <p><a href="${keys.BASE_URL}/password/${token}" target="_blank">Восстановить доступ</a></p>
      <hr />
      <a href="${keys.BASE_URL}" target="_blank">Магазин курсов</a>
    `,
  };
};
