CREATE DATABASE InstaAppDB2;
use InstaAppDB2;

CREATE TABLE Users (
    UserID int NOT NULL AUTO_INCREMENT,
    UserName varchar(50) NOT NULL,
    Password varchar(50) NOT NULL,
    Firstname varchar(50) NOT NULL,
    Lastname varchar(50) NOT NULL,
    Email varchar(50) NOT NULL,
    PRIMARY KEY (UserID)
);
CREATE TABLE Posts(
    PostID int NOT NULL AUTO_INCREMENT,
    UserID int NOT NULL,
    LikesCounter int default 0,
    CommentCounter int default 0,
    PostImage varchar(500) NOT NULL,
    PostDate datetime default localtime,
    PRIMARY KEY (PostID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE Comments(
    CommentID int NOT NULL AUTO_INCREMENT,
    PostID int NOT NULL,
    UserID int NOT NULL,
    CommentText varchar(500) NOT NULL,
    CommentDate datetime default localtime ,
    PRIMARY KEY (CommentID),
    FOREIGN KEY (PostID) REFERENCES Posts(PostID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
    
);


CREATE TABLE Likes(
    LikeID int NOT NULL AUTO_INCREMENT,
    PostID int NOT NULL,
    UserID int NOT NULL,
    PRIMARY KEY (LikeID),
    FOREIGN KEY (PostID) REFERENCES Posts(PostID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);


Insert into Users (UserName, Password, Firstname, Lastname,Email) values ('user4', 'password1', 'John', 'Doe',"hi@gmail.com");
Insert into Users (UserName, Password, Firstname, Lastname,Email) values ('user5', 'password2', 'Jane', 'Doe',"hi@gmail.com");
Insert into Users (UserName, Password, Firstname, Lastname,Email) values ('user6', 'password3', 'John', 'Smith',"hi@gmail.com");

Insert into Posts (UserID, PostImage) values (1, 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png');
Insert into Posts (UserID, PostImage) values (2, 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png');
Insert into Posts (UserID, PostImage) values (3, 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png');

Insert into Comments (PostID, UserID, CommentText) values (1, 1, 'This is a comment');
Insert into Comments (PostID, UserID, CommentText) values (2, 2, 'This is a comment');
Insert into Comments (PostID, UserID, CommentText) values (3, 3, 'This is a comment');






Select * from users;

Select * from Posts;

Select * from Comments;

Select * from Likes;