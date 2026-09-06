// Endereço do app NortGo (Base44).
//
// Decisão 2026-09-06: o app fica em nortgo.com.br em definitivo; o site
// institucional fica em nortgo.com. São dois domínios com propósitos
// distintos, sem redirecionamento entre eles. Se algum dia mudar, troque
// só APP_BASE_URL.
export const APP_BASE_URL = "https://nortgo.com.br";

// "Começar" e "Já tenho conta" levam os dois à tela de login do app
// (o app trata cadastro e login na mesma rota /login). Se um dia houver
// rotas separadas, aponte APP_SIGNUP_URL para a de cadastro.
export const APP_SIGNUP_URL = `${APP_BASE_URL}/login`;
export const APP_LOGIN_URL = `${APP_BASE_URL}/login`;
