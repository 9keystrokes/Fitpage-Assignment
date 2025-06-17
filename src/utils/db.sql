create table products (
  id bigint not null primary key,
  name character not null,
  description text,
  price numeric not null,
  category character,
  image_url character,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table users (
  id bigint not null primary key,
  name character not null,
  email character not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table reviews (
  id bigint not null primary key,
  user_id bigint references users (id),
  product_id bigint references products (id),
  review_text text not null,
  title character,
  image_url character,
  tags text[],
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table ratings (
  id bigint not null primary key,
  user_id bigint references users (id),
  product_id bigint references products (id),
  rating integer not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Dummy data

INSERT INTO products (name, description, price, category, image_url) VALUES
('ASUS TUF B760M-E D4 ATX Motherboard', 'ASUS TUF GAMING B760M-E D4 Motherboard with Intel Socket LGA1700 for Intel Core 14th & 13th Gen Processors, Intel Core 12th Gen, Pentium Gold and Celeron Processors. Features 2.5 Gb Ethernet, Two-Way AI Noise Cancelation, Realtek 7.1 Surround Sound, Addressable Gen 2 RGB Header, SafeSlot Core+ & SafeDIMM, and M.2 Q-Latch for easy installation.', 10809.00, 'Electronics', 'https://m.media-amazon.com/images/I/61HLW9GydHL._SL1000_.jpg'),
('Logitech G304 Lightspeed Wireless Gaming Mouse', 'Next-generation HERO sensor with incredible performance and up to 10x power efficiency, delivering exceptional accuracy with 400 IPS precision and up to 12,000 DPI sensitivity. Ultra-fast LIGHTSPEED Wireless technology provides lag-free gaming with 1 ms report rate. Lightweight design at only 99 grams with 250 hours continuous gameplay on one AA battery. Features 6 programmable buttons and compact design with built-in nano receiver storage.', 2395.00, 'Electronics', 'https://m.media-amazon.com/images/I/51VpABY-b6L._SL1500_.jpg'),
('GIGABYTE G6X Gaming Laptop', 'High-performance gaming laptop featuring Intel Core i7-13650HX Processor (24M Cache, up to 4.9 GHz, 14 cores), NVIDIA GeForce RTX 4060 Laptop GPU with 8GB GDDR6, 16.0" WUXGA (1920x1200) 165Hz display with 45% NTSC and MUX Switch, 16GB DDR5-4800 RAM (2x8GB, expandable up to 64GB), 1TB PCIe Gen4 SSD, Windows 11 Pro, and 1-Zone RGB Backlit Keyboard. Perfect for gaming, content creation, and multitasking with speed, storage, and stunning visuals.', 108145.00, 'Electronics', 'https://m.media-amazon.com/images/I/61CR2Rf9v7L._SL1200_.jpg'),
('CORSAIR Vengeance 16GB DDR5 RAM', 'CORSAIR VENGEANCE DDR5 memory optimized for Intel motherboards, delivering higher frequencies and greater capacities of DDR5 technology. Features 5200MHz speed, onboard voltage regulation for easy overclocking, custom Intel XMP 3.0 profiles via CORSAIR iCUE software, and solid aluminum heatspreader for cooling. Enables faster processing, rendering, and buffering with real-time frequency monitoring and lifetime warranty. Perfect for high-end CPUs and demanding applications.', 4389.00, 'Electronics', 'https://m.media-amazon.com/images/I/81ZatjfxQHL._SL1500_.jpg'),
('CORSAIR RM1000x 1000W Power Supply', 'CORSAIR RMx series modular power supply with 80 PLUS Gold certified high efficiency operation and extremely tight voltage control. Built with 100% Japanese 105°C capacitors for premium internal components ensuring solid power delivery. Features Zero RPM fan mode for virtually silent operation at low and medium loads, and fully modular cables for easy builds and upgrades with clean results. Perfect for high-performance PCs where reliability is essential.', 17999.00, 'Electronics', 'https://m.media-amazon.com/images/I/510eMVxDjLL.jpg'),
('PINTOLA High Protein Peanut Butter Chocolate Crunchy', 'High protein peanut butter with dark chocolate flavor containing 30g protein and 6.2g dietary fiber per 100g. Made with 60% premium roasted peanuts, 30% dark chocolate, and 10% imported European whey protein concentrate. USFDA-approved, gluten-free, zero trans fat, and made from non-GMO peanuts. Rich source of antioxidants, healthy fats, vitamins and minerals. Perfect for muscle growth, weight management, energy and endurance. Versatile use for toast, smoothies, desserts, or as a quick healthy snack.', 349.00, 'Food & Beverage', 'https://m.media-amazon.com/images/I/61gGjd+tPdL._SL1500_.jpg'),
('MSI Claw Handheld Gaming Console', 'AI-enabled portable gaming console powered by 1st Generation Intel Core Ultra 7 155H processor (up to 4.8GHz) with built-in NPU for AI acceleration. Features 7-inch FHD (1920x1080) touchscreen with 120Hz refresh rate, 16GB LPDDR5 RAM, 1TB NVMe PCIe Gen4 SSD, and Intel Arc graphics. Pre-loaded Windows 11 Home with MSI Center software. Weighs only 675g with included travel case. Perfect for gaming on-the-go with full PC gaming capabilities and Intel Killer Wi-Fi 7 + Bluetooth 5.4 connectivity.', 49990.00, 'Electronics', 'https://m.media-amazon.com/images/I/71ITOiztP2L._SL1500_.jpg'),
('OnePlus 11R 5G (Galactic Silver, 16GB RAM, 256GB Storage)', 'Flagship smartphone powered by Snapdragon 8+ Gen 1 processor with 16GB RAM and 256GB storage. Features stunning 6.7-inch 120Hz Super Fluid AMOLED display (2772x1240, HDR10+) and advanced triple camera system with 50MP main camera (Sony IMX890, OIS), 8MP ultrawide, and 16MP front camera. Includes 100W SUPERVOOC fast charging, 5000mAh battery, OxygenOS based on Android 13, and comprehensive camera modes including Nightscape, Portrait, Pro Mode, and Video HDR. Premium build with Galactic Silver finish.', 43999.00, 'Electronics', 'https://m.media-amazon.com/images/I/613SAOPmLeL._SL1500_.jpg'),
('iPhone 16 Pro Max 1TB Black Titanium', 'Latest flagship iPhone with stunning titanium design and massive 6.9-inch Super Retina XDR display. Built for Apple Intelligence personal AI system with groundbreaking privacy protections. Features Camera Control for intuitive access to camera tools, 48MP Fusion camera with 4K 120fps Dolby Vision recording, improved 48MP Ultra Wide camera for macro and wide-angle shots. Includes latest-generation Photographic Styles with creative flexibility, 2x tougher Ceramic Shield material, massive 1TB storage, and huge leap in battery life. Premium Black Titanium finish with iOS 17.', 172900.00, 'Electronics', 'https://m.media-amazon.com/images/I/619oqSJVY5L._SL1500_.jpg'),
('MSI GeForce RTX 4070 Super 12GB VENTUS 3X E 12G OC White Graphics Card', 'High-performance graphics card featuring NVIDIA GeForce RTX 4070 Super GPU with 12GB GDDR6X memory and 192-bit memory interface. Built with MSI VENTUS 3X cooling system featuring triple TORX Fan 4.0 design for optimal thermal performance and silent operation. Features boost clock up to 2505 MHz, HDMI 2.1a and DisplayPort 1.4a outputs, support for 4K gaming, ray tracing, DLSS 3, and AV1 encoding. White PCB design with brushed backplate and dual BIOS switch for performance/silent modes. Perfect for 1440p and 4K gaming with cutting-edge RTX features.', 58990.00, 'Electronics', 'https://m.media-amazon.com/images/I/51BfGVlOstL._SL1024_.jpg');

INSERT INTO users (name, email) VALUES
('Rajesh Kumar', 'rajesh.kumar@email.com'),
('Priya Sharma', 'priya.sharma@email.com'),
('Amit Singh', 'amit.singh@email.com'),
('Sneha Patel', 'sneha.patel@email.com'),
('Vikram Mehta', 'vikram.mehta@email.com'),
('Anita Desai', 'anita.desai@email.com'),
('Rohit Agarwal', 'rohit.agarwal@email.com'),
('Kavya Reddy', 'kavya.reddy@email.com'),
('Sanjay Gupta', 'sanjay.gupta@email.com'),
('Meera Joshi', 'meera.joshi@email.com');

INSERT INTO ratings (user_id, product_id, rating) VALUES
(1, 1, 5), (2, 1, 4), (3, 1, 5),
(1, 2, 4), (4, 2, 5), (5, 2, 4),
(2, 3, 5), (6, 3, 4), (7, 3, 5),
(3, 4, 5), (8, 4, 4), (9, 4, 5),
(4, 5, 4), (10, 5, 5), (1, 5, 4),
(6, 7, 4), (7, 7, 5), (8, 7, 4),
(7, 8, 5), (9, 8, 4), (10, 8, 5),
(8, 9, 4), (1, 9, 5), (2, 9, 4),
(9, 10, 5), (3, 10, 4), (4, 10, 5),
(10, 11, 5), (5, 11, 4), (6, 11, 5);

INSERT INTO reviews (user_id, product_id, review_text, title) VALUES
(1, 1, 'Excellent motherboard for the price! Installation was straightforward and all features work perfectly. The build quality feels premium and it handles my Intel 13th gen processor without any issues. RGB lighting looks great too.', 'Great value motherboard'),
(2, 1, 'Good motherboard but had some initial BIOS setup challenges. Once configured properly, it works well. The I/O options are comprehensive and the dual M.2 slots are very useful.', 'Solid choice with minor setup issues'),
(3, 1, 'Outstanding build quality and performance. Been using it for 6 months now with heavy gaming and content creation workloads. Temperature management is excellent and no stability issues whatsoever.', 'Rock solid performance'),

(1, 2, 'Perfect gaming mouse! The wireless connection is rock solid with zero lag. Battery life is amazing - easily lasts 2-3 months with heavy gaming. The sensor accuracy is spot on for competitive gaming.', 'Best wireless gaming mouse'),
(4, 2, 'Love this mouse! Very comfortable for long gaming sessions. The clicks are crisp and the scroll wheel is smooth. Great value for money and the wireless range is impressive.', 'Comfortable and reliable'),
(5, 2, 'Good mouse overall but the side buttons could be more responsive. The main clicks and tracking are excellent though. Build quality feels solid and it fits well in medium to large hands.', 'Good but minor button issues'),

(2, 3, 'Incredible gaming laptop! RTX 4060 handles all latest games at high settings smoothly. The 165Hz display is gorgeous and the keyboard feels premium. Thermals are well managed even during intense gaming.', 'Amazing gaming performance'),
(6, 3, 'Great laptop for both gaming and work. The Intel i7 processor handles multitasking beautifully. Only downside is it gets a bit loud under heavy load, but the cooling keeps temperatures in check.', 'Excellent all-rounder'),
(7, 3, 'Best laptop purchase I have made! The build quality is exceptional and the performance is top-notch. 16GB RAM is perfect for gaming and the 1TB SSD provides ample fast storage.', 'Premium gaming laptop'),

(3, 4, 'DDR5 performance is noticeable! Easy to install and runs at rated speeds without issues. The heatspreader design looks clean and temperatures stay low even during stress testing.', 'Excellent DDR5 upgrade'),
(8, 4, 'Good RAM but had to enable XMP profile manually in BIOS to get full 5200MHz speeds. Once configured, it works perfectly. The build quality feels solid and fits well with my setup.', 'Good performance after setup'),
(9, 4, 'Outstanding memory kit! Plug and play experience with my Intel motherboard. The performance boost from DDR4 to this DDR5 kit is very noticeable in gaming and productivity tasks.', 'Seamless DDR5 upgrade'),

(4, 5, 'Silent and reliable PSU! The zero RPM mode keeps it completely quiet during normal use. Modular cables make cable management a breeze. Been running stable for 8 months with a high-end GPU.', 'Silent and efficient'),
(10, 5, 'Top quality power supply. The 80+ Gold efficiency is great for reducing electricity bills. All cables included and the build quality feels premium. Highly recommended for high-end builds.', 'Premium quality PSU'),
(1, 5, 'Excellent PSU but the price is on the higher side. The modular design and silent operation justify the cost though. Installation was easy and it handles my power-hungry components perfectly.', 'Great but pricey'),

(6, 7, 'Delicious and healthy! The chocolate flavor is not overpowering and the protein content is impressive. Great for post-workout nutrition. The crunchy texture adds nice variety.', 'Tasty and nutritious'),
(7, 7, 'Good protein content but the taste could be better. It is a bit too sweet for my liking. The quality seems good and the packaging is convenient.', 'Good nutrition, taste could improve'),
(8, 7, 'Best peanut butter I have tried in India! The chocolate flavor is perfectly balanced and the protein boost is noticeable. Great for smoothies and direct consumption.', 'Excellent taste and nutrition'),

(7, 8, 'Portable gaming is finally viable! The Intel processor handles most games well and the 7-inch screen is perfect for handheld gaming. Windows 11 compatibility means I can play my entire Steam library.', 'Great portable gaming'),
(9, 8, 'Good device but battery life could be better during intensive gaming. The controls feel comfortable and the display quality is excellent. Perfect for indie games and older titles.', 'Good but battery concerns'),
(10, 8, 'Amazing handheld console! The AI features work well and the build quality feels premium. Being able to play PC games on the go is a game-changer. Highly recommended for gaming enthusiasts.', 'Premium handheld experience'),

(8, 9, 'Flagship performance at a reasonable price! The Snapdragon 8+ Gen 1 handles everything smoothly. Camera quality is impressive and the 120Hz display is gorgeous. Fast charging is incredibly convenient.', 'Excellent flagship alternative'),
(1, 9, 'Great phone overall but the camera could be better in low light. The performance is stellar and the build quality feels premium. OxygenOS is clean and responsive.', 'Good phone, average camera'),
(2, 9, 'Love this phone! The silver finish looks elegant and the performance is top-notch. Battery life easily lasts a full day with heavy usage. The 100W charging is incredibly fast.', 'Stylish and powerful'),

(9, 10, 'Best iPhone ever made! The titanium build feels incredibly premium and the camera system is outstanding. The A18 Pro chip handles everything effortlessly. Battery life is exceptional.', 'Premium flagship excellence'),
(3, 10, 'Expensive but worth every penny. The camera quality is unmatched and the display is gorgeous. The build quality is exceptional and iOS integration is seamless across all Apple devices.', 'Expensive but premium'),
(4, 10, 'Outstanding phone but the price is very high. The performance is excellent and the camera system is professional-grade. The 1TB storage is future-proof for content creators.', 'Great phone, steep price'),

(10, 11, '4K gaming beast! This GPU handles all latest games at high settings smoothly. The white design looks fantastic in my build and the cooling is excellent. Ray tracing performance is impressive.', 'Excellent 4K gaming card'),
(5, 11, 'Great GPU but runs a bit hot under heavy load. Performance is excellent for 1440p gaming and the DLSS 3 support is a game-changer. Build quality feels solid.', 'Great performance, runs warm'),
(6, 11, 'Perfect upgrade from my old GTX card! The performance jump is massive and the white aesthetics match my build perfectly. Silent operation during normal gaming sessions.', 'Perfect upgrade choice');

-- RLS for Supabase
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for users" ON users FOR SELECT USING (true);
CREATE POLICY "Public insert access for users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for users" ON users FOR UPDATE USING (true);

CREATE POLICY "Public read access for products" ON products FOR SELECT USING (true);

CREATE POLICY "Public read access for ratings" ON ratings FOR SELECT USING (true);
CREATE POLICY "Public insert access for ratings" ON ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for ratings" ON ratings FOR UPDATE USING (true);

CREATE POLICY "Public read access for reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public insert access for reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for reviews" ON reviews FOR UPDATE USING (true);
