-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 10, 2026 at 08:43 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `digit_connect_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('superadmin','editor') DEFAULT 'editor',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'Admin Digit', 'admin@digit-connect.agency', 'admin123', 'superadmin', '2026-09-04 10:31:28');

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
CREATE TABLE IF NOT EXISTS `articles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author_id` int DEFAULT NULL,
  `slug` varchar(200) NOT NULL,
  `title_fr` varchar(255) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `content_fr` longtext NOT NULL,
  `content_en` longtext NOT NULL,
  `excerpt_fr` text,
  `excerpt_en` text,
  `category` enum('strat_comm','community_mgmt','influence_mkt','content_creation','event_coverage','visual_identity','web_ecommerce','it_support','print_design','digital_consulting') NOT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT '0',
  `views_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `author_id` (`author_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` (`id`, `author_id`, `slug`, `title_fr`, `title_en`, `content_fr`, `content_en`, `excerpt_fr`, `excerpt_en`, `category`, `cover_image`, `is_published`, `views_count`, `created_at`, `updated_at`) VALUES
(2, 1, 'choisir-son-site-web', 'Comment choisir entre site vitrine et e-commerce ?', 'How to Choose Between a Showcase and E-commerce Site', 'Un guide complet pour évaluer vos besoins digitaux et convertir efficacement vos visiteurs en clients.', 'A complete guide to evaluating your digital needs and effectively converting visitors into customers.', 'Conseils stratégiques pour orienter le développement de votre plateforme web.', 'Strategic advice to guide your web platform development.', 'web_ecommerce', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', 1, 110, '2026-09-05 00:05:04', '2026-09-07 23:00:00'),
(3, 1, 'importance-charte-graphique', 'Pourquoi l identité visuelle est vitale pour votre PME', 'Why Visual Identity is Vital for Your SME', 'Une identité visuelle forte renforce la crédibilité et la mémorabilité de votre marque sur le marché.', 'A strong visual identity reinforces your brand authority and recall in the market.', 'Découvrez comment valoriser votre image de marque à travers un design cohérent.', 'Discover how to enhance your brand image through consistent design.', 'visual_identity', 'https://images.unsplash.com/photo-1561070791-2526d30994b5', 1, 87, '2026-09-05 00:05:04', '2026-09-06 18:19:04'),
(4, 1, 'marketing-influence-cameroun', 'Réussir sa campagne d influence au Cameroun', 'Succeeding in Influencer Marketing in Cameroon', 'Les étapes clés pour choisir les bons créateurs de contenu et mesurer le ROI de vos campagnes.', 'Key steps to select the right content creators and measure campaign ROI.', 'Guide pratique pour collaborer avec les créateurs de contenu locaux.', 'Practical guide for collaborating with local content creators.', 'influence_mkt', 'https://images.unsplash.com/photo-1557804506-669a67965ba0', 1, 111, '2026-09-05 00:05:04', '2026-09-05 02:07:00'),
(5, 1, 'securiser-son-infra-it', 'Les piliers de la cybersécurité pour les entreprises', 'Cybersecurity Essentials for Businesses', 'Protéger vos données d entreprise contre les cybermenaces actuelles avec des gestes simples.', 'Protecting your corporate data against current cyber threats with practical steps.', 'Un aperçu des meilleures pratiques de sécurité informatique pour PME.', 'An overview of IT security best practices for SMEs.', 'it_support', 'https://images.unsplash.com/photo-1563986768609-322da13575f3', 1, 66, '2026-09-05 00:05:04', '2026-09-10 04:01:17'),
(6, 1, 'evenementiel-et-digital', 'Maximiser la portée de vos événements grâce au digital', 'Maximizing Event Reach Through Digital Coverage', 'Allier couverture média physique et amplification digitale pour un impact maximal.', 'Combining physical media coverage and digital amplification for maximum impact.', 'Stratégies de couverture événementielle live et pré-événement.', 'Live event coverage and pre-event amplification strategies.', 'event_coverage', 'https://images.unsplash.com/photo-1511578314322-379afb476865', 1, 140, '2026-09-05 00:05:04', '2026-09-06 17:49:07'),
(7, 1, 'optimiser-conversion-ecommerce-cameroun', '5 leviers pour booster les ventes de votre boutique e-commerce', '5 Key Tactics to Boost Your E-Commerce Sales', 'Découvrez comment optimiser l expérience utilisateur, intégrer efficacement les paiements Mobile Money et structurer vos campagnes marketing pour maximiser le taux de conversion de votre boutique en ligne.', 'Learn how to optimize user experience, seamlessly integrate Mobile Money payments, and structure marketing campaigns to maximize your online store conversion rate.', 'Des stratégies concrètes pour transformer vos visiteurs en acheteurs réguliers.', 'Actionable strategies to turn casual website visitors into loyal buyers.', 'web_ecommerce', 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80', 1, 0, '2026-09-10 03:59:35', '2026-09-10 03:59:35');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `full_name`, `email`, `phone`, `subject`, `message`, `created_at`) VALUES
(3, 'Carine Nsangou', 'c.nsangou@boutique-elegance.cm', '+237 677 88 99 00', 'Community Management & Réseaux Sociaux', 'Bonjour, nous recherchons une agence capable de prendre en charge la création de contenu visuel et la gestion de nos pages Instagram et Facebook. Merci de nous transmettre vos tarifs.', '2026-09-04 00:18:03'),
(4, 'Samuel Mbappe', 'samuel.mbappe@techconsult.io', '+237 655 44 33 22', 'Audit Cybersécurité & Support IT', 'Salut l\'équipe DIGIT-CONNECT, nous avons besoin d\'un accompagnement pour sécuriser nos serveurs internes et former notre équipe aux bonnes pratiques informatiques.', '2026-09-03 00:18:03'),
(5, 'Aline Talla', 'atalla@horizon-immo.cm', '+237 690 11 22 33', 'Conception d\'Identité Visuelle & Charte Graphique', 'Bonjour, nous lançons une nouvelle filiale immobilière à Douala et souhaitons concevoir un logo, des cartes de visite ainsi qu\'un catalogue d\'offres. Quel est votre délai moyen de réalisation ?', '2026-09-02 00:18:03');

-- --------------------------------------------------------

--
-- Table structure for table `portfolio`
--

DROP TABLE IF EXISTS `portfolio`;
CREATE TABLE IF NOT EXISTS `portfolio` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title_fr` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title_en` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('strat_comm','community_mgmt','influence_mkt','content_creation','event_coverage','visual_identity','web_ecommerce','it_support','print_design','digital_consulting') COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` longtext COLLATE utf8mb4_unicode_ci,
  `project_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description_fr` text COLLATE utf8mb4_unicode_ci,
  `description_en` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `portfolio`
--

INSERT INTO `portfolio` (`id`, `title_fr`, `title_en`, `category`, `client_name`, `image_url`, `project_url`, `description_fr`, `description_en`, `created_at`) VALUES
(2, 'Campagne Social Media', 'Launch Social Media Campaign', 'community_mgmt', 'Kaffo Foods', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7', NULL, 'Stratégie de contenu et community management pour le lancement de marque.', 'Content strategy and community management for brand product launch.', '2026-09-05 00:05:04'),
(3, 'Branding & Impression', 'Branding & Printing', 'print_design', 'Aura Cosmetics', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9', NULL, 'Conception du logo, packaging et brochures de présentations commerciales.', 'Logo design, packaging, and commercial presentation brochures.', '2026-09-05 00:05:04'),
(5, 'Campagne Influenceurs Fêtes', 'Holiday Influencer Campaign', 'influence_mkt', 'Sawa Style', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', NULL, 'Collaboration avec 5 créateurs clés pour la collection de fin d année.', 'Partnership with 5 key creators for the year-end collection.', '2026-09-05 00:05:04'),
(6, 'Audit & Modernisation Système IT', 'IT System Audit & Upgrades', 'it_support', 'Sinergii SARL', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c', NULL, 'Conseil, sécurisation du réseau et installation d outils collaboratifs.', 'Consulting, network security, and installation of collaborative tools.', '2026-09-05 00:05:04'),
(7, 'Plateforme E-Commerce & Web App', 'E-Commerce Platform & Web App', 'web_ecommerce', 'Sawa Market', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80', NULL, 'Conception et développement d une boutique en ligne fluide avec intégration des paiements Mobile Money.', 'Design and development of a seamless online store integrated with Mobile Money payment gateways.', '2026-09-10 02:41:45'),
(8, 'Couverture Vidéo & Shooting Événementiel', 'Event Video Coverage & Photography', 'event_coverage', 'Tech Forum Douala', 'https://images.unsplash.com/photo-1511578314322-379afb476865', NULL, 'Captation photo/vidéo HD, retransmission en direct et production de reels pour les réseaux sociaux.', 'HD photo/video capture, live streaming, and social media reels production for corporate summit.', '2026-09-10 02:41:45');

-- --------------------------------------------------------

--
-- Table structure for table `quotes`
--

DROP TABLE IF EXISTS `quotes`;
CREATE TABLE IF NOT EXISTS `quotes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quote_code` varchar(50) NOT NULL,
  `client_name` varchar(150) NOT NULL,
  `client_email` varchar(150) NOT NULL,
  `client_phone` varchar(50) NOT NULL,
  `client_segment` enum('pme','artist','brand') NOT NULL,
  `selected_services` json NOT NULL,
  `estimated_total` decimal(10,2) NOT NULL,
  `status` enum('pending','contacted','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `quote_code` (`quote_code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `quotes`
--

INSERT INTO `quotes` (`id`, `quote_code`, `client_name`, `client_email`, `client_phone`, `client_segment`, `selected_services`, `estimated_total`, `status`, `created_at`) VALUES
(3, 'DC-040926-A1B', 'Baastel', 'contact@baastel.com', '+237671234567', 'pme', '[\"strat_comm\", \"community_mgmt\", \"web_ecommerce\", \"visual_identity\", \"print_design\", \"digital_consulting\"]', 930000.00, 'pending', '2026-09-04 22:22:43');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` json NOT NULL,
  `title_fr` varchar(150) NOT NULL,
  `title_en` varchar(150) NOT NULL,
  `description_fr` text,
  `description_en` text,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `category`, `title_fr`, `title_en`, `description_fr`, `description_en`, `is_active`) VALUES
(1, '[\"web_ecommerce\"]', 'Développement Web & Mobile', 'Web & Mobile Development', 'Conception de sites vitrines, applications Web SaaS, e-commerce et solutions logicielles sur-mesure.', 'Design of showcase sites, SaaS Web applications, e-commerce and custom software solutions.', 1),
(2, '[\"visual_identity\", \"print_design\"]', 'Design Graphique & Branding', 'Graphic Design & Branding', 'Création d\'identités visuelles percutantes, logos, charte graphique, visuels publicitaires et supports imprimés.', 'Creation of impactful visual identities, logos, brand guidelines, advertising visuals and print marketing.', 1),
(3, '[\"community_mgmt\", \"influence_mkt\"]', 'Community Management & SMM', 'Community Management & SMM', 'Gestion stratégique de vos réseaux sociaux, création de contenu vidéo/photo et campagnes d\'influence ciblées.', 'Strategic management of your social networks, video/photo content creation and targeted influencer campaigns.', 1),
(4, '[\"it_support\"]', 'Support IT & Infogérance', 'IT Support & Managed Services', 'Maintenance de parc informatique, sécurisation des données, virtualisation et assistance technique Helpdesk.', 'IT fleet maintenance, data security, virtualization and technical helpdesk assistance.', 1),
(5, '[\"digital_consulting\"]', 'Conseil & Stratégie Digitale', 'Digital Strategy & Consulting', 'Audit de visibilité, accompagnement stratégique et formation des équipes aux outils numériques modernes.', 'Visibility audit, strategic support and team training on modern digital tools.', 1),
(6, '[\"event_coverage\", \"content_creation\"]', 'Couverture Événementielle', 'Event Coverage', 'Captation vidéo/photo professionnelle, retransmission en direct et production de contenus promotionnels pour vos événements d’entreprise.', 'Professional video/photo capture, live streaming, and promotional content production for your corporate events.', 1);

-- --------------------------------------------------------

--
-- Table structure for table `service_catalog`
--

DROP TABLE IF EXISTS `service_catalog`;
CREATE TABLE IF NOT EXISTS `service_catalog` (
  `id` varchar(100) NOT NULL,
  `group_fr` varchar(255) NOT NULL,
  `group_en` varchar(255) NOT NULL,
  `name_fr` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `service_catalog`
--

INSERT INTO `service_catalog` (`id`, `group_fr`, `group_en`, `name_fr`, `name_en`, `price`, `display_order`, `created_at`) VALUES
('community_mgmt', 'Stratégies Digitales & Réseaux Sociaux', 'Digital Strategies & Social Media', 'Community management multiplateformes (Instagram, Facebook, TikTok, LinkedIn)', 'Multi-platform community management (Instagram, Facebook, TikTok, LinkedIn)', 150000.00, 2, '2026-09-08 05:10:00'),
('content_creation', 'Stratégies Digitales & Réseaux Sociaux', 'Digital Strategies & Social Media', 'Création de contenu visuel (posts, reels, stories) & vidéo promotionnelle', 'Visual content creation (posts, reels, stories) & promotional videos', 100000.00, 4, '2026-09-08 05:10:00'),
('digital_consulting', 'Solutions IT & Design', 'IT & Design Solutions', 'Consulting digital & IT', 'Digital & IT Consulting', 150000.00, 10, '2026-09-08 05:10:00'),
('event_coverage', 'Stratégies Digitales & Réseaux Sociaux', 'Digital Strategies & Social Media', 'Promotion et Couverture des événements', 'Event promotion & live coverage', 250000.00, 5, '2026-09-08 05:10:00'),
('influence_mkt', 'Stratégies Digitales & Réseaux Sociaux', 'Digital Strategies & Social Media', 'Campagnes de marketing d’influence ciblées', 'Targeted influencer marketing campaigns', 200000.00, 3, '2026-09-08 05:10:00'),
('it_support', 'Solutions IT & Design', 'IT & Design Solutions', 'Support IT (maintenance, conseil, cybersécurité de base)', 'IT Support (maintenance, consulting, basic cybersecurity)', 120000.00, 8, '2026-09-08 05:10:00'),
('print_design', 'Solutions IT & Design', 'IT & Design Solutions', 'Conception et impression de supports (flyers, cartes, brochures)', 'Print media design & printing (flyers, cards, brochures)', 80000.00, 9, '2026-09-08 05:10:00'),
('strat_comm', 'Stratégies Digitales & Réseaux Sociaux', 'Digital Strategies & Social Media', 'Élaboration de stratégies de communication', 'Development of communication strategies', 200000.00, 1, '2026-09-08 05:10:00'),
('visual_identity', 'Solutions IT & Design', 'IT & Design Solutions', 'Identité visuelle et design graphique sur mesure', 'Custom visual identity & graphic design', 100000.00, 6, '2026-09-08 05:10:00'),
('web_ecommerce', 'Solutions IT & Design', 'IT & Design Solutions', 'Création de sites web vitrines & e-commerce (WordPress, Shopify) + SEO', 'Showcase & e-commerce web development (WordPress, Shopify) + SEO', 300000.00, 7, '2026-09-08 05:10:00');

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

DROP TABLE IF EXISTS `team_members`;
CREATE TABLE IF NOT EXISTS `team_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(150) NOT NULL,
  `role_fr` varchar(150) NOT NULL,
  `role_en` varchar(150) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `photo_url` longtext,
  `social_link` varchar(255) DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `team_members`
--

INSERT INTO `team_members` (`id`, `full_name`, `role_fr`, `role_en`, `email`, `phone`, `photo_url`, `social_link`, `display_order`, `is_active`, `created_at`) VALUES
(2, 'Carine NGUEMBOU', 'Directrice de Stratégie Digitale', 'Head of Digital Strategy', 'carine@digit-connect.agency', '+237600000002', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2', 'https://linkedin.com', 2, 1, '2026-09-05 00:05:04'),
(3, 'Marc KAMGA', 'Senior UI/UX & Graphic Designer', 'Senior UI/UX & Graphic Designer', 'marc@digit-connect.agency', '+237600000003', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', 'https://linkedin.com', 3, 1, '2026-09-05 00:05:04'),
(4, 'Sandra FOTSO', 'Lead Community & Content Manager', 'Lead Community & Content Manager', 'sandra@digit-connect.agency', '+237600000004', 'https://images.unsplash.com/photo-1580489944761-15a19d654956', 'https://linkedin.com', 4, 1, '2026-09-05 00:05:04'),
(5, 'Paul ETOUNDI', 'Spécialiste IT Support & Cybersécurité', 'IT Support & Cybersecurity Specialist', 'paul@digit-connect.agency', '+237600000005', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', 'https://linkedin.com', 5, 1, '2026-09-05 00:05:04');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
