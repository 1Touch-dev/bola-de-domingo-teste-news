import { CategoriaSlugEnum } from "@/types";
import type { ICategoria, IPraca, ITarde } from "@/types";

export const pracas: IPraca[] = [
  {
    slug: "largo-do-apito",
    name: "Largo do Apito",
    shortName: "Largo",
    kind: "Praça da sede",
    city: "São Paulo",
    colors: ["#231910", "#9A3412"],
    categorias: [CategoriaSlugEnum.DOMINGO, CategoriaSlugEnum.SELECAO],
    blurb:
      "A praça que abre a Taça de Domingo, no largo da mesa em São Paulo. A ata fecha no mesmo domingo e o placar entra na tabela da mesa, não na da CBF.",
  },
  {
    slug: "campinho-da-tarde",
    name: "Campinho da Tarde",
    shortName: "Campinho",
    kind: "Praça do campinho",
    city: "Belo Horizonte",
    colors: ["#5B4636", "#FAF8F5"],
    categorias: [CategoriaSlugEnum.DOMINGO, CategoriaSlugEnum.COPA],
    blurb:
      "Domingo de tarde no campinho. A casa joga a taça da mesa e anota a manhã de copa à parte, sem folha de federação.",
  },
  {
    slug: "areia-do-domingo",
    name: "Areia do Domingo",
    shortName: "Areia",
    kind: "Praça da areia",
    city: "Recife",
    colors: ["#1C1916", "#5B4636"],
    categorias: [CategoriaSlugEnum.DOMINGO, CategoriaSlugEnum.BASTIDORES],
    blurb:
      "A areia do domingo vira caderno. A mesa publica o placar da praça e não a lista de quem estava no banco.",
  },
  {
    slug: "terreiro-do-apito",
    name: "Terreiro do Apito",
    shortName: "Terreiro",
    kind: "Praça do terreiro",
    city: "Salvador",
    colors: ["#9A3412", "#231910"],
    categorias: [CategoriaSlugEnum.DOMINGO, CategoriaSlugEnum.MERCADO],
    blurb:
      "O terreiro se lê cedo. Entra na taça como praça e no mercado como nota, sempre por lado, nunca por nome.",
  },
  {
    slug: "rampa-da-tarde",
    name: "Rampa da Tarde",
    shortName: "Rampa",
    kind: "Praça da rampa",
    city: "Porto Alegre",
    colors: ["#5B4636", "#9A3412"],
    categorias: [CategoriaSlugEnum.DOMINGO, CategoriaSlugEnum.COPA],
    blurb:
      "Quem cruza o domingo para o sul passa por esta rampa. Quando o circuito para na estação, a etapa é outra página.",
  },
  {
    slug: "calcada-do-sol",
    name: "Calçada do Sol",
    shortName: "Calçada",
    kind: "Praça da calçada",
    city: "Fortaleza",
    colors: ["#FAF8F5", "#5B4636"],
    categorias: [CategoriaSlugEnum.DOMINGO, CategoriaSlugEnum.SELECAO],
    blurb: "Domingo de taça, semana de seleção. Dois relógios e a mesma regra: placar assinado, sem elenco.",
  },
];

export const tardes: ITarde[] = [
  {
    slug: "relogio-da-manha",
    name: "Relógio da Manhã",
    note: "O relógio de São Paulo, faixa no meio e ata às 15:15. A etapa abre quando a praça já fechou a tarde.",
  },
  {
    slug: "viaduto-da-tarde",
    name: "Viaduto da Tarde",
    note: "O viaduto de Belo Horizonte vira parada. A mesa conta o placar da etapa, não o canto da arquibancada.",
  },
  {
    slug: "feira-do-domingo",
    name: "Feira do Domingo",
    note: "A feira do Recife no fim da tarde. Placar de parada, sem nomes.",
  },
  {
    slug: "mercado-da-tarde",
    name: "Mercado da Tarde",
    note: "O mercado de Salvador no domingo. A etapa começa às 17:30, com a ata na mesa antes do apito da praça.",
  },
  {
    slug: "estacao-do-apito",
    name: "Estação do Apito",
    note: "A estação de Porto Alegre fecha a etapa com a súmula na mão, não com a voz do grupo.",
  },
  {
    slug: "orla-do-domingo",
    name: "Orla do Domingo",
    note: "A orla de Fortaleza ainda com gente. O barulho fica na calçada e o placar, na súmula.",
  },
  {
    slug: "ponte-da-tarde",
    name: "Ponte da Tarde",
    note: "A ponte de Belém. Chega quem assina a súmula, não quem manda recado no grupo.",
  },
  {
    slug: "alto-do-domingo",
    name: "Alto do Domingo",
    note: "O alto de Curitiba. O circuito fecha aqui quando a mesa tem os dois lados do placar.",
  },
];

export const categorias: ICategoria[] = [
  {
    slug: CategoriaSlugEnum.DOMINGO,
    name: "Domingo",
    pitch: "A Taça de Domingo, jogada entre as praças da mesa. Vitória vale três. Não é a tabela do Brasileirão.",
    where: "Tarde de domingo",
  },
  {
    slug: CategoriaSlugEnum.COPA,
    name: "Copa",
    pitch: "A Rodada da Copa se joga de manhã. O placar pode ser assinado, mas não entra na Taça de Domingo nem na Copa do Brasil oficial.",
    where: "Manhã de domingo",
  },
  {
    slug: CategoriaSlugEnum.TARDE,
    name: "Tarde",
    pitch: "O Circuito da Tarde fecha o domingo às 17:30. A etapa é da parada, não da praça e não da Libertadores.",
    where: "17:30",
  },
  {
    slug: CategoriaSlugEnum.SELECAO,
    name: "Seleção",
    pitch: "A semana de seleção entra como nota. A mesa não assina placar oficial de seleção e não publica elenco.",
    where: "Semana, sem súmula",
  },
  {
    slug: CategoriaSlugEnum.MERCADO,
    name: "Mercado da Bola",
    pitch: "O mercado fica na nota. Recado de grupo não vira fato assinado e não move a tabela.",
    where: "Nota da mesa",
  },
  {
    slug: CategoriaSlugEnum.BASTIDORES,
    name: "Bastidores",
    pitch: "O que a ata revela depois do apito: horário, praça e correção. Sem nome de quem entrou.",
    where: "Depois da súmula",
  },
];