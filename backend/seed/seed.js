/**
 * Seed script — populates PostgreSQL with initial data.
 * Usage: npm run seed
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') })
const { connectDB, sequelize } = require('../config/db')
const Bed      = require('../models/Bed')
const Mattress = require('../models/Mattress')
const Pillow   = require('../models/Pillow')
const Duvet    = require('../models/Duvet')
const Store    = require('../models/Store')
const Settings = require('../models/Settings')

// ─── Source data ─────────────────────────────────────────────────────────────

const beds = [
  { name: 'Aurora Luxury Bed',   sub: 'Plush · Luxury',        thickness: '12"', feel: 'Plush',        price: '$1,290', desc: 'Upholstered headboard with a 12-inch plush-top. Hotel-soft, sink-in comfort.',                  img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80' },
  { name: 'OrthoFirm Support',   sub: 'Firm · Orthopedic',     thickness: '10"', feel: 'Firm',         price: '$1,090', desc: 'A firmer core engineered for spinal alignment and lasting back relief.',                       img: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?auto=format&fit=crop&w=1600&q=80' },
  { name: 'Grand King Platform', sub: 'Medium-firm · King',    thickness: '14"', feel: 'Medium-firm',  price: '$1,640', desc: 'Extra-wide king with a storage base and a balanced, supportive feel.',                        img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=80' },
  { name: 'Cloud Pillowtop',     sub: 'Soft · Luxury',         thickness: '13"', feel: 'Soft',         price: '$1,420', desc: 'A deep pillowtop layer that wraps you in cloud-like softness.',                               img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=80' },
  { name: 'Linen Low Frame',     sub: 'Medium · Modern',       thickness: '11"', feel: 'Medium',       price: '$980',   desc: 'A low, linen-wrapped frame with a clean, modern silhouette.',                                  img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80' },
  { name: 'Serene Storage Bed',  sub: 'Medium-firm · King',    thickness: '14"', feel: 'Medium-firm',  price: '$1,540', desc: 'Generous under-bed storage with a quietly elegant headboard.',                                 img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=80' },
  { name: 'Noir Canopy Bed',     sub: 'Plush · Statement',     thickness: '12"', feel: 'Plush',        price: '$1,780', desc: 'A striking canopy frame that anchors the room in calm luxury.',                               img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80' },
]

const mattresses = [
  { name: 'Cloud Memory Foam',    tag: 'Soft · 11"',   dotColor: '#9ec0df', desc: 'Pressure-relieving foam that cradles every curve.',              price: '$740', img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Hybrid Pocket-Spring', tag: 'Medium · 12"', dotColor: '#5f93c4', desc: 'Breathable springs with a balanced, all-rounder feel.',          price: '$920', img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1000&q=80' },
  { name: 'OrthoCore Firm',       tag: 'Firm · 10"',   dotColor: '#2f5d8a', desc: 'Dense orthopedic core for back and joint relief.',               price: '$860', img: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?auto=format&fit=crop&w=1000&q=80' },
]

const pillows = [
  { slug: 'vita-throw',       name: 'Vita Throw Pillow',       desc: '*Our Throw Pillow is to compliment your settees and sofa. It provides back, neck and head support. *It comes in various colours and sizes to match your furniture.',                                                                                                                                                                         img: 'https://res.cloudinary.com/dkixuj3or/image/upload/v1782387755/IMG_0926_nmovou.jpg',                                      sizes: [{ label: 'Suede Cover 15x15', price: '₦4,000' }, { label: 'Suede Cover 20x20', price: '₦6,000' }], featured: true, featuredOrder: 0 },
  { slug: 'vita-dove',        name: 'Vita Dove',                desc: "Dove Fibre pillow is a light weight siliconized Fibre pillow covered in fine textile (with inner foam sheet lining) to give a soft and form neck support. It is ideal for school use and in the children's room.",                                                                                                                              img: 'https://res.cloudinary.com/dkixuj3or/image/upload/v1782387844/Gemini_Generated_Image_ehga9nehga9nehga_1_kn2vdp.png',     price: '₦6,000',  featured: true, featuredOrder: 1 },
  { slug: 'vita-gazelle',     name: 'Vita Gazelle',             desc: '*Vita Gazelle Pillow is a medium weight fibre-based pillow covered in fine textile to give comfortable headrest during sleep where softness is required. *It is light weight and hypoallergenic. *It is ideal for young adults.',                                                                                                              img: 'https://res.cloudinary.com/dkixuj3or/image/upload/v1782387835/Gemini_Generated_Image_iqd4fpiqd4fpiqd4_lt1qgb.png',      price: '₦7,000',  featured: true, featuredOrder: 2 },
  { slug: 'vita-jumbo',       name: 'Vita Jumbo',               desc: '*Jumbo Pillow is made of a relatively high density siliconized fibre. The soft fibre provides excellent comfort. The excellent air flow through the fibre provides additional ventilation which is therapeutic to sleeping disorder.',                                                                                                           img: 'https://res.cloudinary.com/dkixuj3or/image/upload/v1782387840/Gemini_Generated_Image_sbxjwrsbxjwrsbxj_w4rlfb.png',      price: '₦11,000', featured: true, featuredOrder: 3 },
  { slug: 'vita-quilted',     name: 'Vita Quilted',             desc: '*Vita Quilted Pillow is made of hollow siliconized fibre and is designed to withstand wear and tear which is commonly associated with excessive use. *The quilted cover provides a soft feel and is richly reinforced for more durability. *Hotels, Inns and the hospitality industry are best served by this product.',                    img: 'https://res.cloudinary.com/dkixuj3or/image/upload/v1782387849/Gemini_Generated_Image_3i2daf3i2daf3i2d_ln5hd4.png',      price: '₦12,000', featured: true, featuredOrder: 4 },
  { slug: 'vita-flamingo',    name: 'Vita Flamingo',                                                                                                                                                                                                                                                                                                                                                                   img: 'https://res.cloudinary.com/dkixuj3or/image/upload/v1782387830/Gemini_Generated_Image_ayuugoayuugoayuu_mede4s.png',      price: '₦12,500' },
  { slug: 'vita-fluffy',      name: 'Vita Fluffy Pillow',                                                                                                                                                                                                                                                                                                                                                              img: 'https://res.cloudinary.com/dkixuj3or/image/upload/v1782387837/Gemini_Generated_Image_eodbvjeodbvjeodb_xoindf.png',      price: '₦14,000' },
  { slug: 'vita-pama',        name: 'Vita Pama',                desc: '*Vita Pama Pillow is made of high density hollow siliconized fiber. *The ultra soft texture provides the ideal balance of cushiness and support.',                                                                                                                                                                                              price: '₦17,000' },
  { slug: 'vitalite-memory',  name: 'Vitalite Memory Pillow',   desc: '*Vitalite is an exceptionally high quality visco-elastic pillow that comes in a regular shape, has an air exchange system feature and maintains a conducive temperature. *It comes in a removable and washable cover.',                                                                                                                         img: 'https://res.cloudinary.com/dkixuj3or/image/upload/v1782387782/Gemini_Generated_Image_r3gbnfr3gbnfr3gb_g9gi5q.png',      price: '₦18,000', featured: true, featuredOrder: 5 },
  { slug: 'vita-haven-memory',name: 'Vita Haven Memory Pillow', desc: '*Haven Memory Pillow is soft, tender and caresses the body. It keeps the head and neck cool and dry, reducing pressure points around the neck area. It is also smooth and makes sleep more pleasurable. *Haven Memory Pillow comes in a cotton removable cover.',                                                                              img: 'https://res.cloudinary.com/dkixuj3or/image/upload/v1782387842/Gemini_Generated_Image_cx099ucx099ucx09_mzmhzu.png',      price: '₦20,000' },
  { slug: 'vitacool-memory',  name: 'Vitacool Memory Pillow',   desc: '*Vita Cool is a visco elastic pillow. *The Vitacool Pillow conforms to the shape of the head and neck offering therapeutic support and rises back to its original shape in 60 seconds after being compressed. *The soft feel provides excellent comfort and unmatched durability.',                                                             img: 'https://res.cloudinary.com/dkixuj3or/image/upload/v1782387814/Gemini_Generated_Image_apr5mwapr5mwapr5_htil89.png',      price: '₦25,000' },
  { slug: 'vitalex',          name: 'Vitalex',                  desc: 'Vitalex Memory Pillow is designed to support the contours of your neck and body for an appropriate posture, and for a restful sleep.',                                                                                                                                                                                                         img: 'https://res.cloudinary.com/dkixuj3or/image/upload/v1782387801/Gemini_Generated_Image_5kuvew5kuvew5kuv_jfbwxn.png',      price: '₦26,000' },
  { slug: 'vitarev',          name: 'Vitarev',                  desc: '*This is an exceptionally soft and high quality latex pillow that comes in a regular shape, has an air exchange system feature and maintains a conducive temperature. *The Vitarev also ensures better breathing & consequent reduction of snoring. *It comes in a removable washable cover and a carrier bag.',                              img: 'https://res.cloudinary.com/dkixuj3or/image/upload/v1782387809/Gemini_Generated_Image_njdh97njdh97njdh_ruy7iv.png',      price: '₦29,000' },
  { slug: 'vita-pearl',       name: 'Vita Pearl',               desc: 'This is a Visco elastic pillow that has spikes which allow air flow that enables it to naturally regulate temperature and draw moisture away from your face and neck, a feeling that will help you stay cool all night long.',                                                                                                                   img: 'https://res.cloudinary.com/dkixuj3or/image/upload/v1782389147/Gemini_Generated_Image_to1975to1975to19_iuo1jq.png',      price: '₦47,000' },
  { slug: 'cool-plus',        name: 'Cool Plus Pillow',                                                                                                                                                                                                                                                                                                                                                                img: 'https://res.cloudinary.com/dkixuj3or/image/upload/v1782389131/Gemini_Generated_Image_cr33nncr33nncr33_yu8ql9.png',      price: '₦55,000' },
  { slug: 'floor-pillow',     name: 'Floor Pillow (Big & Small)',desc: 'Vita Floor Pillows are great for quick, casual sitting. Frequently used when watching television or playing games, a floor pillow is very functional. It can equally be used as a massage pillow. It comes in many fabrics to complement your home decor.',                                                                                    img: 'https://res.cloudinary.com/dkixuj3or/image/upload/v1782389121/IMG_0927_g5g1xw.jpg',                                     sizes: [{ label: 'Big Floor Pillow', price: '₦120,000' }, { label: 'Small Floor Pillow', price: '₦62,000' }] },
  { slug: 'pregnancy-pillow', name: 'Pregnancy Pillow',         desc: 'Made from quality fibre to perfection and designed to give full support to help prevent back pain, promotes lateral position and improves the quality of sleep. Our Pregnancy Pillow is the perfect pillow for a peaceful and comfortable relaxation during pregnancy.',                                                                         img: 'https://res.cloudinary.com/dkixuj3or/image/upload/v1782389134/Gemini_Generated_Image_pn9ft7pn9ft7pn9f_ke9pzw.png',      price: '₦36,000' },
]

const duvets = [
  { name: 'Cloudweave Duvet Set', category: 'duvet',      desc: 'All-season warmth, 300TC cotton cover. Includes 2 pillow cases.', price: '$130', img: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1300&q=80', isFeatured: true },
  { name: 'Linen-Soft Bedcover',  category: 'bedcover',   desc: 'Stonewashed & breathable. Queen & king.',                         price: '$85',  img: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80' },
  { name: 'Sateen Pillow Cases',  category: 'pillowcase', desc: 'Set of 2, silky finish. 8 colorways.',                           price: '$28',  img: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=900&q=80' },
]

const stores = [
  { name: 'Mature Flagship',    address: '123 Comfort Avenue, Suite 4\nDowntown — City, 00000', hours: 'Mon–Sat · 9am–7pm' },
  { name: 'Westside Showroom',  address: '45 Linen Road\nWestside Mall — City, 00000',          hours: 'Mon–Sun · 10am–8pm' },
  { name: 'Lakeside Branch',    address: '8 Harbour View Plaza\nLakeside — City, 00000',         hours: 'Tue–Sun · 10am–6pm' },
]

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  await connectDB()

  // Drop and recreate all tables
  await sequelize.sync({ force: true })
  console.log('Tables recreated')

  await Bed.bulkCreate(beds.map((b, i) => ({ ...b, order: i })))
  await Mattress.bulkCreate(mattresses.map((m, i) => ({ ...m, order: i })))
  await Pillow.bulkCreate(pillows.map((p, i) => ({ ...p, order: i })))
  await Duvet.bulkCreate(duvets.map((d, i) => ({ ...d, order: i })))
  await Store.bulkCreate(stores.map((s, i) => ({ ...s, order: i })))
  await Settings.findOrCreate({ where: { id: 'main' }, defaults: { data: {} } })

  console.log('✓ Beds:', beds.length)
  console.log('✓ Mattresses:', mattresses.length)
  console.log('✓ Pillows:', pillows.length)
  console.log('✓ Duvets:', duvets.length)
  console.log('✓ Stores:', stores.length)
  console.log('✓ Settings: defaults applied')
  console.log('\nSeed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
