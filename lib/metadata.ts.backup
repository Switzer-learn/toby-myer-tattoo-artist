import { Metadata } from 'next';
import { AboutContent, ContactContent, FAQContent, ArtistsContent, HomeContent, MerchandiseContent, GalleryContent } from './content';

// Base site configuration
const SITE_CONFIG = {
  name: 'Toby Myer Tattoo Studio',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://tobymyer.com',
  description: 'Professional tattoo studio with talented artists specializing in custom tattoos and body art.',
  keywords: ['tattoo', 'tattoo studio', 'custom tattoos', 'body art', 'tattoo artists', 'tattoo parlor'],
  locale: 'en_US',
  type: 'website',
  author: 'Toby Myer Tattoo Studio',
  twitterHandle: '@tobymyer',
  logo: '/images/logo_tattoo_noBG.webp',
  phone: '+1 (555) 123-4567',
  email: 'info@tattoostudio.com',
  address: {
    streetAddress: '123 Studio Street',
    addressLocality: 'Art District',
    addressRegion: 'City',
    postalCode: '12345',
    addressCountry: 'US'
  }
};

// Generate base metadata
export function generateBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      template: `%s | ${SITE_CONFIG.name}`,
      default: SITE_CONFIG.name
    },
    description: SITE_CONFIG.description,
    keywords: SITE_CONFIG.keywords,
    authors: [{ name: SITE_CONFIG.author }],
    creator: SITE_CONFIG.author,
    publisher: SITE_CONFIG.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: SITE_CONFIG.type as any,
      locale: SITE_CONFIG.locale,
      url: SITE_CONFIG.url,
      title: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: SITE_CONFIG.logo,
          width: 1200,
          height: 630,
          alt: `${SITE_CONFIG.name} Logo`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      images: [SITE_CONFIG.logo],
      creator: SITE_CONFIG.twitterHandle,
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_SITE_VERIFICATION,
    },
  };
}

// Generate page-specific metadata
export function generatePageMetadata(
  title: string,
  description: string,
  path: string,
  additionalKeywords: string[] = [],
  images?: string[]
): Metadata {
  const fullUrl = `${SITE_CONFIG.url}${path}`;
  const allKeywords = [...SITE_CONFIG.keywords, ...additionalKeywords];
  
  return {
    title,
    description,
    keywords: allKeywords,
    openGraph: {
      title,
      description,
      url: fullUrl,
      images: images?.map(img => ({
        url: img,
        width: 1200,
        height: 630,
        alt: title,
      })) || [
        {
          url: SITE_CONFIG.logo,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images || [SITE_CONFIG.logo],
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

// Home page metadata
export function generateHomeMetadata(content: HomeContent | null): Metadata {
  const base = generateBaseMetadata();
  const title = content?.seo?.title || 'Tattoo Studio | Professional Artists & Custom Tattoos';
  const description = content?.seo?.description || SITE_CONFIG.description;
  const keywords = ['home', 'tattoo studio', 'custom tattoos', 'body art', 'tattoo artists'];
  
  return {
    ...base,
    ...generatePageMetadata(title, description, '/', keywords),
  };
}

// About page metadata
export function generateAboutMetadata(content: AboutContent | null): Metadata {
  const base = generateBaseMetadata();
  const title = content?.seo?.title || 'About Our Tattoo Studio | Professional Artists & Quality Work';
  const description = content?.seo?.description || 'Learn about our tattoo studio, our talented artists, and our commitment to quality and safety.';
  const keywords = ['about', 'tattoo studio', 'our story', 'tattoo artists', 'studio history'];
  const images = content?.images ? [
    content.images.mainArtist.src,
    content.images.bottomLeft.src,
    content.images.topRight.src,
  ] : undefined;
  
  return {
    ...base,
    ...generatePageMetadata(title, description, '/about', keywords, images),
  };
}

// Contact page metadata
export function generateContactMetadata(content: ContactContent | null): Metadata {
  const base = generateBaseMetadata();
  const title = content?.seo?.title || 'Contact Our Tattoo Studio | Book Your Appointment Today';
  const description = content?.seo?.description || 'Get in touch with our tattoo studio to book your appointment. Find our location, hours, and contact information.';
  const keywords = ['contact', 'tattoo appointment', 'book tattoo', 'tattoo studio location', 'contact form'];
  
  return {
    ...base,
    ...generatePageMetadata(title, description, '/contactUs', keywords),
  };
}

// FAQ page metadata
export function generateFAQMetadata(content: FAQContent | null): Metadata {
  const base = generateBaseMetadata();
  const title = 'Frequently Asked Questions | Tattoo Studio';
  const description = 'Find answers to common questions about tattoos, appointments, aftercare, and our studio policies.';
  const keywords = ['FAQ', 'tattoo questions', 'tattoo aftercare', 'tattoo appointment', 'tattoo FAQ'];
  
  return {
    ...base,
    ...generatePageMetadata(title, description, '/faq', keywords),
  };
}

// Artists page metadata
export function generateArtistsMetadata(content: ArtistsContent | null): Metadata {
  const base = generateBaseMetadata();
  const title = content?.seo?.title || 'Our Tattoo Artists | Meet Our Talented Team';
  const description = content?.seo?.description || 'Meet our talented team of tattoo artists, each with their unique style and expertise.';
  const keywords = ['tattoo artists', 'our artists', 'tattoo team', 'artist portfolio', 'tattoo styles'];
  const images = content?.artists?.map(artist => artist.photo) || undefined;
  
  return {
    ...base,
    ...generatePageMetadata(title, description, '/ourArtists', keywords, images),
  };
}

// Artist detail page metadata
export function generateArtistDetailMetadata(artist: ArtistsContent['artists'][0] | null): Metadata {
  const base = generateBaseMetadata();
  const title = artist ? `${artist.name} | Tattoo Artist | ${SITE_CONFIG.name}` : 'Tattoo Artist';
  const description = artist 
    ? `Discover the unique tattoo artistry of ${artist.name}. View their portfolio and book your appointment today.`
    : 'Learn about our talented tattoo artists and their unique styles.';
  const keywords = artist 
    ? [artist.name.toLowerCase(), 'tattoo artist', 'tattoo portfolio', 'custom tattoos']
    : ['tattoo artist', 'artist portfolio', 'custom tattoos'];
  const images = artist ? [artist.photo, ...artist.gallery] : undefined;
  
  return {
    ...base,
    ...generatePageMetadata(title, description, `/ourArtists/${artist?.id || ''}`, keywords, images),
  };
}

// Merchandise page metadata
export function generateMerchandiseMetadata(): Metadata {
  const base = generateBaseMetadata();
  const title = 'Tattoo Merchandise | Apparel, Accessories & Art | Toby Myer Tattoo Studio';
  const description = 'Shop our exclusive tattoo merchandise including apparel, accessories, and art prints. High-quality products featuring unique designs from our talented artists.';
  const keywords = ['tattoo merchandise', 'tattoo apparel', 'tattoo accessories', 'tattoo art prints', 'tattoo studio merch', 'tattoo clothing'];
  const images = [
    '/images/assets/txt_merchandise.webp',
    '/images/components/btn_apparel.webp',
    '/images/components/btn_accessories.webp'
  ];
  
  return {
    ...base,
    ...generatePageMetadata(title, description, '/merchandise', keywords, images),
  };
}

// Gallery page metadata
export function generateGalleryMetadata(): Metadata {
  const base = generateBaseMetadata();
  const title = 'Tattoo Gallery | Our Tattoo Artwork | Toby Myer Tattoo Studio';
  const description = 'Explore our tattoo gallery showcasing our artists\' work in traditional, color, black & gray, and custom tattoo designs.';
  const keywords = ['tattoo gallery', 'tattoo artwork', 'tattoo designs', 'tattoo portfolio', 'tattoo examples', 'tattoo inspiration'];
  const images = [
    '/images/assets/txt_gallery.webp',
    '/images/components/btn_traditional.webp',
    '/images/components/btn_colour.webp',
    '/images/components/btn_BlacknGray.webp'
  ];
  
  return {
    ...base,
    ...generatePageMetadata(title, description, '/gallery', keywords, images),
  };
}

// Generate JSON-LD structured data
export function generateStructuredData(type: string, data: any) {
  return {
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    }),
  };
}

// Organization structured data
export function generateOrganizationStructuredData() {
  return generateStructuredData('Organization', {
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.phone,
      contactType: 'customer service',
      availableLanguage: 'English',
    },
    address: {
      '@type': 'PostalAddress',
      ...SITE_CONFIG.address,
    },
    sameAs: [
      `https://twitter.com/${SITE_CONFIG.twitterHandle}`,
      // Add social media URLs here
    ],
  });
}

// LocalBusiness structured data
export function generateLocalBusinessStructuredData() {
  return generateStructuredData('LocalBusiness', {
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      ...SITE_CONFIG.address,
    },
    openingHours: [
      'Mo-Closed',
      'Tu 11:00-19:00',
      'We 11:00-19:00',
      'Th 11:00-19:00',
      'Fr 11:00-19:00',
      'Sa 11:00-19:00',
      'Su-Closed',
    ],
    priceRange: '$$',
    paymentAccepted: ['Cash', 'Credit Card', 'Debit Card'],
    currenciesAccepted: 'USD',
  });
}

// Artist structured data
export function generateArtistStructuredData(artist: ArtistsContent['artists'][0]) {
  return generateStructuredData('Person', {
    name: artist.name,
    description: `Professional tattoo artist at ${SITE_CONFIG.name}`,
    image: artist.photo,
    worksFor: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    knowsAbout: ['Tattooing', 'Body Art', 'Custom Design'],
    sameAs: `${SITE_CONFIG.url}/ourArtists/${artist.id}`,
  });
}

// FAQ structured data
export function generateFAQStructuredData(faqs: FAQContent['faqs']) {
  return generateStructuredData('FAQPage', {
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  });
}

// Merchandise structured data
export function generateMerchandiseStructuredData(content: MerchandiseContent) {
  const items = [
    ...content.categories.apparel.items,
    ...content.categories.accessories.items,
    ...content.categories.art.items
  ];

  return generateStructuredData('CollectionPage', {
    name: content.hero.title,
    description: content.hero.subtitle,
    url: `${SITE_CONFIG.url}/merchandise`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        '@type': 'Product',
        position: index + 1,
        name: item.name,
        description: item.description,
        image: `${SITE_CONFIG.url}${item.image}`,
        offers: {
          '@type': 'Offer',
          price: item.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock'
        }
      }))
    }
  });
}

// Gallery structured data
export function generateGalleryStructuredData(content: GalleryContent) {
  const allImages = [
    ...content.categories.traditional.images,
    ...content.categories.color.images,
    ...content.categories.blackAndGray.images,
    ...content.categories.custom.images
  ];

  return generateStructuredData('CollectionPage', {
    name: content.hero.title,
    description: content.hero.subtitle,
    url: `${SITE_CONFIG.url}/gallery`,
    mainEntity: {
      '@type': 'ImageGallery',
      numberOfItems: allImages.length,
      associatedMedia: allImages.map((image, index) => ({
        '@type': 'ImageObject',
        position: index + 1,
        url: `${SITE_CONFIG.url}${image}`,
        caption: `Tattoo artwork ${index + 1} from ${SITE_CONFIG.name}`
      }))
    }
  });
}

// Breadcrumb structured data
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return generateStructuredData('BreadcrumbList', {
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${SITE_CONFIG.url}${crumb.url}`,
    })),
  });
}

// Website structured data
export function generateWebsiteStructuredData() {
  return generateStructuredData('WebSite', {
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  });
}