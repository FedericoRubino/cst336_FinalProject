SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Table structure for table `user_table`
--
DROP TABLE IF EXISTS `user_table`;
CREATE TABLE `user_table` (
  `userId` mediumint(9) NOT NULL,
  `firstName` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `lastName` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `sex` char(1) COLLATE utf8_unicode_ci NOT NULL,
  `profilePic` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `user_table`
--

INSERT INTO `user_table` (`userId`, `firstName`, `lastName`, `sex`, `profilePic`, `description`) VALUES
(1, 'Benjamin1', 'Franklin', 'M', 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/857287e7-d073-4c62-812e-aae249f67326/d4hjp6a-b1e2522e-2d43-42de-95d7-1ef21bb68d70.jpg/v1/fil', 'Benjamin Franklin was America’s scientist, inventor, politician, philanthropist and business man. He is best known as one of our Founding Fathers and the only one who signed all three documents that freed America from Britain: The Declaration of Independence. The American Constitution and The Treaty of Paris.'),
(2, 'Benjamin2', 'Franklin', 'M', 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/857287e7-d073-4c62-812e-aae249f67326/d4hjp6a-b1e2522e-2d43-42de-95d7-1ef21bb68d70.jpg/v1/fil', 'Benjamin Franklin was America’s scientist, inventor, politician, philanthropist and business man. He is best known as one of our Founding Fathers and the only one who signed all three documents that freed America from Britain: The Declaration of Independence. The American Constitution and The Treaty of Paris.'),
(3, 'Benjamin3', 'Franklin', 'M', 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/857287e7-d073-4c62-812e-aae249f67326/d4hjp6a-b1e2522e-2d43-42de-95d7-1ef21bb68d70.jpg/v1/fil', 'Benjamin Franklin was America’s scientist, inventor, politician, philanthropist and business man. He is best known as one of our Founding Fathers and the only one who signed all three documents that freed America from Britain: The Declaration of Independence. The American Constitution and The Treaty of Paris.');

-- --------------------------------------------------------

--
-- Table structure for table `story_table`
--

DROP TABLE IF EXISTS `story_table`;

CREATE TABLE `story_table` (
  `storyId` mediumint(9) NOT NULL,
  `content` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `picture` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `userId` smallint(6) NULL,
  `category` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `likes` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `story_table`
--

INSERT INTO `story_table` (`storyId`, `content`, `picture`, `userId`, `category`, `likes`) VALUES
(1, 'Try not to become a man of success, but rather try to become a man of value.','https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/857287e7-d073-4c62-812e-aae249f67326/d4hjp6a-b1e2522e-2d43-42de-95d7-1ef21bb68d70.jpg/v1/fil', 1, 'Inspirational', 1),
(2, 'Life is like riding a bicycle. To keep your balance you must keep moving.','', 1, 'Motivational', 20),
(3, 'You cannot hope to build a better world without improving the individuals. To that end, each of us must work for his own improvement and, at the same time, share a general responsibility for all human','', 3, 'Life', 100),
(4, 'Your success and happiness lies in you. Resolve to keep happy, and your joy and you shall form an invincible host against difficulties.','', 1, 'Inspirational', 86);


--
-- Table structure for table `stream_table`
--
DROP TABLE IF EXISTS `stream_table`;

CREATE TABLE `stream_table` (
  `streamId` mediumint(9) NOT NULL,
  `userId` smallint(6) NULL,
  `storyId` smallint(6) NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `story_table`
--

INSERT INTO `story_table` (`streamId`, `storyId`, `userId`, ) VALUES
(1,1,1);



--
-- Indexes for dumped tables
--

--
-- Indexes for table `user_table`
--
ALTER TABLE `user_table`
  ADD PRIMARY KEY (`userId`);

--
-- Indexes for table `story_table`
--
ALTER TABLE `story_table`
  ADD PRIMARY KEY (`storyId`);

--
-- Indexes for table `stream_table`
--
ALTER TABLE `stream_table`
  ADD PRIMARY KEY (`streamId`);


--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user_table`
--
ALTER TABLE `user_table`
  MODIFY `userId` mediumint(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `story_table`
--
ALTER TABLE `story_table`
  MODIFY `storyId` mediumint(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
COMMIT;

--
-- AUTO_INCREMENT for table `stream_table`
--
ALTER TABLE `stream_table`
  MODIFY `streamId` mediumint(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
COMMIT;
