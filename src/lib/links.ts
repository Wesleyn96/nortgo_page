// Endereço do app NortGo (Base44).
//
// Hoje o app está publicado em www.nortgo.com.br. A intenção (ver
// docs/PROJETO.md e o guia de infraestrutura) é migrar para
// app.nortgo.com — quando o DNS de app.nortgo.com estiver ligado ao
// Base44, troque só a constante abaixo.
const APP_BASE_URL = "https://www.nortgo.com.br";

// Se o Base44 expõe rotas separadas para cadastro e login, ajuste aqui.
// Enquanto não houver, os dois botões levam à mesma tela de entrada do app.
export const APP_SIGNUP_URL = APP_BASE_URL;
export const APP_LOGIN_URL = APP_BASE_URL;
