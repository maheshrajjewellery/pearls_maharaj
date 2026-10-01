export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  span: 'large' | 'small';
}

export interface Product {
  id: string;
  name: string;
  pearlType: string;
  price: string;
  image: string;
  hoverImage: string;
}

export interface PearlCategory {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface EditorialImage {
  id: string;
  image: string;
  label: string;
}

export interface CraftStage {
  number: string;
  title: string;
  description: string;
  image: string;
}

export const collections: Collection[] = [
  {
    id: 'royal-pearls',
    name: 'Royal Pearls',
    description: 'Majestic strands worthy of royalty',
    image: 'https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=1200',
    span: 'large',
  },
  {
    id: 'heritage',
    name: 'Heritage',
    description: 'Timeless designs rooted in tradition',
    image: 'https://images.pexels.com/photos/177332/pexels-photo-177332.jpeg?auto=compress&cs=tinysrgb&w=800',
    span: 'small',
  },
  {
    id: 'heritage-2',
    name: 'Bridal',
    description: 'Ornate pieces for sacred beginnings',
    image: 'https://images.pexels.com/photos/30780337/pexels-photo-30780337.jpeg?auto=compress&cs=tinysrgb&w=800',
    span: 'small',
  },
  {
    id: 'contemporary',
    name: 'Contemporary',
    description: 'Modern interpretations of classic pearls',
    image: 'https://images.pexels.com/photos/10681031/pexels-photo-10681031.jpeg?auto=compress&cs=tinysrgb&w=1200',
    span: 'large',
  },
];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Royal Pearl Necklace',
    pearlType: 'Freshwater Pearl',
    price: '₹ 1,85,000',
    image: 'https://images.pexels.com/photos/10061399/pexels-photo-10061399.jpeg?auto=compress&cs=tinysrgb&w=800',
    hoverImage: 'https://images.pexels.com/photos/10835519/pexels-photo-10835519.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'p2',
    name: 'Heritage Pearl Choker',
    pearlType: 'Cultured Pearl',
    price: '₹ 95,000',
    image: 'https://images.pexels.com/photos/11006273/pexels-photo-11006273.jpeg?auto=compress&cs=tinysrgb&w=800',
    hoverImage: 'https://images.pexels.com/photos/10915187/pexels-photo-10915187.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'p3',
    name: 'Pearl Drop Earrings',
    pearlType: 'Freshwater Pearl',
    price: '₹ 42,000',
    image: 'https://images.pexels.com/photos/9428790/pexels-photo-9428790.jpeg?auto=compress&cs=tinysrgb&w=800',
    hoverImage: 'https://images.pexels.com/photos/9421333/pexels-photo-9421333.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'p4',
    name: 'Emerald Pearl Necklace',
    pearlType: 'Pearl & Emerald',
    price: '₹ 2,10,000',
    image: 'https://images.pexels.com/photos/17555289/pexels-photo-17555289.jpeg?auto=compress&cs=tinysrgb&w=800',
    hoverImage: 'https://images.pexels.com/photos/36536669/pexels-photo-36536669.png?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'p5',
    name: 'Classic Pearl Studs',
    pearlType: 'Cultured Pearl',
    price: '₹ 28,000',
    image: 'https://images.pexels.com/photos/36553500/pexels-photo-36553500.jpeg?auto=compress&cs=tinysrgb&w=800',
    hoverImage: 'https://images.pexels.com/photos/7743086/pexels-photo-7743086.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'p6',
    name: 'Pearl Bracelet',
    pearlType: 'Freshwater Pearl',
    price: '₹ 56,000',
    image: 'https://images.pexels.com/photos/8408374/pexels-photo-8408374.jpeg?auto=compress&cs=tinysrgb&w=800',
    hoverImage: 'https://images.pexels.com/photos/29149181/pexels-photo-29149181.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'p7',
    name: 'Royal Pearl Ring',
    pearlType: 'Pearl & Gold',
    price: '₹ 78,000',
    image: 'https://images.pexels.com/photos/19525066/pexels-photo-19525066.jpeg?auto=compress&cs=tinysrgb&w=800',
    hoverImage: 'https://images.pexels.com/photos/38940766/pexels-photo-38940766.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'p8',
    name: 'Bridal Pearl Set',
    pearlType: 'Premium Pearl',
    price: '₹ 3,25,000',
    image: 'https://images.pexels.com/photos/7743044/pexels-photo-7743044.jpeg?auto=compress&cs=tinysrgb&w=800',
    hoverImage: 'https://images.pexels.com/photos/29522527/pexels-photo-29522527.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export const pearlCategories: PearlCategory[] = [
  {
    id: 'types',
    title: 'Pearl Types',
    description: 'From freshwater to cultured, discover the origins and qualities of each pearl variety.',
    image: 'https://images.pexels.com/photos/908183/pexels-photo-908183.jpeg?auto=compress&cs=tinysrgb&w=1000',
  },
  {
    id: 'luster',
    title: 'Luster',
    description: 'The defining quality of a pearl — how light travels through its layers to create that glow.',
    image: 'https://images.pexels.com/photos/6766733/pexels-photo-6766733.jpeg?auto=compress&cs=tinysrgb&w=1000',
  },
  {
    id: 'shape',
    title: 'Shape',
    description: 'Round, oval, baroque — each form carries its own character and beauty.',
    image: 'https://images.pexels.com/photos/10877350/pexels-photo-10877350.jpeg?auto=compress&cs=tinysrgb&w=1000',
  },
  {
    id: 'care',
    title: 'Care',
    description: 'Preserve the luminance of your pearls for generations with proper care.',
    image: 'https://images.pexels.com/photos/7743044/pexels-photo-7743044.jpeg?auto=compress&cs=tinysrgb&w=1000',
  },
];

export const editorialImages: EditorialImage[] = [
  {
    id: 'e1',
    image: 'https://images.pexels.com/photos/9429420/pexels-photo-9429420.jpeg?auto=compress&cs=tinysrgb&w=800',
    label: 'Pearl Close-up',
  },
  {
    id: 'e2',
    image: 'https://images.pexels.com/photos/10681031/pexels-photo-10681031.jpeg?auto=compress&cs=tinysrgb&w=800',
    label: 'Editorial',
  },
  {
    id: 'e3',
    image: 'https://images.pexels.com/photos/17555289/pexels-photo-17555289.jpeg?auto=compress&cs=tinysrgb&w=800',
    label: 'Jewellery Detail',
  },
  {
    id: 'e4',
    image: 'https://images.pexels.com/photos/25389117/pexels-photo-25389117.jpeg?auto=compress&cs=tinysrgb&w=800',
    label: 'Bridal Look',
  },
  {
    id: 'e5',
    image: 'https://images.pexels.com/photos/6263146/pexels-photo-6263146.jpeg?auto=compress&cs=tinysrgb&w=800',
    label: 'Craftsmanship',
  },
  {
    id: 'e6',
    image: 'https://images.pexels.com/photos/7866490/pexels-photo-7866490.jpeg?auto=compress&cs=tinysrgb&w=800',
    label: 'Brand Environment',
  },
];

export const craftStages: CraftStage[] = [
  {
    number: '01',
    title: 'Select',
    description: 'Each pearl is chosen by hand for its luster, shape, and surface quality.',
    image: 'https://images.pexels.com/photos/6766733/pexels-photo-6766733.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    number: '02',
    title: 'Design',
    description: 'Master designers sketch every piece, balancing form and function.',
    image: 'https://images.pexels.com/photos/6263070/pexels-photo-6263070.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    number: '03',
    title: 'Craft',
    description: 'Artisans shape metal and set stones with precision honed over decades.',
    image: 'https://images.pexels.com/photos/33102017/pexels-photo-33102017.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    number: '04',
    title: 'Polish',
    description: 'Each piece is polished to achieve a mirror-like finish.',
    image: 'https://images.pexels.com/photos/30557505/pexels-photo-30557505.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    number: '05',
    title: 'Perfect',
    description: 'A final inspection ensures every piece meets our exacting standards.',
    image: 'https://images.pexels.com/photos/955525/pexels-photo-955525.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
];

export const heroImage = 'https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=1920';
export const heroImageMobile = 'https://images.pexels.com/photos/9421333/pexels-photo-9421333.jpeg?auto=compress&cs=tinysrgb&w=800';
export const brandIntroImage = 'https://images.pexels.com/photos/6766733/pexels-photo-6766733.jpeg?auto=compress&cs=tinysrgb&w=1000';
export const pearlExperienceImage = 'https://images.pexels.com/photos/908183/pexels-photo-908183.jpeg?auto=compress&cs=tinysrgb&w=1600';
export const bridalImage = 'https://images.pexels.com/photos/25389117/pexels-photo-25389117.jpeg?auto=compress&cs=tinysrgb&w=1600';
export const bridalImageMobile = 'https://images.pexels.com/photos/30780337/pexels-photo-30780337.jpeg?auto=compress&cs=tinysrgb&w=800';
export const craftsmanshipBg = 'https://images.pexels.com/photos/6263146/pexels-photo-6263146.jpeg?auto=compress&cs=tinysrgb&w=1920';
