import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { WHATSAPP_PHONE } from '../data/catalog.js';
import { openWhatsapp } from '../lib/whatsapp.js';
import { FLASH_SALE_ATIVA, SHOP_NAME } from '../data/brand.js';

const SECTIONS = [
  {
    id: 'sobre',
    title: '1. Sobre a loja',
    content: (
      <>
        <p>
          O <strong>{SHOP_NAME}</strong> é uma loja online voltada exclusivamente ao público{' '}
          <strong>maior de 18 anos</strong>, especializada em produtos íntimos, sensuais e acessórios para o
          bem-estar sexual adulto.
        </p>
        <p>
          Nosso compromisso é oferecer um ambiente seguro, discreto e profissional — da navegação à entrega —
          para que você compre com tranquilidade e respeito à sua privacidade.
        </p>
      </>
    )
  },
  {
    id: 'publico-adulto',
    title: '2. Público adulto e uso responsável',
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Maioridade:</strong> é proibida a venda a menores de 18 anos. Ao comprar ou solicitar
          orçamento, você declara ter idade legal e capacidade para adquirir este tipo de produto.
        </li>
        <li>
          <strong>Conteúdo adulto:</strong> descrições, imagens e materiais do site podem conter nudez sugestiva
          ou linguagem sexual. O acesso é destinado apenas a adultos que aceitam esse conteúdo.
        </li>
        <li>
          <strong>Uso responsável:</strong> os itens são para uso pessoal entre adultos, em conformidade com a
          lei brasileira. Leia instruções de higiene, materiais e validade antes do uso.
        </li>
        <li>
          <strong>Sem substituição médica:</strong> produtos eróticos ou comestíveis íntimos não substituem
          orientação de profissionais de saúde.
        </li>
      </ul>
    )
  },
  {
    id: 'condicoes-venda',
    title: '3. Condições de venda e preços',
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          Valores exibidos no site (incluindo promoções e flash sale) são{' '}
          <strong>referência</strong> e podem ser confirmados ou ajustados no WhatsApp conforme estoque,
          fornecedor e forma de pagamento.
        </li>
        <li>
          Descrições e fotos buscam representar o produto com fidelidade; pequenas variações de embalagem ou
          lote podem ocorrer conforme o fabricante.
        </li>
        <li>
          Em caso de dúvida sobre tamanho, material, alergias ou compatibilidade com lubrificantes/latex, fale
          conosco antes de fechar o pedido.
        </li>
      </ul>
    )
  },
  {
    id: 'pagamento',
    title: '4. Formas de pagamento',
    content: (
      <>
        <p>Aceitamos, conforme disponibilidade no atendimento:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <strong>Pix:</strong> pagamento à vista com <strong>5% de desconto</strong> sobre o valor do pedido
            (quando aplicável à promoção informada).
          </li>
          <li>
            <strong>Cartão de crédito:</strong> parcelamento conforme condições informadas no momento da compra.
          </li>
        </ul>
        <p className="mt-3">
          A separação e o envio ocorrem após a <strong>confirmação do pagamento</strong>. No Pix, o prazo de
          compensação depende do seu banco.
        </p>
      </>
    )
  },
  {
    id: 'envio',
    title: '5. Envio e entrega',
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Prazo de postagem:</strong> até <strong>3 dias úteis</strong> após a confirmação do pagamento,
          salvo indisponibilidade comunicada.
        </li>
        <li>
          <strong>Frete grátis (SP):</strong> para entregas em São Paulo, pedidos a partir de{' '}
          <strong>R$ 120,00</strong> podem ter frete grátis. Demais valores e regiões conforme tabela no
          atendimento.
        </li>
        <li>
          <strong>Embalagem discreta:</strong> envio em caixa ou envelope neutro, sem identificação do
          conteúdo íntimo na parte externa.
        </li>
      </ul>
    )
  },
  {
    id: 'trocas',
    title: '6. Trocas, devoluções e garantia',
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          Em caso de <strong>defeito de fabricação</strong>, a troca ou o reembolso segue o Código de Defesa do
          Consumidor (Lei nº 8.078/90).
        </li>
        <li>
          Por <strong>higiene e segurança</strong>, produtos íntimos abertos, usados ou sem lacre original não
          são trocados, exceto defeito comprovado.
        </li>
        <li>
          Para compras à distância, o direito de arrependimento em 7 dias aplica-se a produtos{' '}
          <strong>lacrados e sem uso</strong>, nos termos da lei.
        </li>
        <li>Solicitações devem ser feitas no prazo legal pelo WhatsApp, com nota ou comprovante do pedido.</li>
      </ul>
    )
  },
  {
    id: 'privacidade',
    title: '7. Privacidade e discrição',
    content: (
      <>
        <p>Comprometemo-nos a:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Manter sigilo sobre sua identidade e histórico de compras.</li>
          <li>
            Usar seus dados apenas para processar pedidos, entrega e comunicação necessária — não vender sua
            lista de contatos para terceiros.
          </li>
          <li>Tratar informações com boas práticas de segurança e em linha com a LGPD.</li>
        </ul>
        <p className="mt-3">
          Você pode solicitar esclarecimentos sobre dados que nos enviar pelo canal de contato abaixo.
        </p>
      </>
    )
  },
  {
    id: 'contato',
    title: '8. Contato',
    content: (
      <>
        <p>Dúvidas, pedidos, trocas ou suporte — atendimento discreto pelo WhatsApp:</p>
        <button
          type="button"
          className="mt-4 btn-primary"
          onClick={() =>
            openWhatsapp({
              phoneE164: WHATSAPP_PHONE,
              message: `Olá! Tenho uma dúvida sobre os termos / minha compra no ${SHOP_NAME}.`
            })
          }
        >
          WhatsApp (11) 91853-5361
        </button>
      </>
    )
  }
];

export function TermsPage() {
  return (
    <div className="py-10 sm:py-14">
      <div className="container-page max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao site
        </Link>

        <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight">Termos e Condições</h1>
        <p className="mt-3 text-white/65 text-sm leading-relaxed">
          Última atualização: maio de 2026. Ao utilizar o {SHOP_NAME}, você declara ser maior de 18 anos
          e concorda com as condições abaixo.
        </p>

        <div className="mt-10 space-y-10">
          {SECTIONS.map((sec) => (
            <section key={sec.id} id={sec.id} className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-purpleGlow-400">{sec.title}</h2>
              <div className="mt-4 text-white/80 text-sm leading-relaxed space-y-3">{sec.content}</div>
            </section>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-white/45">
          <Link to="/" className="hover:text-white">
            Início
          </Link>
          {FLASH_SALE_ATIVA ? (
            <>
              {' · '}
              <Link to="/#ofertas" className="hover:text-white">
                Ofertas
              </Link>
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
}
