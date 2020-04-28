-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mydb
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `matches`
--

DROP TABLE IF EXISTS `matches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matches` (
  `matchID` int NOT NULL AUTO_INCREMENT,
  `userID` int DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `score1` int DEFAULT NULL,
  `score2` int DEFAULT NULL,
  `teamID1` int DEFAULT NULL,
  `teamID2` int DEFAULT NULL,
  PRIMARY KEY (`matchID`),
  UNIQUE KEY `idMatches_UNIQUE` (`matchID`),
  KEY `userID_idx` (`userID`),
  CONSTRAINT `userID` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matches`
--

LOCK TABLES `matches` WRITE;
/*!40000 ALTER TABLE `matches` DISABLE KEYS */;
INSERT INTO `matches` VALUES (1,1,'test',1,2,1,30),(3,1,'test3',6,0,4,34),(6,3,'test3',3,6,25,25),(8,3,'test34',2,3,12,3),(9,3,'test34',2,3,12,3),(10,1,'test34',2,3,12,3),(11,1,'test34',2,3,12,3),(12,1,'test34',2,3,12,3),(13,1,'test34',2,3,12,3),(14,1,'test34',2,3,12,3),(17,7,'test34',2,3,12,3);
/*!40000 ALTER TABLE `matches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `teamID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`teamID`),
  UNIQUE KEY `teamID_UNIQUE` (`teamID`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` VALUES (1,'Arsenal'),(2,'Aston Villa'),(3,'Barnsley'),(4,'Birmingham City'),(5,'Blackburn Rovers'),(6,'Blackpool'),(7,'Bournemouth'),(8,'Bradford City'),(9,'Brighton & Hove Albion'),(10,'Burnley'),(11,'Cardiff City'),(12,'Charlton Athletic'),(13,'Chelsea'),(14,'Coventry City'),(15,'Crystal Palace'),(16,'Derby County'),(17,'Everton'),(18,'Fulham'),(19,'Huddersfield Town'),(20,'Hull City'),(21,'Ipswich Town'),(22,'Leeds United'),(23,'Leicester City'),(24,'Liverpool'),(25,'Manchester City'),(26,'Manchester United'),(27,'Middlesbrough'),(28,'Newcastle United'),(29,'Norwich City'),(30,'Nottingham Forest'),(31,'Oldham Athletic'),(32,'Portsmouth'),(33,'Queens Park\nRangers'),(34,'Reading'),(35,'Sheffield United'),(36,'Sheffield Wednesday'),(37,'Southampton'),(38,'Stoke City'),(39,'Sunderland'),(40,'Swansea City'),(41,'Swindon Town'),(42,'Tottenham Hotspur'),(43,'Watford'),(44,'West Bromwich\nAlbion'),(45,'West Ham United'),(46,'Wigan Athletic'),(47,'Wolverhampton\nWanderers');
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `username` varchar(120) NOT NULL,
  `password` varchar(120) NOT NULL,
  `email` varchar(45) NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `userID_UNIQUE` (`userID`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `password_UNIQUE` (`password`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'testname1','pass1','test@test.com'),(3,'testname2','pass2','test2@test.com'),(7,'testname3','pass3','test3@test.com'),(21,'test6','testpass6','testemail6'),(22,'test3','testpass3','testemail3'),(23,'tes33','testpas3s3','testema3il3'),(26,'testhashname','passwordhashtest','email6'),(27,'testhashname1','passwordhashtest1','email61'),(29,'testhashname3','passwordhashtest2','email63');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-26  2:48:25
