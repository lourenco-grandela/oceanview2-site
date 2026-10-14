/* OceanView 2 — configuração do site.
 * Único ficheiro a editar quando chegarem os contactos e os endereços.
 * Não guardar aqui segredos: este ficheiro é servido ao browser.
 */
window.OCEANVIEW = {
  // TODO: número de WhatsApp em formato internacional, só dígitos (ex.: 351912345678).
  // Enquanto estiver vazio, os botões de WhatsApp ficam escondidos.
  whatsapp: '',

  // Mensagem pré-preenchida do WhatsApp (fase 2: passa a incluir a fração).
  // A página escolhe a versão pela língua: /en/ usa a inglesa.
  whatsappMensagem: 'Olá, gostava de receber informação sobre o OceanView 2.',
  whatsappMensagemEn: 'Hello, I would like to receive information about OceanView 2.',

  // URL da aplicação web do Google Apps Script que grava na folha
  // «OceanView 2 — Contactos». Ver docs/FORMULARIO.md.
  // Não é um segredo: pode estar no repositório.
  FORM_URL: 'https://script.google.com/macros/s/AKfycbxXZ1g24J2Um5eq3hmlCXgSh2PQPV45cwJisUlyvftaM70gMFFft2JkckOPBMGHCqvv0Q/exec',

  // Campanha de lançamento: usada quando a visita chega sem parâmetros utm.
  utmCampanhaOmissao: 'lancamento-2026-09',

  // Etiquetas de medição. Carregadas só depois do consentimento no banner.
  // TODO: ID de medição do Google Analytics 4 (G-XXXXXXXXXX).
  ga4: '',
  // TODO: ID do píxel da Meta.
  metaPixel: ''
};
