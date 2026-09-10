export const SERVICES_CATALOG = [
  {
    "id": "strat_comm",
    "group_fr": "Stratégies Digitales & Réseaux Sociaux",
    "group_en": "Digital Strategies & Social Media",
    "name_fr": "Élaboration de stratégies de communication",
    "name_en": "Development of communication strategies",
    "price": 200000
  },
  {
    "id": "community_mgmt",
    "group_fr": "Stratégies Digitales & Réseaux Sociaux",
    "group_en": "Digital Strategies & Social Media",
    "name_fr": "Community management multiplateformes (Instagram, Facebook, TikTok, LinkedIn)",
    "name_en": "Multi-platform community management (Instagram, Facebook, TikTok, LinkedIn)",
    "price": 150000
  },
  {
    "id": "influence_mkt",
    "group_fr": "Stratégies Digitales & Réseaux Sociaux",
    "group_en": "Digital Strategies & Social Media",
    "name_fr": "Campagnes de marketing d’influence ciblées",
    "name_en": "Targeted influencer marketing campaigns",
    "price": 200000
  },
  {
    "id": "content_creation",
    "group_fr": "Stratégies Digitales & Réseaux Sociaux",
    "group_en": "Digital Strategies & Social Media",
    "name_fr": "Création de contenu visuel (posts, reels, stories) & vidéo promotionnelle",
    "name_en": "Visual content creation (posts, reels, stories) & promotional videos",
    "price": 100000
  },
  {
    "id": "event_coverage",
    "group_fr": "Stratégies Digitales & Réseaux Sociaux",
    "group_en": "Digital Strategies & Social Media",
    "name_fr": "Promotion et Couverture des événements",
    "name_en": "Event promotion & live coverage",
    "price": 250000
  },
  {
    "id": "visual_identity",
    "group_fr": "Solutions IT & Design",
    "group_en": "IT & Design Solutions",
    "name_fr": "Identité visuelle et design graphique sur mesure",
    "name_en": "Custom visual identity & graphic design",
    "price": 100000
  },
  {
    "id": "web_ecommerce",
    "group_fr": "Solutions IT & Design",
    "group_en": "IT & Design Solutions",
    "name_fr": "Création de sites web vitrines & e-commerce (WordPress, Shopify) + SEO",
    "name_en": "Showcase & e-commerce web development (WordPress, Shopify) + SEO",
    "price": 300000
  },
  {
    "id": "it_support",
    "group_fr": "Solutions IT & Design",
    "group_en": "IT & Design Solutions",
    "name_fr": "Support IT (maintenance, conseil, cybersécurité de base)",
    "name_en": "IT Support (maintenance, consulting, basic cybersecurity)",
    "price": 120000
  },
  {
    "id": "print_design",
    "group_fr": "Solutions IT & Design",
    "group_en": "IT & Design Solutions",
    "name_fr": "Conception et impression de supports (flyers, cartes, brochures)",
    "name_en": "Print media design & printing (flyers, cards, brochures)",
    "price": 80000
  },
  {
    "id": "digital_consulting",
    "group_fr": "Solutions IT & Design",
    "group_en": "IT & Design Solutions",
    "name_fr": "Consulting digital & IT",
    "name_en": "Digital & IT Consulting",
    "price": 150000
  }
];

export const getLocalizedServicesCatalog = (lang = 'fr') => {
  const isEn = lang.startsWith('en');
  return SERVICES_CATALOG.map(item => ({
    id: item.id,
    group: isEn ? item.group_en : item.group_fr,
    name: isEn ? item.name_en : item.name_fr,
    price: item.price
  }));
};
