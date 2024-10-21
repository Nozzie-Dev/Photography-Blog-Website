-- Populate Users Table
INSERT INTO Authors (fullname) VALUES
('Onthatile Nongqotho'),
('Enhle Majola'),
('Nozzie Nzimande'),
('Sibusiso Khumalo'),
('Lerato Mokoena'),
('Thabo Ndlovu'),
('Amina Radebe'),
('Zanele Mthembu'),
('Sipho Moyo'),
('Ntando Vilakazi');

-- Populate Posts Table
INSERT INTO Posts (id, title, author_id, image, content, publish_date, likes) VALUES
(1, 'Capturing Moments: My First Event Photography Gig', 1, 'https://mjmattorneys.co.za/sitepad-data/uploads/2023/09/defamation-4.png', 'I recently had the chance to capture a startup event. It was exhilarating to see the energy in the room and capture candid moments.', '2024-09-20', 8),
(2, 'The Art of Street Photography: Finding Beauty in Everyday Life', 2, 'https://seandurham.eu/wp-content/uploads/2024/03/image-6.jpeg', 'Street photography is all about capturing the rawness of everyday life. From bustling markets to quiet corners, there''s beauty in the mundane. I''ve learned to keep my camera ready to seize those fleeting moments.', '2024-09-27', 14),
(3, 'Exploring Nature: The Joys of Landscape Photography', 1, 'https://cdn.naturettl.com/wp-content/uploads/2020/04/25152036/how-to-find-great-locations-for-landscape-photography-11-900x600.jpg', 'There’s nothing quite like being in nature and capturing its beauty through landscape photography. Whether it''s mountains, forests, or oceans, I find peace and inspiration in these stunning locations.', '2024-09-29', 15),
(4, 'Mastering Portraits: Tips for Capturing Emotions', 1, 'https://yaffa-cdn.s3.amazonaws.com/yaffadsp/images/dmImage/StandardImage/image-18.jpg', 'Portrait photography is an art form that allows us to capture the essence of a person. By connecting with my subjects and understanding their stories, I can create powerful images that evoke emotion.', '2024-10-01', 10),
(5, 'Noodle', 3, 'https://res.cloudinary.com/yaffa-publishing/image/fetch/q_auto:best,c_fit,w_630,f_auto/http%3A%2F%2Fyaffa%2Dcdn.s3.amazonaws.com%2Fyaffadsp%2Fimages%2FdmImage%2FSourceImage%2Fimage%2D54.jpg', 'This moment captures the simple joy of savoring a warm meal, highlighting the comfort and satisfaction that food brings. It evokes a sense of warmth, nourishment, and human connection, reflecting the universal pleasure found in enjoying a favorite dish.', '2024-10-01', 2);

-- Populate Comments Table
INSERT INTO Comments (post_id, comment_author, content) VALUES
(1, 'Enhle Majola', 'Great article, love the photos!'),
(1, 'Nozzie Nzimande', 'How beautiful'),
(2, 'Sibusiso Khumalo', 'Love your perspective on street life!'),
(2, 'Lerato Mokoena', 'Such inspiring work!'),
(3, 'Thabo Ndlovu', 'Your landscapes are breathtaking!'),
(3, 'Amina Radebe', 'Can''t wait to see more of your work!'),
(4, 'Zanele Mthembu', 'Great tips! I love your portrait style!'),
(4, 'Sipho Moyo', 'Can''t wait to try these techniques!'),
(5, 'Ntando Vilakazi', 'Ohhh');

-- Populate PostLikes Table
INSERT INTO PostLikes (post_id, user_id) VALUES
(1, 1),
(2, 2),
(3, 1),
(4, 1),
(5, 3);
