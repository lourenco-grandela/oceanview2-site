/* OceanView 2 — configuração do site.
 * O WhatsApp e os IDs de medição são escritos pelo ferramentas/preencher.py a
 * partir do dados-lancamento.json (ver docs/LANCAMENTO.md). Não editar à mão.
 * Não guardar aqui segredos: este ficheiro é servido ao browser.
 */
window.OCEANVIEW = {
  // Número de WhatsApp em formato internacional, só dígitos (ex.: 351912345678).
  // Enquanto estiver vazio, os botões de WhatsApp ficam escondidos.
  whatsapp: '351918559623',

  // Contactos de WhatsApp: nome e número (só dígitos). Com mais de um, os
  // botões de WhatsApp abrem uma escolha entre eles (clientes, 19/10/2026).
  // Escrito pelo ferramentas/preencher.py a partir de whatsapp_contactos.
  whatsappContactos: [{"nome": "Inês Caiado", "numero": "351918559623"}, {"nome": "Carlos Lopes", "numero": "351934915924"}],

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
  // ID de medição do Google Analytics 4 (G-XXXXXXXXXX).
  ga4: '',
  // ID do píxel da Meta (só dígitos).
  metaPixel: ''
};
