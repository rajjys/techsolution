import {
  BatteryCharging,
  PlugZap,
  RadioTower,
  ShieldCheck,
  Sun,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { site } from "@/lib/site";

import type { Project } from "@/lib/data/clients";

export type Service = {
  slug: string;
  /** Intitulé complet — page /services. */
  title: string;
  /** Intitulé court — carte d'accueil et navigation rapide. */
  shortTitle: string;
  /**
   * Carte d'accueil, dans cet ordre : d'abord le résultat pour le client,
   * ensuite seulement le « comment » technique.
   */
  outcome: string;
  delivery: string;
  excerpt: string;
  description: string;
  icon: LucideIcon;
  capabilities: string[];
  references: string[];
  image: string;
  imageAlt: string;
  /**
   * Catégorie de réalisation correspondante — c'est ce lien qui permet à
   * « Voir les réalisations » de filtrer /references sur le bon domaine,
   * sans table de correspondance parallèle à maintenir.
   */
  projectCategory: Project["category"];
};

/**
 * Domaines d'expertise — construits à partir des domaines d'intervention
 * et des réalisations documentées dans la farde de l'entreprise.
 */
export const services: Service[] = [
  {
    slug: "energie-solaire",
    title: "Énergie solaire photovoltaïque",
    shortTitle: "Énergie solaire",
    outcome:
      "Gardez votre maison ou votre entreprise alimentée, même pendant les coupures.",
    delivery:
      "Des systemes dimensionnés sur vos besoins, avec stockage lithium pour les coupures prolongées",
    excerpt:
      "Systemes solaires pour foyers, entreprises et sites institutionnels — de l'étude au raccordement.",
    description:
      "Entre les délestages et le prix du carburant, l'électricité devient le premier poste de dépense — et la première cause d'arrêt. Un système solaire dimensionnée sur vos charges réelles inverse la logique : elle produit ce que votre site consomme, stocke le surplus pour la nuit et fonctionne sans ravitaillement. Nous équipons ainsi des bâtiments administratifs, des agences bancaires, des bureaux d'ONG, des salles communautaires et des stations de radio, avec des équipements conformes aux exigences des bailleurs et des institutions.",
    icon: Sun,
    capabilities: [
      "Audit énergétique et dimensionnement sur mesure",
      "Systemes solaires pour bâtiments publics et privés",
      "Kits solaires industriels pour bureaux et ONG",
      "Éclairage public et solutions communautaires",
      "Mise en service, formation et transfert de compétences",
    ],
    references: [
      "Bureau administratif du territoire de Mahagi — projet PDL-145T",
      "Banque CADECO Mahagi (rénovation + système solaire)",
      "Salles du royaume LTJ — Goma & Bunia",
      "Bureaux CARE, ALIMA & LSC — Bunia et Numbi",
    ],
    projectCategory: "Solaire",
    image: "/photos/drone-centrale-toiture.webp",
    imageAlt: `Vue aérienne d'un système solaire ${site.name} en toiture, en RDC`,
  },
  {
    slug: "backup-stockage",
    title: "Systèmes backup & stockage d'énergie",
    shortTitle: "Backup & stockage",
    outcome:
      "Gardez vos équipements critiques allumés, 24 h/24.",
    delivery:
      "Onduleurs hybrides, parcs batteries lithium et supervision",
    excerpt:
      "Onduleurs hybrides et parcs batteries lithium pour une continuité électrique 24h/24, même hors réseau.",
    description:
      "Un serveur qui s'éteint, une salle technique qui redémarre, une chaîne du froid qui rompt : certaines coupures coûtent bien plus cher que l'électricité qu'elles font perdre. Nous plaçons entre le réseau et vos équipements critiques un onduleur hybride et un parc batteries lithium dimensionnés sur la durée réelle des coupures de votre zone, avec supervision et sans rupture au basculement. Ces systèmes alimentent déjà des serveurs télécoms, des stations de radio et des bureaux d'organisations internationales.",
    icon: BatteryCharging,
    capabilities: [
      "Onduleurs hybrides mono et triphasés",
      "Parcs batteries lithium LiFePO₄ longue durée",
      "Alimentation sans interruption des équipements critiques",
      "Supervision et monitoring des installations",
      "Extension et modernisation de systèmes existants",
    ],
    references: [
      "Installations backup LTJ — Bunia & Butembo",
      "Alimentation du serveur GRECOM — Goma",
    ],
    projectCategory: "Backup",
    image: "/photos/victron-triphase-batteries.webp",
    imageAlt: `Onduleurs triphasés et parc batteries lithium installés par ${site.name}`,
  },
  {
    slug: "infrastructure-electrique",
    title: "Infrastructure électrique industrielle",
    shortTitle: "Infrastructure électrique",
    outcome:
      "Installations conformes et protégées contre les surtensions et coupures brusques.",
    delivery:
      "Tableaux, distribution basse tension, protection anti-foudre et mise en conformité.",
    excerpt:
      "Tableaux, distribution basse tension, protection contre les surtensions et mise en conformité des bâtiments.",
    description:
      "Surtensions à répétition, câblage vétuste, tableaux saturés : le matériel grille, les assurances se retournent et les audits bloquent. Nous reprenons l'infrastructure à la source — tableaux et armoires de distribution, câblage structuré, parafoudres et protection contre les surtensions — jusqu'à la mise en conformité complète, plans et dossiers techniques à l'appui. La rénovation de l'agence CADECO de Mahagi a été menée sur un site bancaire resté en activité.",
    icon: PlugZap,
    capabilities: [
      "Tableaux et armoires de distribution basse tension",
      "Câblage et chemins de câbles industriels",
      "Parafoudres et protection contre les surtensions",
      "Rénovation et mise en conformité d'installations",
      "Schémas, plans et dossiers techniques complets",
    ],
    references: [
      "Rénovation électrique complète — banque CADECO Mahagi",
      "Installations tertiaires — Afriland First Bank Bunia",
    ],
    projectCategory: "Électricité",
    image: "/photos/onduleurs-muraux-batiment.webp",
    imageAlt: `Onduleurs, chemins de câbles et coffret de distribution installés par ${site.name}`,
  },
  {
    slug: "telecom-medias",
    title: "Télécommunications & médias",
    shortTitle: "Télécoms & médias",
    outcome:
      "Restez à l'antenne, même quand tout le quartier s'éteint.",
    delivery:
      "Énergie autonome pour stations de radio, serveurs et sites télécoms isolés.",
    excerpt:
      "Alimentation autonome des stations de radio, serveurs et sites télécoms isolés à travers l'Est de la RDC.",
    description:
      "Une station qui sort de l'antenne perd son audience ; un site télécom qui tombe perd sa zone. Ces infrastructures n'ont pas droit à la coupure : nous les rendons autonomes, en solaire seul ou en hybride solaire + backup, dimensionné sur la consommation réelle de l'émetteur et de la salle technique. Cinq stations de radio équipées en kits solaires et un serveur télécom sécurisé à Goma fonctionnent sur ce principe.",
    icon: RadioTower,
    capabilities: [
      "Énergie autonome pour stations de radio et TV",
      "Alimentation sécurisée de serveurs et salles techniques",
      "Électrification de sites télécoms isolés",
      "Solutions hybrides solaire + backup pour émetteurs",
    ],
    references: [
      "Radio RTNC Bunia, Canal Révélation & RTFi Bunia",
      "Radio La Colombe Mahagi & Radio Amani Aveba",
      "Serveur télécom GRECOM-RDC — Goma",
    ],
    projectCategory: "Télécoms",
    image: "/photos/telecom-baie-technique.webp",
    imageAlt: `Baie technique ${site.name} alimentant un site télécom`,
  },
  {
    slug: "securite-electronique",
    title: "Sécurité électronique",
    shortTitle: "Sécurité électronique",
    outcome:
      "Sachez ce qui se passe sur votre site, à toute heure.",
    delivery:
      "Alarmes, contrôle d'accès et vidéosurveillance adossés à une alimentation secourue.",
    excerpt:
      "Systèmes d'alarme, contrôle d'accès et vidéosurveillance pour bureaux, banques et sites sensibles.",
    description:
      "Un site que l'on ne voit pas est un site que l'on ne protège pas — et une alarme qui s'éteint avec le courant ne protège rien du tout. Nous installons alarmes anti-intrusion, contrôle d'accès et vidéosurveillance IP adossés à une alimentation secourue, pour qu'ils restent opérationnels pendant les coupures, c'est-à-dire précisément quand le risque augmente. Le bureau de Save the Children à Bunia nous a confié la sécurisation de ses locaux.",
    icon: ShieldCheck,
    capabilities: [
      "Systèmes d'alarme anti-intrusion certifiés",
      "Vidéosurveillance IP et enregistrement sécurisé",
      "Contrôle d'accès pour bureaux et sites sensibles",
      "Intégration avec alimentation secourue 24h/24",
    ],
    references: ["Système d'alarme — Save the Children, Bunia"],
    projectCategory: "Sécurité",
    image: "/photos/securite-armoire-controle.webp",
    imageAlt: `Armoire de contrôle et de protection installée par ${site.name}`,
  },
  {
    slug: "maintenance-froid",
    title: "Maintenance & climatisation",
    shortTitle: "Maintenance & climatisation",
    outcome:
      "Ne perdez plus une journée d'activité sur une panne.",
    delivery:
      "Contrats préventifs, dépannage rapide et entretien de vos climatisations.",
    excerpt:
      "Maintenance préventive et corrective des installations électriques, solaires et de climatisation.",
    description:
      "Une installation performante est une installation entretenue : sans suivi, une panne évitable coûte une journée d'activité, parfois davantage. Nos contrats couvrent la maintenance préventive et corrective de vos systèmes électriques, solaires et de climatisation, avec interventions planifiées, rapports techniques périodiques et assistance prioritaire — y compris sur des installations que nous n'avons pas posées. Afriland First Bank à Bunia nous confie ce suivi.",
    icon: Wrench,
    capabilities: [
      "Contrats de maintenance préventive planifiée",
      "Dépannage et interventions correctives rapides",
      "Entretien de systèmes de climatisation",
      "Contrôle, mesures et rapports techniques périodiques",
    ],
    references: [
      "Maintenance climatisation & installations — Afriland First Bank Bunia",
      "Suivi des parcs solaires installés (LTJ, ONG, radios)",
    ],
    projectCategory: "Maintenance",
    image: "/photos/climatisation-groupe-exterieur.webp",
    imageAlt: `Technicien ${site.name} intervenant sur un groupe de climatisation`,
  },
];

/**
 * Processus d'intervention — démarche 100% client.
 * Chaque étape porte son livrable : c'est ce que le client reçoit, et non ce
 * que l'entreprise fait, qui rend le parcours lisible.
 */
export const processSteps = [
  {
    step: "01",
    title: "Étude & audit gratuit",
    description:
      "Nous venons mesurer ce que votre site consomme réellement, équipement par équipement, et relever les contraintes d'implantation. Aucun engagement, aucun frais.",
    deliverable: "Rapport d'audit de charge",
  },
  {
    step: "02",
    title: "Conception & dimensionnement",
    description:
      "Vous recevez une proposition technique chiffrée : puissance, autonomie, composants et schémas. Vous savez exactement ce que vous achetez et ce que cela alimentera.",
    deliverable: "Schémas techniques et devis détaillé",
  },
  {
    step: "03",
    title: "Installation certifiée",
    description:
      "Nos techniciens déploient l'installation dans les délais annoncés, avec des équipements garantis, puis la mettent en service en votre présence.",
    deliverable: "Système installé et mis en service",
  },
  {
    step: "04",
    title: "Maintenance & suivi",
    description:
      "Vos équipes sont formées à l'exploitation courante, et un contrat d'entretien planifié prend le relais : contrôles périodiques, rapports et assistance prioritaire.",
    deliverable: "Équipes formées et contrat d'entretien",
  },
] as const;

export const faqs = [
  {
    question: "Intervenez-vous partout en République Démocratique du Congo ?",
    answer:
      "Oui. Notre zone d'intervention couvre les 26 provinces de la RDC. Nos équipes sont particulièrement actives dans l'Est du pays (Ituri, Nord-Kivu, Sud-Kivu) où la majorité de nos références ont été livrées, et nous mobilisons des équipes projet pour tout site sur le territoire national.",
  },
  {
    question: "L'étude de faisabilité est-elle réellement gratuite ?",
    answer:
      "Oui. L'audit de charge, la visite technique et la proposition de dimensionnement sont offerts. Vous recevez un devis détaillé et transparent avant tout engagement.",
  },
  {
    question: "Quels types de clients accompagnez-vous ?",
    answer:
      "Nous accompagnons les particuliers, les entreprises, les organisations internationales, les banques, les médias et les institutions publiques. Nos solutions vont des installations solaires résidentielles aux systèmes de forte capacité pour les bureaux, commerces, sites industriels et infrastructures critiques.",
  },
  {
    question: "Quels équipements installez-vous ?",
    answer:
      "Des équipements industriels éprouvés : panneaux monocristallins haute performance, onduleurs hybrides, batteries lithium LiFePO₄, parafoudres et armoires de distribution. Chaque composant est dimensionné selon l'étude technique de votre site.",
  },
  {
    question: "Assurez-vous la maintenance après l'installation ?",
    answer:
      "Oui. Chaque installation peut être couverte par un contrat de maintenance préventive et corrective, avec interventions planifiées, rapports techniques et assistance prioritaire. Nous assurons également la maintenance d'installations que nous n'avons pas posées.",
  },
  {
    question: "Sous quel délai obtient-on un devis ?",
    answer:
      "Nous répondons sous 24 h ouvrées à toute demande via le formulaire de contact ou WhatsApp. Pour les projets complexes, le devis détaillé est remis après la visite technique du site.",
  },
] as const;

/**
 * Le domaine correspondant à une catégorie de réalisation.
 *
 * Le lien entre un service et sa catégorie de projet est déjà porté par la
 * donnée (`Service.projectCategory`) : on le remonte plutôt que d'écrire une
 * table de correspondance parallèle, qui divergerait au premier ajout.
 * Sert à préqualifier /contact depuis une fiche d'étude de cas.
 */
export function serviceForCategory(
  category: Project["category"],
): Service | undefined {
  return services.find((service) => service.projectCategory === category);
}
