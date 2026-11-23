export type Stat = { label: string; value: string };

export type Settings = {
  companyName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  phone: string;
  phone2?: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  mapLat: string;
  mapLng: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  logo: string;
  aboutImage: string;
  heroVideo?: string;
  brochure: string;
  aboutContent: string;
  manufactures: string[];
  stats: Stat[];
  keywords: string[];
  subcategoryTags?: string[];
  terms: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  order: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  images: string[];
  featured: boolean;
  inStock: boolean;
  order: number;
  legacy?: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  content: string;
  image: string;
  keywords: string[];
  date: string;
  published: boolean;
  legacy?: string[];
};

export type GalleryItem = { id: string; image: string; caption: string };

export type Page = {
  id: string;
  slug: string;
  title: string;
  content: string;
  image: string;
  published: boolean;
};

export type Faq = { id: string; question: string; answer: string };

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  product?: string;
  message: string;
  date: string;
  read: boolean;
};

export type Subscriber = { id: string; email: string; date: string };

export type SiteData = {
  settings: Settings;
  categories: Category[];
  products: Product[];
  posts: Post[];
  gallery: GalleryItem[];
  pages: Page[];
  faqs: Faq[];
  enquiries: Enquiry[];
  subscribers: Subscriber[];
};
