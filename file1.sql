create table customer
(id INT AUTO_INCREMENT,
 full_name VARCHAR(30),
 email_id VARCHAR(30),
 mob_number bigint,
 state VARCHAR(30),
 city VARCHAR(30),
 password VARCHAR(30)
);

create table gifts
(gift_id INT AUTO_INCREMENT, 
 item_name VARCHAR(30),
 price INT,
 PRIMARY KEY(gift_id)
);

insert into gifts values (1, 'chocolate_box', 1000);
insert into gifts values (2, 'glass_vase', 800);
insert into gifts values (3, 'key_chain', 100);
insert into gifts values (4, 'mug', 500);
insert into gifts values (5, 'pendant', 300);
insert into gifts values (6, 'perfume', 900);
insert into gifts values (7, 'photo_album', 400);
insert into gifts values (8, 'photo_frames', 700);
insert into gifts values (9, 'rubik_s_cube', 550);
insert into gifts values (10, 'statue', 1000);
insert into gifts values (11, 'sunglasses', 300);
insert into gifts values (12, 'table_clock', 450);
insert into gifts values (13, 'teddy_bear', 200);
insert into gifts values (14, 'wallet', 300);
insert into gifts values (15, 'wall_hanging', 650);
insert into gifts values (16, 'watch', 900);

create table cart
(c_id int,
 gift_id int,
 item_name VARCHAR(30),
 price int
);

create table payment
(c_id int,
 mymode VARCHAR(20),
 cardnum BIGINT,
 cvv int,
 num BIGINT
);













