// Endereço do app NortGo (Base44).
//
// Decisão 2026-09-06: o app fica em nortgo.com.br em definitivo; o site
// institucional fica em nortgo.com. São dois domínios com propósitos
// distintos, sem redirecionamento entre eles. Se algum dia mudar, troque
// só a constante abaixo.
const APP_BASE_URL = "https://www.nortgo.com.br";

// Se o Base44 expõe rotas separadas para cadastro e login, ajuste aqui.
// Enquanto não houver, os dois botões levam à mesma tela de entrada do app.
export const APP_SIGNUP_URL = APP_BASE_URL;
export const APP_LOGIN_URL = APP_BASE_URL;
