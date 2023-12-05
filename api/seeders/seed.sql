-- Adminer 4.8.1 MySQL 8.1.0 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

INSERT INTO `items` (`id`, `name`, `category`, `unit_price`, `stack_price`, `stack_size`, `created_at`, `updated_at`) VALUES
(1,	'Earth Crystal',	'Crystals',	200,	800,	12,	'2023-11-26 19:44:13',	'2023-11-26 19:44:13'),
(2,	'Wind Crystal',	'Crystals',	300,	1200,	12,	'2023-11-26 19:44:13',	'2023-11-26 19:44:13'),
(3,	'Ice Crystal',	'Crystals',	300,	3000,	12,	'2023-11-26 19:44:13',	'2023-11-26 19:44:13'),
(4,	'Fire Crystal',	'Crystals',	200,	1000,	12,	'2023-11-26 19:44:13',	'2023-11-26 19:44:13'),
(5,	'Water Crystal',	'Crystals',	100,	400,	12,	'2023-11-26 19:44:13',	'2023-11-26 19:44:13'),
(6,	'Lightning Crystal',	'Crystals',	250,	1100,	12,	'2023-11-26 19:44:13',	'2023-11-26 19:44:13'),
(7,	'Light Crystal',	'Crystals',	400,	4000,	12,	'2023-11-26 19:44:13',	'2023-11-26 19:44:13'),
(8,	'Dark Crystal',	'Crystals',	400,	4800,	12,	'2023-11-26 19:44:13',	'2023-11-30 19:17:21'),
(9,	'Sheepskin',	'Materials.Leathercraft',	300,	4500,	12,	'2023-11-26 19:44:13',	'2023-11-29 19:26:22'),
(10,	'Sheep Leather',	'Materials.Leathercraft',	1000,	11500,	12,	'2023-11-26 19:44:13',	'2023-12-05 08:11:28'),
(11,	'Mythril Ingot',	'Materials.Goldsmithing',	6000,	57000,	12,	'2023-11-26 19:44:13',	'2023-12-02 03:39:59'),
(12,	'Mythril Ore',	'Materials.Goldsmithing',	900,	13000,	12,	'2023-11-26 19:44:13',	'2023-11-30 19:01:18'),
(13,	'Tsurara',	'Others.Ninja Tools',	1,	2000,	99,	'2023-11-26 19:44:13',	'2023-11-26 19:44:13'),
(14,	'Distilled Water',	'Food.Ingredients',	10,	300,	12,	'2023-11-26 19:44:13',	'2023-11-26 19:44:13'),
(15,	'Rock Salt',	'Materials.Alchemy',	14,	400,	12,	'2023-11-26 19:44:13',	'2023-11-26 19:44:13'),
(16,	'Moblinweave',	'Materials.Clothcraft',	12000,	25000,	12,	'2023-11-26 19:44:13',	'2023-12-05 08:00:29'),
(17,	'Moblin Thread',	'Materials.Clothcraft',	2000,	27000,	12,	'2023-11-26 19:44:13',	'2023-12-05 08:00:40'),
(18,	'Fisherman\'s Boots',	'Armor.Feet',	5000,	NULL,	1,	'2023-11-26 19:44:13',	'2023-12-05 07:57:03'),
(19,	'Lizard Skin',	'Materials.Leathercraft',	100,	1900,	12,	'2023-11-26 19:44:13',	'2023-12-05 08:11:51'),
(20,	'Grass Cloth',	'Materials.Clothcraft',	300,	4000,	12,	'2023-11-26 19:44:13',	'2023-11-26 19:44:13'),
(21,	'Bronze Scales',	'Materials.Smithing',	100,	500,	12,	'2023-11-26 19:44:13',	'2023-11-26 19:44:13'),
(31,	'Gold Thread',	'Materials.Clothcraft',	6000,	75000,	12,	'2023-11-28 22:58:53',	'2023-12-05 08:00:09'),
(32,	'Gold Ingot',	'Materials.Goldsmithing',	11500,	133000,	12,	'2023-11-28 22:59:10',	'2023-12-05 07:58:40'),
(33,	'Silk Thread',	'Materials.Clothcraft',	800,	10000,	12,	'2023-11-28 22:59:47',	'2023-11-29 19:08:50'),
(34,	'Linen Thread',	'Materials.Clothcraft',	1500,	11000,	12,	'2023-11-28 23:03:55',	'2023-11-29 19:07:28'),
(35,	'Linen Cloth',	'Materials.Clothcraft',	3500,	24500,	12,	'2023-11-28 23:04:10',	'2023-12-05 08:00:20'),
(36,	'Cotton Cloth',	'Materials.Clothcraft',	500,	6700,	12,	'2023-11-28 23:04:27',	'2023-12-05 08:12:29'),
(37,	'Cotton Thread',	'Materials.Clothcraft',	800,	4800,	12,	'2023-11-28 23:04:51',	'2023-11-29 19:06:19'),
(38,	'Fisherman\'s Tunica',	'Armor.Body',	11500,	NULL,	1,	'2023-11-28 23:05:08',	'2023-12-05 07:52:36'),
(39,	'Fisherman\'s Hose',	'Armor.Legs',	12000,	NULL,	1,	'2023-11-28 23:06:29',	'2023-12-05 07:56:17'),
(40,	'Mythril Beastcoin',	'Others.Beast-made',	1000,	11500,	12,	'2023-11-29 05:46:17',	'2023-12-05 07:59:49'),
(41,	'Rhodonite',	'Materials.Goldsmithing',	5200,	0,	12,	'2023-11-29 05:47:48',	'2023-12-05 07:59:05'),
(42,	'Scarlet Stone',	'Materials.Goldsmithing',	3200,	70000,	12,	'2023-11-29 05:48:25',	'2023-12-05 07:59:18'),
(43,	'Silk Cloth',	'Materials.Clothcraft',	4000,	41000,	12,	'2023-11-29 19:08:36',	'2023-11-29 19:08:36'),
(44,	'Silver Thread',	'Materials.Clothcraft',	1800,	13000,	12,	'2023-11-29 19:09:18',	'2023-11-29 19:09:18'),
(45,	'Velvet Cloth',	'Materials.Clothcraft',	2800,	50000,	12,	'2023-11-29 19:09:42',	'2023-11-29 19:10:18'),
(46,	'Wool Cloth',	'Materials.Clothcraft',	4000,	40500,	12,	'2023-11-29 19:10:13',	'2023-12-05 08:12:17'),
(47,	'Wool Thread',	'Materials.Clothcraft',	1500,	10000,	12,	'2023-11-29 19:10:45',	'2023-12-05 08:01:13'),
(48,	'Buffalo Hide',	'Materials.Leathercraft',	13000,	160000,	12,	'2023-11-29 19:12:21',	'2023-11-29 19:12:21'),
(49,	'Buffalo Leather',	'Materials.Leathercraft',	17000,	190000,	12,	'2023-11-29 19:13:01',	'2023-12-05 07:51:22'),
(50,	'Bugard Leather',	'Materials.Leathercraft',	1000,	5000,	12,	'2023-11-29 19:19:27',	'2023-11-29 19:19:27'),
(51,	'Bugard Skin',	'Materials.Leathercraft',	500,	5000,	12,	'2023-11-29 19:19:57',	'2023-11-29 19:19:57'),
(53,	'Dhalmel Hide',	'Materials.Leathercraft',	500,	7000,	12,	'2023-11-29 19:23:23',	'2023-11-29 19:23:23'),
(54,	'Dhalmel Leather',	'Materials.Leathercraft',	2000,	13000,	12,	'2023-11-29 19:23:44',	'2023-12-05 08:11:35'),
(55,	'Ram Leather',	'Materials.Leathercraft',	1600,	14500,	12,	'2023-11-29 19:25:13',	'2023-12-05 08:12:02'),
(56,	'Ram Skin',	'Materials.Leathercraft',	500,	6600,	12,	'2023-11-29 19:25:35',	'2023-11-29 19:25:42'),
(57,	'Tiger Hide',	'Materials.Leathercraft',	450,	8000,	12,	'2023-11-29 19:27:30',	'2023-11-29 19:27:30'),
(58,	'Tiger Leather',	'Materials.Leathercraft',	1400,	10500,	12,	'2023-11-29 19:27:46',	'2023-11-29 19:27:46'),
(59,	'Seer\'s Crown',	'Armor.Head',	2000,	NULL,	1,	'2023-11-29 19:29:23',	'2023-11-29 19:29:27'),
(60,	'Noct Beret',	'Armor.Head',	4000,	NULL,	1,	'2023-11-29 19:31:58',	'2023-11-29 19:32:04'),
(61,	'Field Tunica',	'Armor.Body',	15000,	NULL,	1,	'2023-11-29 19:32:49',	'2023-12-05 07:52:52'),
(62,	'Chocobo Jack Coat',	'Armor.Body',	11000,	NULL,	1,	'2023-11-29 19:33:00',	'2023-12-05 07:52:23'),
(63,	'Seer\'s Tunic',	'Armor.Body',	8000,	NULL,	1,	'2023-11-29 19:33:41',	'2023-12-05 07:53:07'),
(64,	'Velvet Robe',	'Armor.Body',	24000,	NULL,	1,	'2023-11-29 19:34:07',	'2023-11-29 19:34:13'),
(65,	'Gambison',	'Armor.Body',	10000,	NULL,	1,	'2023-11-29 19:34:26',	'2023-11-29 19:34:31'),
(66,	'Field Gloves',	'Armor.Hands',	8000,	NULL,	1,	'2023-11-29 19:36:24',	'2023-12-05 07:55:35'),
(67,	'Chocobo Gloves',	'Armor.Hands',	4000,	NULL,	1,	'2023-11-29 19:36:41',	'2023-12-05 07:55:42'),
(68,	'Fisherman\'s Gloves',	'Armor.Hands',	2500,	NULL,	1,	'2023-11-29 19:36:57',	'2023-12-05 07:55:48'),
(69,	'Seer\'s Mitts',	'Armor.Hands',	3000,	NULL,	1,	'2023-11-29 19:37:24',	'2023-11-29 19:37:29'),
(70,	'Noct Gloves',	'Armor.Hands',	3000,	NULL,	1,	'2023-11-29 19:37:43',	'2023-11-29 19:37:48'),
(71,	'Magic Belt',	'Armor.Waist',	5000,	NULL,	1,	'2023-11-29 19:38:30',	'2023-11-29 19:38:36'),
(72,	'Field Hose',	'Armor.Legs',	11000,	NULL,	1,	'2023-11-29 19:38:50',	'2023-11-29 19:38:56'),
(73,	'Chocobo Hose',	'Armor.Legs',	10000,	NULL,	1,	'2023-11-29 19:39:13',	'2023-11-29 19:39:29'),
(74,	'Seer\'s Slacks',	'Armor.Legs',	9000,	NULL,	1,	'2023-11-29 19:40:41',	'2023-12-05 07:56:33'),
(75,	'Noct Brais',	'Armor.Legs',	2000,	NULL,	1,	'2023-11-29 19:40:57',	'2023-11-29 19:41:03'),
(76,	'Field Boots',	'Armor.Feet',	6000,	NULL,	1,	'2023-11-29 20:07:44',	'2023-12-05 07:56:51'),
(77,	'Chocobo Boots',	'Armor.Feet',	5000,	NULL,	1,	'2023-11-29 20:08:01',	'2023-12-05 07:56:57'),
(78,	'Seer\'s Pumps',	'Armor.Feet',	4000,	NULL,	1,	'2023-11-29 20:08:45',	'2023-11-29 20:08:45'),
(79,	'Noct Gaiters',	'Armor.Feet',	4000,	NULL,	1,	'2023-11-29 20:08:59',	'2023-11-29 20:09:03'),
(80,	'Cuir Highboots',	'Armor.Feet',	7000,	NULL,	1,	'2023-11-29 20:09:22',	'2023-12-02 03:36:08'),
(81,	'Brass Scales',	'Materials.Goldsmithing',	300,	2000,	12,	'2023-11-29 20:31:10',	'2023-11-30 17:48:25'),
(82,	'Beeswax',	'Materials.Alchemy',	1500,	16000,	12,	'2023-11-29 20:43:07',	'2023-12-05 08:28:48'),
(83,	'Leather Highboots',	'Armor.Feet',	500,	NULL,	1,	'2023-11-29 20:43:50',	'2023-12-05 07:57:21'),
(84,	'Saruta Cotton',	'Materials.Clothcraft',	200,	1500,	12,	'2023-11-29 20:47:05',	'2023-11-30 17:45:11'),
(85,	'Chocobo Feather',	'Materials.Clothcraft',	500,	500,	12,	'2023-11-29 20:49:53',	'2023-11-30 17:43:05'),
(86,	'Silver Ore',	'Materials.Goldsmithing',	400,	5000,	12,	'2023-11-29 20:54:19',	'2023-11-30 17:47:17'),
(87,	'Silver Ingot',	'Materials.Goldsmithing',	0,	0,	12,	'2023-11-29 20:54:34',	'2023-11-29 20:54:34'),
(88,	'Windurstian Tea Leaves',	'Food.Ingredients',	400,	500,	12,	'2023-11-29 20:59:33',	'2023-11-30 17:47:57'),
(89,	'Noct Doublet',	'Armor.Body',	4000,	NULL,	1,	'2023-11-30 17:43:28',	'2023-11-30 17:43:33');

INSERT INTO `synthesis` (`id`, `item_id`, `crystal_item_id`, `craft`, `craft_level`, `created_at`, `updated_at`, `yield`, `unit_profit`, `stack_profit`) VALUES
(1,	10,	8,	'Leathercraft',	2,	'2023-11-26 19:44:13',	'2023-12-05 08:11:28',	1,	158,	1400),
(2,	11,	4,	'Goldsmithing',	40,	'2023-11-26 19:44:13',	'2023-12-02 03:39:59',	1,	1583,	4000),
(3,	13,	3,	'Alchemy',	6,	'2023-11-26 19:44:13',	'2023-11-28 03:07:44',	10,	-32,	-1300),
(4,	16,	1,	'Clothcraft',	23,	'2023-11-26 19:44:13',	'2023-12-05 08:00:40',	1,	5183,	-56800),
(5,	18,	1,	'Leathercraft',	20,	'2023-11-26 19:44:13',	'2023-12-05 08:11:51',	1,	4242,	NULL),
(7,	31,	1,	'Clothcraft',	58,	'2023-11-28 23:00:35',	'2023-12-05 08:00:09',	2,	8,	3100),
(8,	38,	1,	'Clothcraft',	30,	'2023-11-28 23:05:50',	'2023-12-05 08:12:29',	1,	5842,	NULL),
(9,	39,	1,	'Clothcraft',	23,	'2023-11-28 23:07:05',	'2023-12-05 08:12:29',	1,	6892,	NULL),
(10,	11,	4,	'Goldsmithing',	38,	'2023-11-29 05:46:57',	'2023-12-05 07:59:49',	1,	2083,	10000),
(11,	41,	2,	'Goldsmithing',	20,	'2023-11-29 05:48:58',	'2023-12-05 07:59:15',	1,	-733,	-71200),
(12,	61,	1,	'Clothcraft',	69,	'2023-11-29 20:27:15',	'2023-12-05 08:12:17',	1,	3142,	NULL),
(13,	62,	1,	'Leathercraft',	45,	'2023-11-29 20:28:16',	'2023-12-05 08:12:17',	1,	1308,	NULL),
(14,	63,	1,	'Clothcraft',	26,	'2023-11-29 20:29:52',	'2023-12-05 08:12:29',	1,	383,	NULL),
(15,	64,	1,	'Clothcraft',	58,	'2023-11-29 20:32:20',	'2023-12-05 08:12:17',	1,	7600,	NULL),
(16,	72,	1,	'Clothcraft',	60,	'2023-11-29 20:37:09',	'2023-12-05 08:12:17',	1,	1308,	NULL),
(17,	73,	1,	'Clothcraft',	50,	'2023-11-29 20:37:54',	'2023-12-05 08:12:17',	1,	2642,	NULL),
(18,	74,	1,	'Clothcraft',	25,	'2023-11-29 20:38:41',	'2023-12-05 08:12:29',	1,	3983,	NULL),
(19,	75,	1,	'Leathercraft',	28,	'2023-11-29 20:39:40',	'2023-12-05 08:11:28',	1,	-4025,	NULL),
(20,	76,	1,	'Leathercraft',	40,	'2023-11-29 20:40:22',	'2023-12-05 08:12:02',	1,	3142,	NULL),
(21,	77,	1,	'Leathercraft',	40,	'2023-11-29 20:41:24',	'2023-12-05 08:12:02',	1,	2142,	NULL),
(22,	78,	1,	'Leathercraft',	25,	'2023-11-29 20:42:03',	'2023-12-05 08:12:29',	1,	192,	NULL),
(23,	79,	1,	'Clothcraft',	27,	'2023-11-29 20:42:40',	'2023-12-05 08:11:28',	1,	-4108,	NULL),
(24,	80,	5,	'Leathercraft',	42,	'2023-11-29 20:44:31',	'2023-12-05 08:28:48',	1,	2717,	NULL),
(25,	66,	1,	'Leathercraft',	33,	'2023-11-29 20:45:10',	'2023-12-05 08:12:29',	1,	5083,	NULL),
(26,	67,	1,	'Leathercraft',	23,	'2023-11-29 20:45:51',	'2023-12-05 08:12:29',	1,	2133,	NULL),
(27,	68,	1,	'Leathercraft',	14,	'2023-11-29 20:46:28',	'2023-12-05 08:12:29',	1,	1558,	NULL),
(28,	69,	1,	'Clothcraft',	24,	'2023-11-29 20:47:43',	'2023-12-05 08:12:29',	1,	-100,	NULL),
(29,	70,	1,	'Clothcraft',	25,	'2023-11-29 20:48:21',	'2023-12-05 08:11:28',	1,	-3275,	NULL),
(30,	60,	1,	'Clothcraft',	24,	'2023-11-29 20:50:33',	'2023-12-05 08:11:28',	1,	-67,	NULL),
(31,	43,	1,	'Clothcraft',	53,	'2023-11-29 20:51:53',	'2023-11-29 20:51:53',	1,	1433,	10200),
(32,	35,	1,	'Clothcraft',	22,	'2023-11-29 20:53:24',	'2023-12-05 08:00:20',	1,	683,	-9300),
(33,	36,	1,	'Clothcraft',	12,	'2023-11-29 20:53:47',	'2023-12-05 08:12:29',	1,	-767,	-8500),
(34,	87,	4,	'Goldsmithing',	20,	'2023-11-29 20:55:01',	'2023-11-30 17:47:12',	1,	-1750,	-21000),
(35,	44,	1,	'Clothcraft',	47,	'2023-11-29 20:56:52',	'2023-11-29 20:56:52',	2,	1350,	7600),
(36,	45,	1,	'Clothcraft',	45,	'2023-11-29 20:57:55',	'2023-12-05 08:01:13',	1,	233,	19200),
(37,	46,	1,	'Clothcraft',	37,	'2023-11-29 20:58:23',	'2023-12-05 08:12:17',	1,	1433,	9700),
(38,	49,	8,	'Leathercraft',	49,	'2023-11-29 21:00:57',	'2023-12-05 07:51:22',	1,	3200,	24400),
(39,	50,	8,	'Leathercraft',	24,	'2023-11-29 21:01:59',	'2023-11-30 19:16:49',	1,	117,	-5600),
(40,	54,	8,	'Leathercraft',	21,	'2023-11-29 21:02:33',	'2023-12-05 08:11:35',	1,	950,	400),
(41,	55,	8,	'Leathercraft',	35,	'2023-11-29 21:03:23',	'2023-12-05 08:12:02',	1,	583,	2300),
(42,	58,	8,	'Leathercraft',	61,	'2023-11-29 21:04:22',	'2023-11-30 19:16:49',	1,	267,	-3100),
(43,	89,	1,	'Clothcraft',	26,	'2023-11-30 17:44:36',	'2023-12-05 08:11:28',	1,	-4442,	NULL),
(44,	65,	1,	'Clothcraft',	29,	'2023-11-30 17:46:26',	'2023-12-05 08:00:20',	1,	433,	NULL);

INSERT INTO `synthesis_ingredients` (`id`, `synthesis_id`, `item_id`, `quantity`, `created_at`, `updated_at`) VALUES
(2,	2,	12,	4,	'2023-11-26 19:44:13',	'2023-11-26 19:44:13'),
(3,	3,	14,	2,	'2023-11-26 19:44:13',	'2023-11-26 19:44:13'),
(4,	3,	15,	1,	'2023-11-26 19:44:13',	'2023-11-26 19:44:13'),
(5,	4,	17,	3,	'2023-11-26 19:44:13',	'2023-11-26 19:44:13'),
(6,	5,	19,	2,	'2023-11-26 19:44:13',	'2023-11-26 19:44:13'),
(7,	5,	20,	1,	'2023-11-26 19:44:13',	'2023-11-26 19:44:13'),
(8,	5,	21,	1,	'2023-11-26 19:44:13',	'2023-11-26 19:44:13'),
(11,	7,	33,	1,	'2023-11-28 23:00:35',	'2023-11-28 23:00:35'),
(12,	7,	32,	1,	'2023-11-28 23:00:35',	'2023-11-28 23:00:35'),
(13,	8,	34,	1,	'2023-11-28 23:05:50',	'2023-11-28 23:05:50'),
(14,	8,	35,	1,	'2023-11-28 23:05:50',	'2023-11-28 23:05:50'),
(15,	8,	10,	1,	'2023-11-28 23:05:50',	'2023-11-28 23:05:50'),
(16,	8,	36,	3,	'2023-11-28 23:05:50',	'2023-11-28 23:05:50'),
(17,	9,	35,	2,	'2023-11-28 23:07:05',	'2023-11-28 23:07:05'),
(18,	9,	37,	1,	'2023-11-28 23:07:05',	'2023-11-28 23:07:05'),
(19,	9,	36,	1,	'2023-11-28 23:07:05',	'2023-11-28 23:07:05'),
(20,	10,	40,	4,	'2023-11-29 05:46:57',	'2023-11-29 05:46:57'),
(21,	11,	42,	1,	'2023-11-29 05:48:58',	'2023-11-29 05:48:58'),
(22,	12,	47,	1,	'2023-11-29 20:27:15',	'2023-11-29 20:27:15'),
(23,	12,	46,	2,	'2023-11-29 20:27:15',	'2023-11-29 20:27:15'),
(24,	12,	35,	1,	'2023-11-29 20:27:15',	'2023-11-29 20:27:15'),
(25,	12,	10,	1,	'2023-11-29 20:27:15',	'2023-11-29 20:27:15'),
(26,	12,	55,	1,	'2023-11-29 20:27:15',	'2023-11-29 20:27:15'),
(27,	13,	35,	1,	'2023-11-29 20:28:16',	'2023-11-29 20:28:16'),
(28,	13,	10,	1,	'2023-11-29 20:28:16',	'2023-11-29 20:28:16'),
(29,	13,	47,	1,	'2023-11-29 20:28:16',	'2023-11-29 20:28:16'),
(30,	13,	46,	1,	'2023-11-29 20:28:16',	'2023-11-29 20:28:16'),
(31,	13,	55,	2,	'2023-11-29 20:28:16',	'2023-11-29 20:28:16'),
(32,	14,	47,	1,	'2023-11-29 20:29:52',	'2023-11-29 20:29:52'),
(33,	14,	36,	3,	'2023-11-29 20:29:52',	'2023-11-29 20:29:52'),
(34,	14,	35,	2,	'2023-11-29 20:29:52',	'2023-11-29 20:29:52'),
(35,	14,	10,	1,	'2023-11-29 20:29:52',	'2023-11-29 20:29:52'),
(36,	15,	45,	2,	'2023-11-29 20:32:20',	'2023-11-29 20:32:20'),
(37,	15,	81,	1,	'2023-11-29 20:32:20',	'2023-11-29 20:32:20'),
(38,	15,	44,	1,	'2023-11-29 20:32:20',	'2023-11-29 20:32:20'),
(39,	15,	46,	2,	'2023-11-29 20:32:20',	'2023-11-29 20:32:20'),
(40,	16,	35,	1,	'2023-11-29 20:37:09',	'2023-11-29 20:37:09'),
(41,	16,	47,	1,	'2023-11-29 20:37:09',	'2023-11-29 20:37:09'),
(42,	16,	46,	2,	'2023-11-29 20:37:09',	'2023-11-29 20:37:09'),
(43,	17,	34,	1,	'2023-11-29 20:37:54',	'2023-11-29 20:37:54'),
(44,	17,	35,	1,	'2023-11-29 20:37:54',	'2023-11-29 20:37:54'),
(45,	17,	10,	1,	'2023-11-29 20:37:54',	'2023-11-29 20:37:54'),
(46,	17,	46,	1,	'2023-11-29 20:37:54',	'2023-11-29 20:37:54'),
(47,	18,	47,	1,	'2023-11-29 20:38:41',	'2023-11-29 20:38:41'),
(48,	18,	36,	2,	'2023-11-29 20:38:41',	'2023-11-29 20:38:41'),
(49,	18,	35,	1,	'2023-11-29 20:38:41',	'2023-11-29 20:38:41'),
(50,	18,	10,	1,	'2023-11-29 20:38:41',	'2023-11-29 20:38:41'),
(51,	19,	34,	1,	'2023-11-29 20:39:40',	'2023-11-29 20:39:40'),
(52,	19,	35,	2,	'2023-11-29 20:39:40',	'2023-11-29 20:39:40'),
(53,	19,	10,	1,	'2023-11-29 20:39:40',	'2023-11-29 20:39:40'),
(54,	20,	21,	1,	'2023-11-29 20:40:22',	'2023-11-29 20:40:22'),
(55,	20,	20,	1,	'2023-11-29 20:40:22',	'2023-11-29 20:40:22'),
(56,	20,	55,	2,	'2023-11-29 20:40:22',	'2023-11-29 20:40:22'),
(57,	21,	21,	1,	'2023-11-29 20:41:24',	'2023-11-29 20:41:24'),
(58,	21,	20,	1,	'2023-11-29 20:41:24',	'2023-11-29 20:41:24'),
(59,	21,	55,	2,	'2023-11-29 20:41:24',	'2023-11-29 20:41:24'),
(60,	22,	47,	2,	'2023-11-29 20:42:04',	'2023-11-29 20:42:04'),
(61,	22,	36,	2,	'2023-11-29 20:42:04',	'2023-11-29 20:42:04'),
(62,	22,	10,	1,	'2023-11-29 20:42:04',	'2023-11-29 20:42:04'),
(63,	23,	35,	3,	'2023-11-29 20:42:40',	'2023-11-29 20:42:40'),
(64,	23,	10,	2,	'2023-11-29 20:42:40',	'2023-11-29 20:42:40'),
(65,	24,	55,	2,	'2023-11-29 20:44:31',	'2023-11-29 20:44:31'),
(66,	24,	82,	1,	'2023-11-29 20:44:31',	'2023-11-29 20:44:31'),
(67,	24,	83,	1,	'2023-11-29 20:44:31',	'2023-11-29 20:44:31'),
(68,	25,	36,	1,	'2023-11-29 20:45:10',	'2023-11-29 20:45:10'),
(69,	25,	54,	1,	'2023-11-29 20:45:10',	'2023-11-29 20:45:10'),
(70,	25,	55,	1,	'2023-11-29 20:45:10',	'2023-11-29 20:45:10'),
(71,	26,	36,	1,	'2023-11-29 20:45:51',	'2023-11-29 20:45:51'),
(72,	26,	54,	1,	'2023-11-29 20:45:51',	'2023-11-29 20:45:51'),
(73,	26,	19,	1,	'2023-11-29 20:45:51',	'2023-11-29 20:45:51'),
(74,	27,	36,	1,	'2023-11-29 20:46:28',	'2023-11-29 20:46:28'),
(75,	27,	19,	2,	'2023-11-29 20:46:28',	'2023-11-29 20:46:28'),
(76,	28,	84,	1,	'2023-11-29 20:47:43',	'2023-11-29 20:47:43'),
(77,	28,	36,	2,	'2023-11-29 20:47:43',	'2023-11-29 20:47:43'),
(78,	28,	47,	1,	'2023-11-29 20:47:43',	'2023-11-29 20:47:43'),
(79,	28,	10,	1,	'2023-11-29 20:47:43',	'2023-11-29 20:47:43'),
(80,	29,	34,	1,	'2023-11-29 20:48:21',	'2023-11-29 20:48:21'),
(81,	29,	35,	2,	'2023-11-29 20:48:21',	'2023-11-29 20:48:21'),
(82,	29,	84,	2,	'2023-11-29 20:48:21',	'2023-11-29 20:48:21'),
(83,	29,	10,	1,	'2023-11-29 20:48:21',	'2023-11-29 20:48:21'),
(84,	30,	34,	1,	'2023-11-29 20:50:33',	'2023-11-29 20:50:33'),
(85,	30,	35,	1,	'2023-11-29 20:50:33',	'2023-11-29 20:50:33'),
(86,	30,	85,	2,	'2023-11-29 20:50:33',	'2023-11-29 20:50:33'),
(87,	30,	10,	1,	'2023-11-29 20:50:33',	'2023-11-29 20:50:33'),
(88,	31,	33,	3,	'2023-11-29 20:51:53',	'2023-11-29 20:51:53'),
(89,	32,	34,	3,	'2023-11-29 20:53:24',	'2023-11-29 20:53:24'),
(90,	33,	37,	3,	'2023-11-29 20:53:47',	'2023-11-29 20:53:47'),
(91,	34,	86,	4,	'2023-11-29 20:55:01',	'2023-11-29 20:55:01'),
(92,	35,	87,	1,	'2023-11-29 20:56:52',	'2023-11-29 20:56:52'),
(93,	35,	33,	1,	'2023-11-29 20:56:52',	'2023-11-29 20:56:52'),
(94,	36,	33,	1,	'2023-11-29 20:57:55',	'2023-11-29 20:57:55'),
(95,	36,	47,	2,	'2023-11-29 20:57:55',	'2023-11-29 20:57:55'),
(96,	37,	47,	3,	'2023-11-29 20:58:23',	'2023-11-29 20:58:23'),
(97,	1,	9,	1,	'2023-11-29 21:00:08',	'2023-11-29 21:00:08'),
(98,	1,	88,	1,	'2023-11-29 21:00:08',	'2023-11-29 21:00:08'),
(99,	1,	14,	1,	'2023-11-29 21:00:08',	'2023-11-29 21:00:08'),
(100,	38,	48,	1,	'2023-11-29 21:00:57',	'2023-11-29 21:00:57'),
(101,	38,	88,	1,	'2023-11-29 21:00:57',	'2023-11-29 21:00:57'),
(102,	38,	14,	1,	'2023-11-29 21:00:57',	'2023-11-29 21:00:57'),
(103,	39,	51,	1,	'2023-11-29 21:01:59',	'2023-11-29 21:01:59'),
(104,	39,	88,	1,	'2023-11-29 21:01:59',	'2023-11-29 21:01:59'),
(105,	39,	14,	1,	'2023-11-29 21:01:59',	'2023-11-29 21:01:59'),
(106,	40,	53,	1,	'2023-11-29 21:02:33',	'2023-11-29 21:02:33'),
(107,	40,	88,	1,	'2023-11-29 21:02:33',	'2023-11-29 21:02:33'),
(108,	40,	14,	1,	'2023-11-29 21:02:33',	'2023-11-29 21:02:33'),
(109,	41,	56,	1,	'2023-11-29 21:03:23',	'2023-11-29 21:03:23'),
(110,	41,	88,	1,	'2023-11-29 21:03:23',	'2023-11-29 21:03:23'),
(111,	41,	14,	1,	'2023-11-29 21:03:23',	'2023-11-29 21:03:23'),
(112,	42,	57,	1,	'2023-11-29 21:04:22',	'2023-11-29 21:04:22'),
(113,	42,	14,	1,	'2023-11-29 21:04:22',	'2023-11-29 21:04:22'),
(114,	42,	88,	1,	'2023-11-29 21:04:22',	'2023-11-29 21:04:22'),
(115,	43,	34,	1,	'2023-11-30 17:44:36',	'2023-11-30 17:44:36'),
(116,	43,	35,	3,	'2023-11-30 17:44:36',	'2023-11-30 17:44:36'),
(117,	43,	84,	3,	'2023-11-30 17:44:36',	'2023-11-30 17:44:36'),
(118,	43,	10,	1,	'2023-11-30 17:44:36',	'2023-11-30 17:44:36'),
(119,	44,	84,	2,	'2023-11-30 17:46:26',	'2023-11-30 17:46:26'),
(120,	44,	81,	1,	'2023-11-30 17:46:26',	'2023-11-30 17:46:26'),
(121,	44,	34,	1,	'2023-11-30 17:46:26',	'2023-11-30 17:46:26'),
(122,	44,	35,	4,	'2023-11-30 17:46:26',	'2023-11-30 17:46:26');

INSERT INTO `synthesis_sub_crafts` (`id`, `synthesis_id`, `craft`, `craft_level`, `created_at`, `updated_at`) VALUES
(2,	7,	'Goldsmithing',	41,	'2023-11-28 23:00:35',	'2023-11-28 23:00:35'),
(3,	12,	'Leathercraft',	37,	'2023-11-29 20:27:15',	'2023-11-29 20:27:15'),
(4,	13,	'Clothcraft',	27,	'2023-11-29 20:28:16',	'2023-11-29 20:28:16'),
(5,	14,	'Leathercraft',	20,	'2023-11-29 20:29:52',	'2023-11-29 20:29:52'),
(6,	15,	'Goldsmithing',	9,	'2023-11-29 20:32:20',	'2023-11-29 20:32:20'),
(7,	18,	'Leathercraft',	20,	'2023-11-29 20:38:41',	'2023-11-29 20:38:41'),
(8,	19,	'Clothcraft',	27,	'2023-11-29 20:39:40',	'2023-11-29 20:39:40'),
(9,	22,	'Clothcraft',	20,	'2023-11-29 20:42:04',	'2023-11-29 20:42:04'),
(10,	23,	'Leathercraft',	20,	'2023-11-29 20:42:40',	'2023-11-29 20:42:40'),
(11,	28,	'Leathercraft',	20,	'2023-11-29 20:47:43',	'2023-11-29 20:47:43'),
(12,	29,	'Leathercraft',	20,	'2023-11-29 20:48:21',	'2023-11-29 20:48:21'),
(13,	30,	'Leathercraft',	20,	'2023-11-29 20:50:33',	'2023-11-29 20:50:33'),
(14,	35,	'Goldsmithing',	12,	'2023-11-29 20:56:52',	'2023-11-29 20:56:52'),
(15,	43,	'Leathercraft',	20,	'2023-11-30 17:44:36',	'2023-11-30 17:44:36'),
(16,	44,	'Goldsmithing',	13,	'2023-11-30 17:46:26',	'2023-11-30 17:46:26');

-- 2023-12-05 18:03:14