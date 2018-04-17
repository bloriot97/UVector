-- phpMyAdmin SQL Dump
-- version 3.3.7deb7
-- http://www.phpmyadmin.net
--
-- Serveur: localhost
-- Généré le : Lun 13 Juin 2016 à 15:55
-- Version du serveur: 5.1.73
-- Version de PHP: 5.3.3-7+squeeze19

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `dbtest`
--

-- --------------------------------------------------------

--
-- Structure de la table `Cursus`
--

CREATE TABLE IF NOT EXISTS `Cursus` (
  `loginEtudiant` varchar(8) NOT NULL,
  `codeUV` varchar(6) NOT NULL,
  `codeSemestre` char(5) NOT NULL,
  `GX` char(8) NOT NULL,
  `GX_DD` char(8) DEFAULT NULL,
  PRIMARY KEY (`loginEtudiant`,`codeUV`,`codeSemestre`),
  KEY `codeUV` (`codeUV`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `Cursus`
--

INSERT INTO `Cursus` (`loginEtudiant`, `codeUV`, `codeSemestre`, `GX`, `GX_DD`) VALUES
-- --------------------------------------------------------

--
-- Structure de la table `Etudiant`
--

CREATE TABLE IF NOT EXISTS `Etudiant` (
  `loginEtudiant` varchar(8) NOT NULL,
  PRIMARY KEY (`loginEtudiant`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `Etudiant`
--

INSERT INTO `Etudiant` (`loginEtudiant`) VALUES


-- --------------------------------------------------------

--
-- Structure de la table `UV`
--

CREATE TABLE IF NOT EXISTS `UV` (
  `codeUV` varchar(6) NOT NULL,
  `categorieUV` varchar(6) DEFAULT NULL,
  `nomUV` varchar(100) DEFAULT NULL,
  `nbCreditsUV` int(2) DEFAULT NULL,
  `descriptionUV` varchar(4000) DEFAULT NULL,
  PRIMARY KEY (`codeUV`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `UV`
--

INSERT INTO `UV` (`codeUV`, `categorieUV`, `nomUV`, `nbCreditsUV`, `descriptionUV`) VALUES

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `Cursus`
--
ALTER TABLE `Cursus`
  ADD CONSTRAINT `Cursus_ibfk_1` FOREIGN KEY (`loginEtudiant`) REFERENCES `Etudiant` (`loginEtudiant`),
  ADD CONSTRAINT `Cursus_ibfk_2` FOREIGN KEY (`codeUV`) REFERENCES `UV` (`codeUV`);
