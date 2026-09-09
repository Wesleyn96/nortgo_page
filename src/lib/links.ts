// Endereço do app NortGo (Base44).
//
// O app fica em nortgo.com.br; o site institucional em nortgo.com. A raiz
// de nortgo.com.br redireciona para nortgo.com (redirect do próprio Base44);
// as rotas do app (/login, /home, /assinatura…) seguem no Base44. Se o
// endereço do app mudar, troque só APP_BASE_URL.
export const APP_BASE_URL = "https://nortgo.com.br";

// "Começar" leva à tela de login do app (o Base44 trata cadastro e login na
// mesma rota /login). Se um dia houver rota separada de cadastro, aponte
// APP_SIGNUP_URL para ela.
export const APP_SIGNUP_URL = `${APP_BASE_URL}/login`;
