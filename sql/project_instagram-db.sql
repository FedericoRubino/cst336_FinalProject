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
  `username` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(72) COLLATE utf8_unicode_ci NOT NULL,
  `firstName` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `lastName` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `sex` char(1) COLLATE utf8_unicode_ci NOT NULL,
  `profilePic` mediumblob,
  `description` varchar(500) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `user_table`
  ADD PRIMARY KEY (`userId`);
  
ALTER TABLE `user_table`
  MODIFY `userId` mediumint(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;


INSERT INTO `user_table` (`userId`,`username`, `password`, `firstName`, `lastName`, `sex`, `profilePic`, `description`) VALUES
(1,'benji','password', 'Benjamin1', 'Franklin', 'M', 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/857287e7-d073-4c62-812e-aae249f67326/d4hjp6a-b1e2522e-2d43-42de-95d7-1ef21bb68d70.jpg/v1/fil', 'Benjamin Franklin was America’s scientist, inventor, politician, philanthropist and business man. He is best known as one of our Founding Fathers and the only one who signed all three documents that freed America from Britain: The Declaration of Independence. The American Constitution and The Treaty of Paris.');

-- --------------------------------------------------------

--
-- Table structure for table `story_table`
--

DROP TABLE IF EXISTS `story_table`;

CREATE TABLE `story_table` (
  `storyId` mediumint(9) NOT NULL,
  `title` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `content` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `picture` mediumblob,
  `userId` smallint(6) NULL,
  `category` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `likes` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `story_table`
--

-- INSERT INTO `story_table` (`storyId`,`title`, `content`, `picture`, `userId`, `category`, `likes`) VALUES
-- (1,'Best Quote', 'Try not to become a man of success, but rather try to become a man of value.','https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/857287e7-d073-4c62-812e-aae249f67326/d4hjp6a-b1e2522e-2d43-42de-95d7-1ef21bb68d70.jpg/v1/fil', 1, 'Inspirational', 1);


--
-- Table structure for table `stream_table`
--
DROP TABLE IF EXISTS `stream_table`;

CREATE TABLE `stream_table` (
  `streamId` mediumint(9) NOT NULL,
  `userId` smallint(6) NULL,
  `storyId` smallint(6) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `stream_table`
--

INSERT INTO `stream_table` (`streamId`, `storyId`, `userId`) VALUES
(1,1,1);



--
-- Indexes for dumped tables
--

--
-- Indexes for table `user_table`
--

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
