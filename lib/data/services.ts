import {
  BatteryCharging,
  PlugZap,
  RadioTower,
  ShieldCheck,
  Sun,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  excerpt: string;
  description: string;
  icon: LucideIcon;
  capabilities: string[];
  references: string[];
  image: string;
  imageAlt: string;
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
    excerpt:
      "Centrales et kits solaires pour sites domestiques, industriels et institutionnels — de l'étude au raccordement.",
    description:
      "Nous concevons, dimensionnons et installons des systèmes solaires complets : centrales pour bâtiments administratifs et bancaires, kits professionnels pour bureaux d'ONG, salles communautaires et stations de radio. Chaque installation est dimensionnée selon un audit de charge précis, avec des équipements conformes aux exigences des bailleurs et institutions.",
    icon: Sun,
    capabilities: [
      "Audit énergétique et dimensionnement sur mesure",
      "Centrales solaires pour bâtiments publics et privés",
      "Kits solaires professionnels pour bureaux et ONG",
      "Éclairage public et solutions communautaires",
      "Mise en service, formation et transfert de compétences",
    ],
    references: [
      "Bureau administratif du territoire de Mahagi — projet PDL-145T",
      "Banque CADECO Mahagi (rénovation + centrale solaire)",
      "Salles du royaume LTJ — Goma & Bunia",
      "Bureaux CARE, ALIMA & LSC — Bunia et Numbi",
    ],
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1600&q=80",
    imageAlt:
      "Champ de panneaux solaires photovoltaïques sous un ciel dégagé",
  },
  {
    slug: "backup-stockage",
    title: "Systèmes backup & stockage d'énergie",
    shortTitle: "Backup & stockage",
    excerpt:
      "Onduleurs hybrides et parcs batteries lithium pour une continuité électrique 24h/24, même hors réseau.",
    description:
      "Coupures réseau, sites isolés, équipements critiques : nous installons des systèmes de secours complets — onduleurs hybrides, parcs batteries lithium et supervision — qui garantissent la continuité de vos opérations. Nos backups alimentent déjà des serveurs télécoms, des stations de radio et des bureaux d'organisations internationales.",
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
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Technicien intervenant sur une installation électrique",
  },
  {
    slug: "infrastructure-electrique",
    title: "Infrastructure électrique industrielle",
    shortTitle: "Infrastructure électrique",
    excerpt:
      "Tableaux, distribution basse tension, protection contre les surtensions et mise en conformité des bâtiments.",
    description:
      "Nous réalisons et rénovons les infrastructures électriques des bâtiments professionnels : tableaux et armoires de distribution, câblage structuré, protection foudre et surtension, mise en conformité complète. Notre rénovation de l'agence CADECO de Mahagi illustre notre capacité à moderniser des sites bancaires en activité.",
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
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Électricien professionnel intervenant sur un tableau électrique",
  },
  {
    slug: "telecom-medias",
    title: "Télécommunications & médias",
    shortTitle: "Télécoms & médias",
    excerpt:
      "Alimentation autonome des stations de radio, serveurs et sites télécoms isolés à travers l'Est de la RDC.",
    description:
      "Les infrastructures de communication n'ont pas droit à la coupure. Nous alimentons en énergie stable et autonome les stations de radio communautaires et nationales, les serveurs et les sites télécoms : cinq stations de radio équipées en kits solaires et un serveur télécom sécurisé à Goma en témoignent.",
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
    image:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Pylônes de transmission au coucher du soleil",
  },
  {
    slug: "securite-electronique",
    title: "Sécurité électronique",
    shortTitle: "Sécurité électronique",
    excerpt:
      "Systèmes d'alarme, contrôle d'accès et vidéosurveillance pour bureaux, banques et sites sensibles.",
    description:
      "Nous protégeons les sites de nos clients avec des systèmes de sécurité électronique fiables : alarmes anti-intrusion, contrôle d'accès et vidéosurveillance, intégrés à une alimentation secourue pour rester opérationnels en toute circonstance. Le bureau de Save the Children à Bunia nous a confié la sécurisation de ses locaux.",
    icon: ShieldCheck,
    capabilities: [
      "Systèmes d'alarme anti-intrusion certifiés",
      "Vidéosurveillance IP et enregistrement sécurisé",
      "Contrôle d'accès pour bureaux et sites sensibles",
      "Intégration avec alimentation secourue 24h/24",
    ],
    references: ["Système d'alarme — Save the Children, Bunia"],
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Ingénieure contrôlant un équipement technique",
  },
  {
    slug: "maintenance-froid",
    title: "Maintenance & climatisation",
    shortTitle: "Maintenance & froid",
    excerpt:
      "Maintenance préventive et corrective des installations électriques, solaires et de climatisation.",
    description:
      "Une installation performante est une installation entretenue. Nos équipes assurent la maintenance préventive et corrective des systèmes électriques, solaires et de climatisation — avec des contrats adaptés aux exigences des institutions financières, comme celui mené pour Afriland First Bank à Bunia.",
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
    image:
      "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Technicien assemblant un module solaire",
  },
];

/** Processus d'intervention — démarche 100% client. */
export const processSteps = [
  {
    step: "01",
    title: "Étude & audit gratuit",
    description:
      "Visite du site, analyse des besoins énergétiques et audit de charge complet, sans engagement.",
  },
  {
    step: "02",
    title: "Conception & dimensionnement",
    description:
      "Proposition technique détaillée, schémas, dimensionnement précis et devis transparent.",
  },
  {
    step: "03",
    title: "Installation certifiée",
    description:
      "Déploiement par nos techniciens qualifiés, dans les délais, avec des équipements garantis.",
  },
  {
    step: "04",
    title: "Maintenance & suivi",
    description:
      "Mise en service, formation de vos équipes et contrats de maintenance pour durer.",
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
      "Des organisations internationales (MONUSCO, CARE, Save the Children, ALIMA), des banques (Afriland First Bank, CADECO), des programmes publics (PDL-145T), des médias et des entreprises privées. Nos process répondent aux exigences documentaires des bailleurs et institutions.",
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
