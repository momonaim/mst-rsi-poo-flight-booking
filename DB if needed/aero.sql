-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 15 jan. 2025 à 19:23
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `aero`
--

-- --------------------------------------------------------

--
-- Structure de la table `avion`
--

CREATE TABLE `avion` (
  `autonomie` int(11) NOT NULL,
  `capacite_ca` int(11) NOT NULL,
  `capacite_ce` int(11) NOT NULL,
  `capacite_cp` int(11) NOT NULL,
  `vitesse` int(11) NOT NULL,
  `id` bigint(20) NOT NULL,
  `nom` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `avion`
--

INSERT INTO `avion` (`autonomie`, `capacite_ca`, `capacite_ce`, `capacite_cp`, `vitesse`, `id`, `nom`) VALUES
(1111, 12, 12, 12, 111, 2, 'AE2224'),
(1110, 13, 11, 13, 110, 3, 'AE222s'),
(1111, 12, 12, 12, 111, 4, 'AE2225'),
(1111, 12, 12, 12, 111, 6, 'AE221'),
(1111, 12, 12, 12, 111, 7, 'AE222'),
(8888, 12, 3333, 12, 111, 8, 'AE211'),
(3000, 200, 50, 20, 900, 10, 'Boeing 737'),
(3500, 250, 60, 25, 850, 11, 'Airbus A320'),
(4000, 300, 70, 30, 950, 12, 'Boeing 777'),
(4500, 350, 80, 35, 950, 13, 'Airbus A350'),
(2500, 180, 40, 15, 800, 14, 'Boeing 737 Max'),
(3200, 220, 55, 22, 890, 15, 'Airbus A321'),
(2800, 230, 60, 25, 870, 16, 'Boeing 787'),
(4200, 330, 75, 32, 940, 17, 'Airbus A330'),
(3900, 320, 80, 28, 920, 18, 'Boeing 747'),
(5000, 400, 100, 40, 960, 19, 'Airbus A380'),
(1231, 4, 2, 4, 800, 21, 'Airbus A330'),
(500, 8, 6, 5, 800, 22, 'A34');

-- --------------------------------------------------------

--
-- Structure de la table `billet`
--

CREATE TABLE `billet` (
  `prix` double NOT NULL,
  `categorie_id` bigint(20) DEFAULT NULL,
  `class_passager_id` bigint(20) DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `reservation_id` bigint(20) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `passport` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `class_type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `billet`
--

INSERT INTO `billet` (`prix`, `categorie_id`, `class_passager_id`, `id`, `reservation_id`, `first_name`, `last_name`, `passport`, `category`, `class_type`) VALUES
(98.48, NULL, NULL, 20, 22, 'aa', 'mouadili', '1234331', 'Enfant (2-11 ans)', 'Economy'),
(123.1, NULL, NULL, 21, 22, 'oussama', 'mouadili', 'fere', 'Adulte', 'Economy'),
(110.79, NULL, NULL, 22, 22, 'MOUADILI', 'MOHA', 'fere', 'Jeune (12-17 ans)', 'Economy'),
(221.58, NULL, NULL, 23, 23, 'ABDELMOUNIM', 'MOUADILI', '1213', 'Jeune (12-17 ans)', 'First Class'),
(196.96, NULL, NULL, 24, 23, 'prenom', 'MOHA', '1212', 'Enfant (2-11 ans)', 'First Class'),
(98.48, NULL, NULL, 25, 24, 'aa', 'MOUADILI', '123213', 'Enfant (2-11 ans)', 'Economy'),
(123.1, NULL, NULL, 26, 24, 'prenom', 'mouadili', '13213', 'Adulte', 'Economy'),
(110.79, NULL, NULL, 27, 25, 'MOUADILI', 'ABDELMOUNIM', 'eze', 'Jeune (12-17 ans)', 'Economy'),
(123.1, NULL, NULL, 28, 26, 'MOUADILI', 'ABDELMOUNIM', '1212', 'Adulte', 'Economy');

-- --------------------------------------------------------

--
-- Structure de la table `categorie`
--

CREATE TABLE `categorie` (
  `reduction` double NOT NULL,
  `id` bigint(20) NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `categorie`
--

INSERT INTO `categorie` (`reduction`, `id`, `nom`, `description`) VALUES
(12, 1, 'Adulte', 'sdfsdfdsf'),
(0.1, 2, 'Jeune (12-17 ans)', 'azery'),
(0.2, 3, 'Enfant (2-11 ans)', 'jjdsf kjdhf\n'),
(0.5, 4, 'Bébé (moins de 2 ans)', 'aazerty'),
(12, 9, '12', '12 cxcxc'),
(0.5, 10, 'Bébé (moins de 2 ans)', 'sqdsqdsqd'),
(0, 11, 'Adulte', 'ddd'),
(0, 13, 'Adulte', '0324032333');

-- --------------------------------------------------------

--
-- Structure de la table `class`
--

CREATE TABLE `class` (
  `prix_km` int(11) NOT NULL,
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `class`
--

INSERT INTO `class` (`prix_km`, `id`, `name`) VALUES
(1, 1, 'Economy'),
(1, 2, 'Business'),
(2, 3, 'First Class'),
(1, 4, 'Premium Economy'),
(1, 5, 'Executive'),
(1, 6, 'Standard'),
(1, 7, 'Luxury');

-- --------------------------------------------------------

--
-- Structure de la table `class_passager`
--

CREATE TABLE `class_passager` (
  `prix_km` int(11) NOT NULL,
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `capacite_max` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `class_passager`
--

INSERT INTO `class_passager` (`prix_km`, `id`, `name`, `capacite_max`, `description`) VALUES
(1, 1, 'Economy', 11, 'efeffsfdfsdfdsf'),
(1, 2, 'Business', 16, 'aze ff'),
(2, 3, 'First Class', 11, ' ted dhfskfh\n'),
(1, 4, 'Premium Economy', 1, 'zefsr'),
(1, 5, 'Executive', 1, 'k\n'),
(1, 6, 'Standard', 7, 'yesy\n'),
(1, 7, 'Luxury', 9, 'azerty');

-- --------------------------------------------------------

--
-- Structure de la table `reservation`
--

CREATE TABLE `reservation` (
  `nbr_beneficier` int(11) NOT NULL,
  `prix_total` double NOT NULL,
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `vol_id` bigint(20) DEFAULT NULL,
  `statut` tinyint(1) DEFAULT 0,
  `canceled` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `reservation`
--

INSERT INTO `reservation` (`nbr_beneficier`, `prix_total`, `id`, `user_id`, `vol_id`, `statut`, `canceled`) VALUES
(2, 231, 1, 1, 8, 1, 1),
(2, 231, 2, 15, 6, 1, 0),
(1, 94.41, 27, 28, 32, 1, 1),
(1, 221.58, 28, 28, 25, 0, 0),
(1, 221.58, 29, 28, 25, 0, 0),
(1, 221.58, 30, 28, 25, 0, 0),
(1, 221.58, 31, 28, 25, 0, 0),
(1, 221.58, 32, 28, 25, 0, 0),
(1, 80, 33, 28, 33, 0, 0),
(1, 123.1, 34, 28, 25, 0, 0),
(1, 123.1, 35, 30, 25, 0, 0),
(1, 123.1, 36, 28, 25, 0, 0),
(1, 123.1, 37, 30, 25, 0, 0),
(1, 110.79, 38, 30, 25, 0, 1),
(1, 123.1, 39, 28, 25, 0, 0),
(1, 123.1, 40, 28, 29, 0, 1),
(1, 123.1, 41, 30, 25, 0, 1),
(1, 123.1, 42, 30, 25, 0, 0),
(1, 123.1, 43, 30, 25, 0, 0),
(1, 123.1, 44, 30, 25, 0, 0),
(1, 123.1, 45, 30, 25, 1, 0),
(1, 98.48, 46, 28, 29, 1, 0),
(1, 133.65, 47, 28, 38, 1, 0),
(1, 123.1, 48, 30, 25, 1, 0),
(1, 123.1, 49, 32, 29, 1, 0),
(2, 233.89, 50, 30, 25, 1, 0),
(1, 110.79, 51, 32, 29, 1, 0);

-- --------------------------------------------------------

--
-- Structure de la table `trajet`
--

CREATE TABLE `trajet` (
  `id_trajet` int(11) NOT NULL,
  `ville_arrivee` varchar(255) DEFAULT NULL,
  `ville_depart` varchar(255) DEFAULT NULL,
  `distance` double DEFAULT 0,
  `duree` double DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `trajet`
--

INSERT INTO `trajet` (`id_trajet`, `ville_arrivee`, `ville_depart`, `distance`, `duree`) VALUES
(1, 'CASA', 'RABAT', 1231, 0),
(2, 'CASA', 'PARIS', 1242, 0),
(3, 'Casablanca', 'Paris', 1888.21, 0),
(4, 'Paris', 'Casablanca', 1888.21, 0),
(5, 'Madrid', 'Casablanca', 835.34, 123),
(6, 'Paris', 'Casablanca', 1888.210011130339, 141.6157508347754),
(8, 'Tokyo', 'Paris', 9711.724818613746, 728.379361396031),
(10, 'Rabat', 'London', 2018.0671402989433, 151.35503552242074);

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `sexe` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `email`, `firstname`, `lastname`, `phone`, `role`, `sexe`, `username`, `password`) VALUES
(1, 'tes1@test.com', 'UpdameZZZZZ', 'user', '0324032333', 'ADMIN', 'Mme', 'TEST', NULL),
(6, 'tes1ZZ2@test.com', 'Upd', 'user', '7777777777', 'ADMIN', 'Mme', 'AAAA111', NULL),
(9, 'tes1ZjhZ2@test.com', 'Updated Name', 'user', '7777777777', 'ADMIN', 'Mme', 'AAAAAAAA', NULL),
(11, 'tes1ZjZ2@test.com', 'etst2', 'user', '7777777777', 'ADMIN', 'Mme', 'AAAAAAAA', NULL),
(14, 'example@gmail.com', 'zqsqs', 'sdsd', '987293723', 'ADMIN', 'male', 'UIUI', '123123456781111'),
(19, 'momonaim01@gmail.com', 'MOUADILI', 'ABDELMOUNIM', '0652182486', 'USER', 'itazzaz', 'test', '12312345678'),
(20, 'momonaim01@gmail.com', 'MOUADILI', 'ABDELMOUNIM', '0652182486', 'ADMIN', 'M', 'sss', '12312345678'),
(21, 'example@gmail.com', 'prenom', 'MOHA', '', 'USER', 'Mme', 'test', '12312345678'),
(23, 'momonaim01@gmail.com', 'MOUADILI', 'ABDELMOUNIM', '0652182486', 'USER', 'M', 'AZRE', '123'),
(24, 'tesTTTT1@test.com', 'AZERSSSS', 'user', 'QQQQ', 'ADMIN', 'Mme', 'TEST2', '123'),
(25, 'tesSSSTTTT1@test.com', 'AZERSSSS', 'user', 'QQQQ', 'ADMIN', 'Mme', 'TEST2', '123'),
(26, 'test@example.com', 'prenom', 'MOHA', '0652182486', NULL, 'sss', NULL, 'password'),
(27, 'prenom@example.com', 'prenom', 'MOHA', '0652182486', 'ADMIN', 'Female', 'prenom', 'password'),
(28, 'prenom1@example.com', 'preno1111', 'prenom', '48213212', 'USER', 'Male', 'prenomAAAz', 'password'),
(29, 'test@example.coma', 'test', 'test', '1234567890', 'USER', 'Male', 'test', 'password'),
(30, 'prenom2@example.com', 'Toner', 'A203L', '06521861288', 'USER', 'Male', 'Toner', 'password'),
(31, 'prenom12@example.comss', 'aaaa', 'aaaaa', '1212121212', 'USER', 'Male', 'aaaaa', 'password'),
(32, 'prenom4@example.com', 'doe', 'john', '0863378623', 'USER', 'Male', 'john', 'password'),
(33, 'basma@gmail.com', 'basma', 'boulli', '06508802486', 'USER', 'Mme', 'basmabl', 'azertyuiop');

-- --------------------------------------------------------

--
-- Structure de la table `ville`
--

CREATE TABLE `ville` (
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `id` bigint(20) NOT NULL,
  `nom` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `ville`
--

INSERT INTO `ville` (`latitude`, `longitude`, `id`, `nom`) VALUES
(48.8566, 2.3522, 47, 'Paris'),
(40.7128, -74.006, 48, 'New York'),
(35.6762, 139.6503, 49, 'Tokyo'),
(52.52, 13.405, 50, 'Berlin'),
(34.0209, -6.8416, 51, 'Rabat'),
(40.4168, -3.7038, 52, 'Madrid'),
(51.5074, -0.1278, 53, 'London'),
(37.7749, -122.4194, 54, 'San Francisco'),
(48.2082, 16.3738, 55, 'Vienna'),
(39.9042, 116.4074, 56, 'Beijing'),
(33.5731, -7.5898, 57, 'Casablanca');

-- --------------------------------------------------------

--
-- Structure de la table `vol`
--

CREATE TABLE `vol` (
  `ca_dispo` int(11) NOT NULL,
  `ce_dispo` int(11) NOT NULL,
  `cp_dispo` int(11) NOT NULL,
  `is_canceled` bit(1) NOT NULL,
  `trajet_id` int(11) DEFAULT NULL,
  `avion_id` bigint(20) DEFAULT NULL,
  `date_arrivee` date DEFAULT NULL,
  `date_depart` date DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `ville_arrivee` varchar(255) DEFAULT NULL,
  `ville_depart` varchar(255) DEFAULT NULL,
  `version` bigint(20) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `vol`
--

INSERT INTO `vol` (`ca_dispo`, `ce_dispo`, `cp_dispo`, `is_canceled`, `trajet_id`, `avion_id`, `date_arrivee`, `date_depart`, `id`, `ville_arrivee`, `ville_depart`, `version`) VALUES
(1222, 22, 121, b'0', 5, 11, '2025-01-16', '2025-01-15', 6, 'CASA', 'RABAT', 1),
(1222, 22, 121, b'0', 4, 11, '2025-01-17', '2025-01-16', 8, 'CASA', 'RABAT', 1),
(12, 222, 12, b'0', 1, 7, '2024-12-11', '2024-12-25', 10, 'CASA', 'RABAT', 0),
(12, 222, 12, b'0', 1, 7, '2025-01-09', '2025-01-10', 11, 'CASA', 'RABAT', 0),
(10, 20, 10, b'0', 1, 2, '2025-01-15', '2025-01-05', 21, 'New York', 'Casablanca', 0),
(15, 25, 15, b'0', 2, 3, '2025-01-18', '2025-01-08', 22, 'Berlin', 'Casablanca', 0),
(12, 22, 12, b'0', 3, 4, '2025-01-19', '2025-01-09', 23, 'Madrid', 'Casablanca', 0),
(8, 18, 8, b'0', 4, 12, '2025-01-20', '2025-01-10', 24, 'Tokyo', 'Casablanca', 1),
(18, 0, 18, b'0', 1, 6, '2025-01-22', '2025-01-12', 25, 'Paris', 'Casablanca', 7),
(5, 15, 5, b'0', 2, 7, '2025-01-23', '2025-01-13', 26, 'Rabat', 'Casablanca', 0),
(10, 20, 10, b'0', 3, 8, '2025-01-25', '2025-01-15', 27, 'London', 'Casablanca', 0),
(12, 22, 12, b'0', 4, 14, '2025-01-26', '2025-01-16', 28, 'New York', 'Casablanca', 1),
(12, 0, 12, b'0', 1, 2, '2025-01-21', '2025-01-19', 29, 'Paris', 'Casablanca', 3),
(15, 25, 15, b'0', 2, 3, '2025-01-22', '2025-01-19', 30, 'Berlin', 'Casablanca', 0),
(8, 18, 8, b'1', 3, 4, '2025-01-23', '2025-01-19', 31, 'Tokyo', 'Casablanca', 0),
(10, 20, 10, b'0', 4, 19, '2025-01-24', '2025-01-19', 32, 'London', 'Casablanca', 0),
(0, 30, 20, b'0', 1, 6, '2025-01-25', '2025-01-19', 33, 'Rabat', 'Casablanca', 0),
(0, 0, 0, b'0', 5, 17, '2025-01-13', '2025-01-12', 34, NULL, NULL, 0),
(0, 0, 0, b'0', 5, 17, '2025-01-13', '2025-01-12', 35, 'Madrid', 'Casablanca', 0),
(7, 5, 2, b'0', 5, 17, '2025-01-13', '2025-01-12', 36, 'Madrid', 'Casablanca', 0),
(3, 0, 6, b'0', 5, 17, '2025-01-14', '2025-01-13', 37, 'Madrid', 'Casablanca', 0),
(3, 5, 5, b'0', 5, 17, '2025-01-14', '2025-01-13', 38, 'Madrid', 'Casablanca', 1),
(2, 2, 2, b'0', 8, 13, '2025-01-16', '2025-01-14', 39, 'Tokyo', 'Paris', 0),
(2, 2, 2, b'0', 4, 13, '2025-01-16', '2025-01-14', 40, 'Paris', 'Casablanca', 0),
(2, 3, 0, b'0', 5, 15, '2025-01-15', '2025-01-14', 41, 'Madrid', 'Casablanca', 0),
(180, 40, 15, b'0', 5, 14, '2025-01-16', '2025-01-14', 42, 'Madrid', 'Casablanca', 0),
(180, 40, 15, b'0', 3, 14, '2025-01-16', '2025-01-15', 43, 'Casablanca', 'Paris', 0),
(220, 55, 22, b'0', 8, 15, '2025-01-16', '2025-01-15', 44, 'Tokyo', 'Paris', 0),
(400, 100, 40, b'0', 8, 19, '2025-01-16', '2025-01-15', 45, 'Tokyo', 'Paris', 0),
(350, 80, 35, b'0', 4, 13, '2023-11-16', '2023-11-15', 46, 'Paris', 'Casablanca', 0);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `avion`
--
ALTER TABLE `avion`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `billet`
--
ALTER TABLE `billet`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKq9xsnh55dhpncap27nsm31hp4` (`categorie_id`),
  ADD UNIQUE KEY `UK5d486cebtixewhj30iac5bs2e` (`class_passager_id`),
  ADD KEY `FK7eyd6261cbdagks95hne8wgnr` (`reservation_id`);

--
-- Index pour la table `categorie`
--
ALTER TABLE `categorie`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `class`
--
ALTER TABLE `class`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `class_passager`
--
ALTER TABLE `class_passager`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKsk7ehgydowtn8krnb0j44gbbk` (`user_id`),
  ADD KEY `FKfj4ypmo6yenc9x7fl8ndcu29b` (`vol_id`);

--
-- Index pour la table `trajet`
--
ALTER TABLE `trajet`
  ADD PRIMARY KEY (`id_trajet`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `ville`
--
ALTER TABLE `ville`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `vol`
--
ALTER TABLE `vol`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKi36u7096ahgjbjwinm85pfwjw` (`avion_id`),
  ADD KEY `FK1fajvtcs6dlnycastkokgc1w1` (`trajet_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `avion`
--
ALTER TABLE `avion`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table `billet`
--
ALTER TABLE `billet`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT pour la table `categorie`
--
ALTER TABLE `categorie`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `class`
--
ALTER TABLE `class`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `class_passager`
--
ALTER TABLE `class_passager`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT pour la table `trajet`
--
ALTER TABLE `trajet`
  MODIFY `id_trajet` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT pour la table `ville`
--
ALTER TABLE `ville`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT pour la table `vol`
--
ALTER TABLE `vol`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `billet`
--
ALTER TABLE `billet`
  ADD CONSTRAINT `FK7eyd6261cbdagks95hne8wgnr` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`id`),
  ADD CONSTRAINT `FKcigbtgg9aso8vye9yurjlbnl1` FOREIGN KEY (`categorie_id`) REFERENCES `categorie` (`id`),
  ADD CONSTRAINT `FKdbuucc4xqsqgklob9kgliatoo` FOREIGN KEY (`class_passager_id`) REFERENCES `class_passager` (`id`);

--
-- Contraintes pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `FKfj4ypmo6yenc9x7fl8ndcu29b` FOREIGN KEY (`vol_id`) REFERENCES `vol` (`id`),
  ADD CONSTRAINT `FKsk7ehgydowtn8krnb0j44gbbk` FOREIGN KEY (`user_id`) REFERENCES `utilisateur` (`id`);

--
-- Contraintes pour la table `vol`
--
ALTER TABLE `vol`
  ADD CONSTRAINT `FK1fajvtcs6dlnycastkokgc1w1` FOREIGN KEY (`trajet_id`) REFERENCES `trajet` (`id_trajet`),
  ADD CONSTRAINT `FKi36u7096ahgjbjwinm85pfwjw` FOREIGN KEY (`avion_id`) REFERENCES `avion` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
