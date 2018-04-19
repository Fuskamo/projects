CREATE DATABASE  IF NOT EXISTS `petportal` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `petportal`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: ix.cs.uoregon.edu    Database: petportal
-- ------------------------------------------------------
-- Server version	5.7.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adoption`
--

DROP TABLE IF EXISTS `adoption`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `adoption` (
  `adoption_id` int(11) NOT NULL AUTO_INCREMENT,
  `pet_id` int(11) NOT NULL,
  `adoption_date` date DEFAULT NULL,
  `adoption_rehome_fee` double DEFAULT NULL,
  PRIMARY KEY (`adoption_id`,`pet_id`),
  KEY `fk_owner_has_adoption_pet1_idx` (`pet_id`),
  CONSTRAINT `fk_owner_has_adoption_pet1` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adoption`
--

LOCK TABLES `adoption` WRITE;
/*!40000 ALTER TABLE `adoption` DISABLE KEYS */;
INSERT INTO `adoption` VALUES (1,8,'2017-11-14',110),(2,13,'2017-11-15',110);
/*!40000 ALTER TABLE `adoption` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `atypical_treatment`
--

DROP TABLE IF EXISTS `atypical_treatment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `atypical_treatment` (
  `treatment_id` int(11) NOT NULL,
  `pet_id` int(11) NOT NULL,
  PRIMARY KEY (`treatment_id`,`pet_id`),
  KEY `fk_TREATMENT_has_PET_PET2_idx` (`pet_id`),
  KEY `fk_TREATMENT_has_PET_TREATMENT2_idx` (`treatment_id`),
  CONSTRAINT `fk_TREATMENT_has_PET_PET2` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_TREATMENT_has_PET_TREATMENT2` FOREIGN KEY (`treatment_id`) REFERENCES `treatment` (`treatment_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atypical_treatment`
--

LOCK TABLES `atypical_treatment` WRITE;
/*!40000 ALTER TABLE `atypical_treatment` DISABLE KEYS */;
INSERT INTO `atypical_treatment` VALUES (9,1),(12,1),(47,1),(9,2),(12,2),(44,2),(47,2),(13,3),(47,3),(13,4),(46,4),(13,5),(46,5),(47,6),(7,7),(12,7),(46,7),(46,8),(7,9),(12,9),(47,9),(7,10),(12,10),(47,10),(7,11),(12,11),(47,11),(7,12),(12,12),(46,12),(7,13),(12,13),(46,13),(47,14),(20,15),(46,15),(20,16),(47,16),(19,34),(47,34),(19,35),(46,35);
/*!40000 ALTER TABLE `atypical_treatment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam`
--

DROP TABLE IF EXISTS `exam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exam` (
  `exam_id` int(11) NOT NULL AUTO_INCREMENT,
  `exam_notes` varchar(100) NOT NULL,
  PRIMARY KEY (`exam_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam`
--

LOCK TABLES `exam` WRITE;
/*!40000 ALTER TABLE `exam` DISABLE KEYS */;
INSERT INTO `exam` VALUES (1,'Pre-neuter exam, cat healthy weight, no problems detected, FELV/FIV test negative'),(2,'Pre-spay exam, cat healthy weight, no problems detected, FELV/FIV test negative'),(3,'Pre-neuter exam, cat healthy weight, no problems detected'),(4,'Pre-spay exam, cat healthy weight, no problems detected'),(5,'Snap Combo: Neg/Neg; Dispense Erythromcyin'),(6,'Annual exam, dog healthy weight, no problems detected');
/*!40000 ALTER TABLE `exam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `home_treatment`
--

DROP TABLE IF EXISTS `home_treatment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `home_treatment` (
  `treatment_id` int(11) NOT NULL,
  `pet_id` int(11) NOT NULL,
  `treatment_date` date NOT NULL,
  PRIMARY KEY (`treatment_id`,`pet_id`,`treatment_date`),
  KEY `fk_TREATMENT_has_PET_PET1_idx` (`pet_id`),
  KEY `fk_TREATMENT_has_PET_TREATMENT1_idx` (`treatment_id`),
  CONSTRAINT `fk_TREATMENT_has_PET_PET1` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_TREATMENT_has_PET_TREATMENT1` FOREIGN KEY (`treatment_id`) REFERENCES `treatment` (`treatment_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `home_treatment`
--

LOCK TABLES `home_treatment` WRITE;
/*!40000 ALTER TABLE `home_treatment` DISABLE KEYS */;
INSERT INTO `home_treatment` VALUES (1,3,'2017-11-04'),(1,6,'2017-11-04'),(1,7,'2017-09-25'),(1,7,'2017-11-04'),(10,7,'2017-09-25'),(11,7,'2017-10-17'),(12,7,'2017-11-13'),(51,7,'2017-08-04'),(51,7,'2017-08-19'),(51,7,'2017-08-26'),(51,7,'2017-09-17'),(1,8,'2017-09-25'),(1,8,'2017-11-04'),(10,8,'2017-09-25'),(11,8,'2017-10-17'),(12,8,'2017-11-13'),(51,8,'2017-08-04'),(51,8,'2017-08-19'),(51,8,'2017-08-26'),(51,8,'2017-09-17'),(1,9,'2017-11-04'),(10,9,'2017-10-17'),(11,9,'2017-11-13'),(51,9,'2017-08-27'),(1,10,'2017-11-04'),(10,10,'2017-10-17'),(11,10,'2017-11-13'),(51,10,'2017-08-27'),(1,11,'2017-11-04'),(10,11,'2017-10-17'),(11,11,'2017-11-13'),(1,12,'2017-11-04'),(10,12,'2017-09-25'),(11,12,'2017-10-17'),(12,12,'2017-11-13'),(51,12,'2017-08-04'),(51,12,'2017-08-19'),(51,12,'2017-08-26'),(51,12,'2017-09-17'),(1,13,'2017-09-25'),(1,13,'2017-11-04'),(10,13,'2017-09-25'),(11,13,'2017-10-17'),(12,13,'2017-11-13'),(51,13,'2017-08-04'),(51,13,'2017-08-19'),(51,13,'2017-08-26'),(51,13,'2017-09-17');
/*!40000 ALTER TABLE `home_treatment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incident`
--

DROP TABLE IF EXISTS `incident`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `incident` (
  `incident_id` int(11) NOT NULL AUTO_INCREMENT,
  `incident_desc` varchar(100) NOT NULL,
  PRIMARY KEY (`incident_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incident`
--

LOCK TABLES `incident` WRITE;
/*!40000 ALTER TABLE `incident` DISABLE KEYS */;
INSERT INTO `incident` VALUES (1,'calici virus'),(2,'sore'),(3,'eye discharge'),(4,'broken nail'),(5,'ear mites');
/*!40000 ALTER TABLE `incident` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `microchip`
--

DROP TABLE IF EXISTS `microchip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `microchip` (
  `micro_id` int(11) NOT NULL,
  `micro_manu` varchar(45) DEFAULT NULL,
  `micro_number` bigint(20) NOT NULL,
  PRIMARY KEY (`micro_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `microchip`
--

LOCK TABLES `microchip` WRITE;
/*!40000 ALTER TABLE `microchip` DISABLE KEYS */;
INSERT INTO `microchip` VALUES (1,'Avis',103104065),(2,'Datamars',981020023266809),(3,'Datamars',981020023165928),(4,'Datamars',981020023192491),(5,'Datamars',981020023161410);
/*!40000 ALTER TABLE `microchip` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `owner`
--

DROP TABLE IF EXISTS `owner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `owner` (
  `owner_id` int(11) NOT NULL AUTO_INCREMENT,
  `owner_fname` varchar(45) DEFAULT NULL,
  `owner_lname` varchar(45) NOT NULL,
  `owner_phone` bigint(20) DEFAULT NULL,
  `owner_address` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`owner_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `owner`
--

LOCK TABLES `owner` WRITE;
/*!40000 ALTER TABLE `owner` DISABLE KEYS */;
INSERT INTO `owner` VALUES (1,'Megan','McKendrick',5417318296,'42 collin ct eugene OR 97404'),(2,'Laurie','Aird',5416902120,'42 collin ct eugene OR 97404'),(3,'David','Jensen',5095402669,'42 collin ct eugene OR 97404'),(4,'Rebecca','Studer',7342233609,'2555 Gateway St #56 Springfield OR 97477'),(5,'Liz','Trolan',5038840976,'5082 NE 8th Ave, Keizer, OR 97303');
/*!40000 ALTER TABLE `owner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pet`
--

DROP TABLE IF EXISTS `pet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pet` (
  `pet_id` int(11) NOT NULL AUTO_INCREMENT,
  `pet_name` varchar(45) NOT NULL,
  `type_id` int(11) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `pet_breed` varchar(45) NOT NULL,
  `pet_markings` varchar(45) DEFAULT NULL,
  `pet_color` varchar(45) NOT NULL,
  `pet_gender` varchar(10) NOT NULL,
  `pet_desexed` int(11) DEFAULT NULL,
  `pet_bday` date DEFAULT NULL,
  `micro_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`pet_id`),
  KEY `fk_PET_TYPE1_idx` (`type_id`),
  KEY `fk_PET_OWNER1_idx` (`owner_id`),
  KEY `fk_pet_microchip1_idx` (`micro_id`),
  CONSTRAINT `fk_PET_OWNER1` FOREIGN KEY (`owner_id`) REFERENCES `owner` (`owner_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_PET_TYPE1` FOREIGN KEY (`type_id`) REFERENCES `type` (`type_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_pet_microchip1` FOREIGN KEY (`micro_id`) REFERENCES `microchip` (`micro_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pet`
--

LOCK TABLES `pet` WRITE;
/*!40000 ALTER TABLE `pet` DISABLE KEYS */;
INSERT INTO `pet` VALUES (1,'Chloe',1,3,'DSH',NULL,'tortoishell','female',1,'2012-06-01',NULL),(2,'Kaylin',1,3,'DSH','white face','grey and white','female',1,'2013-07-05',NULL),(3,'Bruce',1,1,'DSH','striped','brown and black','female',1,'2003-07-01',NULL),(4,'Maximus',1,1,'DSH',NULL,'lynx point','male',1,'2006-06-01',2),(5,'Joseph',1,1,'DSH','white feet and chest','grey and white','male',1,'2006-04-01',1),(6,'Erin',1,2,'DMH','spotted','white and black','female',1,'2002-01-01',NULL),(7,'Nitro',1,1,'DSH','striped','grey','male',1,'2017-07-31',3),(8,'Nacho',1,4,'DSH','striped','grey','male',1,'2017-07-31',4),(9,'Clover',1,NULL,'DSH','calico','tortoishell','female',0,'2017-08-14',NULL),(10,'Daisy',1,3,'DSH','calico','tortoishell','female',0,'2017-08-14',NULL),(11,'Cordelia',1,2,'DSH','tiger striped with white','grey','female',0,'2017-08-14',NULL),(12,'Stanley',1,1,'DMH','tiger striped with white','brown and black','male',1,'2017-08-01',NULL),(13,'NotStan',1,5,'DMH','tiger striped with white','steele','male',1,'2017-07-31',NULL),(14,'Nidalee',1,NULL,'DMH','tiger striped with white','brown and black','female',1,'2013-01-01',5),(15,'Apollo',2,1,'Australian shep mix',NULL,'red','male',1,'2007-01-01',NULL),(16,'Piper',2,1,'Plott Hound mix',NULL,'brindle','female',1,'2012-01-01',NULL),(17,'Oedipus',4,1,'Gargoyle',NULL,'reticulated','female',0,'2011-01-01',NULL),(18,'Dante',4,1,'Gargoyle',NULL,'striped','female',0,'2011-06-01',NULL),(19,'Big Mama Cas',3,1,'Box Turtle','3 toed','brown','female',0,NULL,NULL),(20,'Yurtle',3,1,'Box Turtle','eastern','brown and yellow','female',0,NULL,NULL),(21,'Simon',3,1,'Box Turtle','3 toed','brown','male',0,NULL,NULL),(22,'Snausage',3,1,'Box Turtle','3 toed','brown','male',0,NULL,NULL),(23,'Quasi',3,1,'Box Turtle','eastern','brown and yellow','male',0,NULL,NULL),(24,'Lucy',3,1,'Box Turtle','eastern','brown and yellow','female',0,NULL,NULL),(25,'Tilly',3,1,'Box Turtle','ornate','brown and yellow','female',0,NULL,NULL),(26,'Adam',3,1,'Box Turtle','3 toed','brown','male',0,NULL,NULL),(27,'Ruby',6,1,'Tortoise','red foot','brown yellow and red','female',0,NULL,NULL),(28,'Austin',6,1,'Tortoise','russian','brown','male',0,NULL,NULL),(29,'Roger',5,1,'Holland Lop',NULL,'white and black','male',0,'2012-01-01',NULL),(30,'Peter',5,1,'Netherland Dwarf mix',NULL,'brown agoutti','male',0,NULL,NULL),(34,'Maggie',2,2,'Terrier Mix',NULL,'white black brown','female',1,NULL,NULL),(35,'Edward',2,2,'Dachshund Mix',NULL,'white and brown','male',1,NULL,NULL);
/*!40000 ALTER TABLE `pet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pet_incident`
--

DROP TABLE IF EXISTS `pet_incident`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pet_incident` (
  `pet_id` int(11) NOT NULL,
  `incident_id` int(11) NOT NULL,
  `incident_date` date NOT NULL,
  PRIMARY KEY (`pet_id`,`incident_id`),
  KEY `fk_PET_has_INCIDENT_INCIDENT1_idx` (`incident_id`),
  KEY `fk_PET_has_INCIDENT_PET1_idx` (`pet_id`),
  CONSTRAINT `fk_PET_has_INCIDENT_INCIDENT1` FOREIGN KEY (`incident_id`) REFERENCES `incident` (`incident_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_PET_has_INCIDENT_PET1` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pet_incident`
--

LOCK TABLES `pet_incident` WRITE;
/*!40000 ALTER TABLE `pet_incident` DISABLE KEYS */;
INSERT INTO `pet_incident` VALUES (7,1,'2017-10-17'),(8,1,'2017-10-17'),(9,1,'2017-10-17'),(9,5,'2017-09-09'),(10,1,'2017-10-17'),(10,5,'2017-09-09'),(11,1,'2017-10-17'),(11,3,'2017-10-09'),(12,1,'2017-10-17'),(13,1,'2017-10-17'),(14,1,'2017-10-17');
/*!40000 ALTER TABLE `pet_incident` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `practice`
--

DROP TABLE IF EXISTS `practice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `practice` (
  `practice_id` int(11) NOT NULL AUTO_INCREMENT,
  `practice_name` varchar(45) NOT NULL,
  `practice_location` varchar(45) NOT NULL,
  `practice_phone` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`practice_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `practice`
--

LOCK TABLES `practice` WRITE;
/*!40000 ALTER TABLE `practice` DISABLE KEYS */;
INSERT INTO `practice` VALUES (1,'Coburg Vet','Coburg',5413438795),(2,'Emergency Vet','Springfield',5417460112),(3,'Santa Clara Animal Hospital','Santa Clara',5418961932),(4,'Willamette Animal Guild','Highway 99',5413453566),(5,'Spay and Neuter Clinic','1st Street',5416823643),(6,'OVRA','B St Springfield',5417261100);
/*!40000 ALTER TABLE `practice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `req_treatment`
--

DROP TABLE IF EXISTS `req_treatment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `req_treatment` (
  `type_id` int(11) NOT NULL,
  `treatment_id` int(11) NOT NULL,
  PRIMARY KEY (`type_id`,`treatment_id`),
  KEY `fk_type_has_treatment_treatment1_idx` (`treatment_id`),
  KEY `fk_type_has_treatment_type1_idx` (`type_id`),
  CONSTRAINT `fk_type_has_treatment_treatment1` FOREIGN KEY (`treatment_id`) REFERENCES `treatment` (`treatment_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_type_has_treatment_type1` FOREIGN KEY (`type_id`) REFERENCES `type` (`type_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `req_treatment`
--

LOCK TABLES `req_treatment` WRITE;
/*!40000 ALTER TABLE `req_treatment` DISABLE KEYS */;
INSERT INTO `req_treatment` VALUES (1,7),(1,8),(1,9),(1,10),(1,11),(1,14),(1,15),(2,16),(2,17),(2,18),(2,21),(2,22),(2,23),(2,24),(2,25),(2,26),(2,27),(2,28),(2,29),(2,30);
/*!40000 ALTER TABLE `req_treatment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatment`
--

DROP TABLE IF EXISTS `treatment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `treatment` (
  `treatment_id` int(11) NOT NULL AUTO_INCREMENT,
  `treatment_desc` varchar(45) NOT NULL,
  `treatment_type` varchar(45) NOT NULL,
  `treatment_freq` int(11) NOT NULL,
  `followup_treatment_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`treatment_id`),
  KEY `fk_treatment_treatment1_idx` (`followup_treatment_id`),
  CONSTRAINT `fk_treatment_treatment1` FOREIGN KEY (`followup_treatment_id`) REFERENCES `treatment` (`treatment_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment`
--

LOCK TABLES `treatment` WRITE;
/*!40000 ALTER TABLE `treatment` DISABLE KEYS */;
INSERT INTO `treatment` VALUES (1,'Revolution','flea heartworm dewormer',30,1),(2,'Frontline','flea and tick',30,2),(3,'Advantage','flea',30,3),(4,'Nexgard','flea and tick',30,4),(5,'Drontal','dewormer',90,5),(6,'Profender','dewormer',90,6),(7,'FeLV Vaccine #1','vaccine booster',28,8),(8,'FeLV Vaccine #2','vaccine booster',365,9),(9,'FeLV Vaccine 1yr','vaccine',365,9),(10,'FVRCP Vaccine #1','vaccine booster',28,11),(11,'FVRCP Vaccine #2','vaccine booster',365,12),(12,'FVRCP Vaccine 1yr','vaccine',365,12),(13,'FVRCP Vaccine 3yr','vaccine',1095,13),(14,'Rabies (Feline) 1yr','vaccine',365,15),(15,'Rabies (Feline) 3yr','vaccine',1095,15),(16,'DAPP Vaccine #1','vaccine booster',28,17),(17,'DAPP Vaccine #2','vaccine booster',28,18),(18,'DAPP Vaccine #3','vaccine booster',365,19),(19,'DAPP Vaccine 1yr','vaccine',365,19),(20,'DAPP Vaccine 3yr','vaccine',1095,20),(21,'Bordatella oral','vaccine',365,21),(22,'Bordatella injectable','vaccine',365,NULL),(23,'Bordatella intranasal','vaccine',180,NULL),(24,'Lyme #1','vaccine booster',28,25),(25,'Lyme #2','vaccine booster',365,26),(26,'Lyme 1yr','vaccine',365,26),(27,'Lepto #1','vaccine booster',28,28),(28,'Lepto #2','vaccine booster',365,29),(29,'Lepto 1yr','vaccine',365,29),(30,'Rabies (Canine) 1yr','vaccine',365,NULL),(31,'Rabies (Canine) 3yr','vaccine',1095,NULL),(32,'Snap 4DX test','labwork',365,NULL),(33,'Snap Feline Triple test','labwork',365,NULL),(34,'Fecal test','labwork',365,NULL),(35,'Urinalysis','labwork',365,NULL),(36,'CBC','labwork',365,NULL),(37,'Chemistry','labwork',365,NULL),(38,'Thyroid','labwork',365,NULL),(39,'Erythromycin','eye ointment',0,NULL),(40,'Terramycin','eye ointment',0,NULL),(41,'Pyrantel','dewormer',28,NULL),(42,'Annual exam','exam',365,NULL),(43,'exam','exam',0,NULL),(44,'Sentry Calming Collar','behavioral',30,NULL),(45,'Thyroid Recheck','exam',30,NULL),(46,'Castration','neuter',0,NULL),(47,'Ovariohysterectomy','spay',0,NULL),(48,'FELV/FIV Test','labwork',0,NULL),(49,'Microchip Implant','microchip',0,NULL),(50,'Comfortis','flea',30,50),(51,'Pyrantel','dewormer',14,51);
/*!40000 ALTER TABLE `treatment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type`
--

DROP TABLE IF EXISTS `type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `type` (
  `type_id` int(11) NOT NULL AUTO_INCREMENT,
  `type_animal` varchar(20) DEFAULT NULL,
  `type_class` varchar(20) DEFAULT NULL,
  `type_care` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type`
--

LOCK TABLES `type` WRITE;
/*!40000 ALTER TABLE `type` DISABLE KEYS */;
INSERT INTO `type` VALUES (1,'Feline','mammal','yearly vaccines and exam daily food and H2O'),(2,'Canine','mammal','yearly vaccines and exam daily food and H2O'),(3,'Turtle','reptile','UVB bulb every 6 months  food EOD'),(4,'Gecko','reptile','Mist weekly crickets weekly  paste weekly'),(5,'Rabbit','mammal','feed and water daily hay weekly'),(6,'Tortoise','reptile','UVB bulb every 6 months food EOD');
/*!40000 ALTER TABLE `type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vet`
--

DROP TABLE IF EXISTS `vet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vet` (
  `vet_id` int(11) NOT NULL AUTO_INCREMENT,
  `vet_fname` varchar(45) DEFAULT NULL,
  `vet_lname` varchar(45) NOT NULL,
  `practice_id` int(11) NOT NULL,
  PRIMARY KEY (`vet_id`),
  KEY `fk_VET_PRACTICE_idx` (`practice_id`),
  CONSTRAINT `fk_VET_PRACTICE` FOREIGN KEY (`practice_id`) REFERENCES `practice` (`practice_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vet`
--

LOCK TABLES `vet` WRITE;
/*!40000 ALTER TABLE `vet` DISABLE KEYS */;
INSERT INTO `vet` VALUES (1,'Michele','Nugent',1),(2,'Sara','Maxwell',6),(3,'Sean','Berrett',3),(4,'Cary','Berrett',3),(5,'Unknown','Unknown',4),(6,'Unknown','Unknown',2),(7,'Unknown','Unknown',5);
/*!40000 ALTER TABLE `vet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vet_treatment`
--

DROP TABLE IF EXISTS `vet_treatment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vet_treatment` (
  `visit_id` int(11) NOT NULL,
  `treatment_id` int(11) NOT NULL,
  `treatment_cost` double NOT NULL,
  PRIMARY KEY (`visit_id`,`treatment_id`),
  KEY `fk_TRANSACTION_TREATMENT1_idx` (`treatment_id`),
  CONSTRAINT `fk_TRANSACTION_TREATMENT1` FOREIGN KEY (`treatment_id`) REFERENCES `treatment` (`treatment_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vet_treatment`
--

LOCK TABLES `vet_treatment` WRITE;
/*!40000 ALTER TABLE `vet_treatment` DISABLE KEYS */;
INSERT INTO `vet_treatment` VALUES (1,46,50),(1,48,25),(1,49,35),(2,14,18),(2,47,65),(2,48,35),(2,50,21),(3,46,50),(3,48,25),(3,49,35),(4,46,50),(4,49,35),(5,33,73),(6,47,65),(6,49,35),(7,47,65),(7,49,35),(8,47,65),(8,49,35),(9,46,50),(9,48,25),(9,49,35),(10,21,0),(11,21,0),(12,16,0),(13,31,0),(14,16,0),(15,31,0);
/*!40000 ALTER TABLE `vet_treatment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vet_visit`
--

DROP TABLE IF EXISTS `vet_visit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vet_visit` (
  `visit_id` int(11) NOT NULL,
  `pet_id` int(11) NOT NULL,
  `vet_id` int(11) NOT NULL,
  `weight_id` int(11) NOT NULL,
  `exam_id` int(11) DEFAULT NULL,
  `visit_date` date NOT NULL,
  `visit_total` double NOT NULL,
  `pet_temp` double DEFAULT NULL,
  `pet_pulse` int(11) DEFAULT NULL,
  `pet_respiration` int(11) DEFAULT NULL,
  PRIMARY KEY (`visit_id`,`pet_id`,`vet_id`),
  KEY `fk_PET_has_VET_PET1_idx` (`pet_id`),
  KEY `fk_PET_has_VET_TRANSACTION1_idx` (`visit_id`),
  KEY `fk_VET_VISIT_EXAM1_idx` (`exam_id`),
  KEY `fk_VET_VISIT_VET1_idx` (`vet_id`),
  KEY `fk_VET_VISIT_WEIGHT1_idx` (`weight_id`),
  CONSTRAINT `fk_PET_has_VET_PET1` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_PET_has_VET_TRANSACTION1` FOREIGN KEY (`visit_id`) REFERENCES `vet_treatment` (`visit_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_VET_VISIT_EXAM1` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`exam_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_VET_VISIT_VET1` FOREIGN KEY (`vet_id`) REFERENCES `vet` (`vet_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_VET_VISIT_WEIGHT1` FOREIGN KEY (`weight_id`) REFERENCES `weight` (`weight_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vet_visit`
--

LOCK TABLES `vet_visit` WRITE;
/*!40000 ALTER TABLE `vet_visit` DISABLE KEYS */;
INSERT INTO `vet_visit` VALUES (1,8,7,10,1,'2017-10-02',110,NULL,NULL,NULL),(2,14,7,9,4,'2017-10-02',139,NULL,NULL,NULL),(3,7,7,8,1,'2017-10-02',110,NULL,NULL,NULL),(4,13,7,26,3,'2017-10-03',85,NULL,NULL,NULL),(5,11,1,49,5,'2017-09-25',138,NULL,NULL,NULL),(6,9,7,50,4,'2017-11-22',65,NULL,NULL,NULL),(7,10,7,51,4,'2017-11-22',65,NULL,NULL,NULL),(8,11,7,52,4,'2017-11-22',100,NULL,NULL,NULL),(9,12,7,53,1,'2017-11-22',80,NULL,NULL,NULL),(10,35,1,55,6,'2016-09-14',0,NULL,NULL,NULL),(11,34,1,51,6,'2016-09-14',0,NULL,NULL,NULL),(12,35,1,55,6,'2016-10-18',0,NULL,NULL,NULL),(13,35,1,55,6,'2016-11-22',0,NULL,NULL,NULL),(14,34,1,54,6,'2016-10-18',0,NULL,NULL,NULL),(15,34,1,54,6,'2016-11-22',0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `vet_visit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weight`
--

DROP TABLE IF EXISTS `weight`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `weight` (
  `weight_id` int(11) NOT NULL AUTO_INCREMENT,
  `pet_id` int(11) NOT NULL,
  `weight_date` date NOT NULL,
  `weight_amt` double NOT NULL,
  PRIMARY KEY (`weight_id`),
  KEY `fk_WEIGHT_PET1_idx` (`pet_id`),
  CONSTRAINT `fk_WEIGHT_PET1` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weight`
--

LOCK TABLES `weight` WRITE;
/*!40000 ALTER TABLE `weight` DISABLE KEYS */;
INSERT INTO `weight` VALUES (1,7,'2017-08-14',0.59),(2,7,'2017-08-21',0.75),(3,7,'2017-09-03',1.26),(4,7,'2017-09-10',1.59),(5,7,'2017-09-17',1.94),(6,7,'2017-09-24',2.25),(8,7,'2017-10-02',2.69),(9,8,'2017-10-02',2.41),(10,14,'2017-10-02',7.6),(11,8,'2017-08-14',0.63),(12,8,'2017-08-21',0.78),(13,8,'2017-09-03',1.14),(14,8,'2017-09-10',1.48),(15,8,'2017-09-17',1.81),(16,8,'2017-09-24',2.08),(17,8,'2017-10-01',2.42),(18,8,'2017-08-27',0.9),(19,13,'2017-08-14',0.6),(20,13,'2017-08-21',0.74),(21,13,'2017-08-27',0.88),(22,13,'2017-09-03',1.13),(23,13,'2017-09-10',1.51),(24,13,'2017-09-17',1.79),(25,13,'2017-09-24',2.11),(26,13,'2017-10-02',2.4),(27,12,'2017-08-14',0.54),(28,12,'2017-08-21',0.68),(29,12,'2017-08-27',0.88),(30,12,'2017-09-03',0.99),(31,12,'2017-09-10',1.22),(32,12,'2017-09-17',1.39),(33,12,'2017-09-24',1.67),(34,12,'2017-10-01',1.89),(35,11,'2017-09-29',1.1),(36,11,'2017-10-05',1.35),(37,10,'2017-08-27',0.55),(38,10,'2017-09-03',0.76),(39,10,'2017-09-10',0.89),(40,10,'2017-09-17',1.17),(41,10,'2017-09-24',1.4),(42,10,'2017-10-01',1.64),(43,9,'2017-08-27',0.56),(44,9,'2017-09-03',0.77),(45,9,'2017-09-10',0.96),(46,9,'2017-09-17',1.24),(47,9,'2017-09-24',1.5),(48,9,'2017-10-01',1.65),(49,11,'2017-09-25',0.75),(50,9,'2017-11-22',3.5),(51,10,'2017-11-22',3.5),(52,11,'2017-11-22',3.5),(53,12,'2017-11-22',3.89),(54,35,'2017-09-14',4),(55,34,'2017-09-14',4);
/*!40000 ALTER TABLE `weight` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-12-08 10:43:50
