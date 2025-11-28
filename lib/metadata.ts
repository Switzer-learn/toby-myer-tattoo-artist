import { Metadata } from 'next';
import { AboutContent, ContactContent, FAQContent, ArtistsContent, HomeContent, MerchandiseContent, GalleryContent } from './content';

// Base site configuration
const SITE_CONFIG = {
  name: 'Commandos18 Tattoo Bali | Professional Tattoo Studio',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://commandos18tattoo.com',
  description: 'Premier Bali tattoo studio specializing in custom designs, realism, fine line, and traditional Balinese tattoos. Located in Bali, Indonesia. Top-rated artists & sterile environment.',
  keywords: [
    // Core
    'Bali tattoo studio', 'Bali tattoo artist', 'tattoo Bali', 'Commandos18 Tattoo',
    // Location Specific
    'Canggu tattoo studio', 'Seminyak tattoo artist', 'Kuta tattoo parlor', 'Ubud tattoo shop', 'Sanur tattoo studio', 'Legian tattoo',
    // Intent & Price
    'Bali tattoo prices', 'affordable tattoo Bali', 'best tattoo artists Bali', 'top tattoo studio Bali', 'good life tattoo bali',
    // Styles
    'traditional tattoo Bali', 'Balinese tattoo', 'Japanese tattoo Bali', 'realism tattoo Bali', 'fine line tattoo Bali', 'minimalist tattoo Bali', 'portrait tattoo Bali', 'mandala tattoo Bali', 'geometric tattoo Bali', 'script tattoo Bali', 'cover up tattoo Bali',
    // Services
    'custom tattoo Bali', 'tattoo design Bali', 'full sleeve tattoo Bali', 'small tattoo Bali', 'tattoo consultation Bali',
    // User specific
    'the meaning of square tattoo', 'tattoo styles', 'different tattoo styles'
  ],
  locale: 'en_US',
  alternateLocale: 'id_ID',
  type: 'website',
  author: 'Commandos18 Tattoo Bali',
  twitterHandle: '@commandos18tattoobali', // Placeholder if not strictly defined, using handle style
  logo: '/images/logo_tattoo_noBG.webp',
  phone: '+62 877-7722-2020',
  email: 'commandos18tattoo@gmail.com',
  address: {
    streetAddress: 'Bali', // Generic for now as specific street wasn't provided
    addressLocality: 'Bali',
    addressRegion: 'Bali',
    postalCode: '80361', // Generic Bali/Canggu area code
    addressCountry: 'ID'
  },
  social: {
    instagram: 'https://instagram.com/commandos18tattoobali',
    tiktok: 'https://www.tiktok.com/@commandos18tattoobali',
    youtube: 'https://www.youtube.com/@commandos18tattoobali',
    facebook: 'https://facebook.com/profile.php?id=61584087054163'
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
      alternateLocale: SITE_CONFIG.alternateLocale,
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
      languages: {
        'en-US': fullUrl,
        'id-ID': fullUrl, // Pointing to same URL for now as content is mixed/English
      },
    },
  };
}

// Home page metadata
export function generateHomeMetadata(content: HomeContent | null): Metadata {
  const base = generateBaseMetadata();
  const title = content?.seo?.title || 'Bali Tattoo Studio | Best Artists & Custom Designs';
  const description = content?.seo?.description || 'Top-rated Bali tattoo studio. Expert artists in realism, fine line, and traditional styles. Clean, safe, and professional environment in Bali.';
  const keywords = ['Bali tattoo studio', 'best tattoo Bali', 'tattoo artist Bali', 'Canggu tattoo', 'Seminyak tattoo'];
  
  return {
    ...base,
    ...generatePageMetadata(title, description, '/', keywords),
  };
}

// About page metadata
export function generateAboutMetadata(content: AboutContent | null): Metadata {
  const base = generateBaseMetadata();
  const title = content?.seo?.title || 'About Commandos18 Tattoo Bali | Our Story & Artists';
  const description = content?.seo?.description || 'Learn about Commandos18 Tattoo Bali, our experienced artists, and our commitment to hygiene and quality art. The best tattoo experience in Bali.';
  const keywords = ['about tattoo Bali', 'tattoo studio history', 'Bali tattoo safety', 'professional tattoo artist Bali'];
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
  const title = content?.seo?.title || 'Contact Commandos18 Tattoo Bali | Book Appointment';
  const description = content?.seo?.description || 'Book your tattoo appointment in Bali. Contact Commandos18 Tattoo for consultations, price quotes, and bookings. WhatsApp and Email available.';
  const keywords = ['book tattoo Bali', 'tattoo appointment Bali', 'Bali tattoo price quote', 'contact tattoo studio Bali'];
  
  return {
    ...base,
    ...generatePageMetadata(title, description, '/contactUs', keywords),
  };
}

// FAQ page metadata
export function generateFAQMetadata(content: FAQContent | null): Metadata {
  const base = generateBaseMetadata();
  const title = 'FAQ | Tattoo Guide Bali | Commandos18 Tattoo';
  const description = 'Common questions about getting a tattoo in Bali. Prices, safety, aftercare, and booking info for Commandos18 Tattoo Studio.';
  const keywords = ['Bali tattoo FAQ', 'tattoo prices Bali', 'tattoo safety Bali', 'tattoo aftercare Bali', 'getting a tattoo in Bali'];
  
  return {
    ...base,
    ...generatePageMetadata(title, description, '/faq', keywords),
  };
}

// Artists page metadata
export function generateArtistsMetadata(content: ArtistsContent | null): Metadata {
  const base = generateBaseMetadata();
  const title = content?.seo?.title || 'Bali Tattoo Heroes';
  const description = content?.seo?.description || 'Meet the talented team at Commandos18 Tattoo Bali. Specialists in realism, Japanese, traditional, and fine line tattoos.';
  const keywords = ['Bali tattoo artists', 'best tattoo artist Bali', 'realism artist Bali', 'Japanese tattoo artist Bali', 'fine line artist Bali'];
  const images = content?.artists?.map(artist => artist.photo) || undefined;
  
  return {
    ...base,
    ...generatePageMetadata(title, description, '/ourArtists', keywords, images),
  };
}

// Artist detail page metadata
export function generateArtistDetailMetadata(artist: ArtistsContent['artists'][0] | null): Metadata {
  const base = generateBaseMetadata();
  const title = artist ? `${artist.name} | Bali Tattoo Artist | Commandos18 Tattoo` : 'Tattoo Artist Bali';
  const description = artist 
    ? `Book an appointment with ${artist.name}, a top tattoo artist in Bali specializing in unique custom designs. View portfolio and works.`
    : 'View the portfolio of our expert Bali tattoo artists.';
  const keywords = artist 
    ? [artist.name.toLowerCase(), 'Bali tattoo artist', 'tattoo portfolio Bali', `${artist.name} tattoo`]
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
  const title = 'Merchandise | Commandos18 Tattoo Bali Apparel';
  const description = 'Shop exclusive Commandos18 Tattoo Bali merchandise. T-shirts, accessories, and art prints from our Bali studio.';
  const keywords = ['Bali tattoo merch', 'tattoo t-shirts Bali', 'tattoo clothing', 'Commandos18 merch'];
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
  const title = 'Tattoo Gallery | Best Tattoos in Bali | Commandos18';
  const description = 'Explore our gallery of tattoos done in Bali. Realism, color, black & grey, and traditional works by Commandos18 artists.';
  const keywords = ['Bali tattoo gallery', 'tattoo photos Bali', 'best tattoo works Bali', 'tattoo inspiration', 'tattoo portfolio'];
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
      areaServed: 'Bali, Indonesia',
      availableLanguage: ['English', 'Indonesian'],
    },
    address: {
      '@type': 'PostalAddress',
      ...SITE_CONFIG.address,
    },
    sameAs: [
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.youtube,
      SITE_CONFIG.social.tiktok,
    ],
  });
}

// LocalBusiness structured data
export function generateLocalBusinessStructuredData() {
  return generateStructuredData('TattooParlor', {
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
    image: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      ...SITE_CONFIG.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -8.650000, // Approximate Bali coordinates, update if specific
      longitude: 115.216667
    },
    areaServed: 'Bali',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '10:00',
        closes: '22:00'
      }
    ],
    priceRange: '$$',
    paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer'],
    currenciesAccepted: 'IDR, USD, AUD, EUR',
  });
}

// Artist structured data
export function generateArtistStructuredData(artist: ArtistsContent['artists'][0]) {
  return generateStructuredData('Person', {
    name: artist.name,
    description: `Professional tattoo artist at ${SITE_CONFIG.name}, Bali`,
    image: artist.photo,
    jobTitle: 'Tattoo Artist',
    worksFor: {
      '@type': 'TattooParlor',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    knowsAbout: ['Tattooing', 'Body Art', 'Custom Design', 'Realism', 'Traditional'],
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
        caption: `Bali Tattoo artwork ${index + 1} from ${SITE_CONFIG.name}`
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