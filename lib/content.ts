import axios from 'axios';

// Base URL for API calls
const API_BASE = process.env.NEXT_PUBLIC_API_URL || (typeof window === 'undefined' ? 'http://localhost:3000' : '');

// Generic fetch function with error handling
async function fetchContent(endpoint: string) {
  try {
    const url = API_BASE ? `${API_BASE}/api/content/${endpoint}` : `/api/content/${endpoint}`;
    const response = await axios.get(url);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch content');
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

// Content type definitions
export interface AboutContent {
  section?: string;
  _id?: string;
  updatedAt?: string;
  hero: {
    title: string;
    subtitle: string;
  };
  content: {
    mainParagraph: string;
    secondParagraph: string;
    thirdParagraph: string;
  };
  images: {
    mainArtist: {
      src: string;
      alt: string;
      caption: string;
    };
    bottomLeft: {
      src: string;
      alt: string;
      caption: string;
    };
    topRight: {
      src: string;
      alt: string;
      caption: string;
    };
  };
  ctaButton: {
    text: string;
    link: string;
  };
  testimonials: {
    title: string;
    subtitle: string;
  };
  seo: {
    title: string;
    description: string;
  };
  dynamicSections?: Array<{
    id: string;
    type: 'text' | 'image' | 'testimonial' | 'gallery';
    title?: string;
    content?: any;
    order: number;
  }>;
}

export interface ContactContent {
  hero: {
    title: string;
    subtitle: string;
  };
  backgroundImage: string;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
    hours: string;
  };
  map: {
    embedUrl: string;
    title: string;
  };
  form: {
    title: string;
    fields: {
      name: {
        label: string;
        placeholder: string;
        required: boolean;
      };
      email: {
        label: string;
        placeholder: string;
        required: boolean;
      };
      phone: {
        label: string;
        placeholder: string;
        required: boolean;
      };
      message: {
        label: string;
        placeholder: string;
        required: boolean;
      };
    };
    submitText: string;
  };
  ctaButton: {
    text: string;
    link: string;
  };
  seo: {
    title: string;
    description: string;
  };
  contactPrompt?: string;
}

export interface FAQContent {
  title?: string;
  faqs: Array<{
    id: number;
    question: string;
    answer: string;
  }>;
  contactPrompt?: string;
}

export interface ArtistsContent {
  hero: {
    title: string;
    subtitle: string;
  };
  artists: Array<{
    id: string;
    name: string;
    photo: string;
    bio: {
      age: number;
      about: string[];
    };
    gallery: string[];
  }>;
  seo: {
    title: string;
    description: string;
  };
}

export interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
  };
  seo: {
    title: string;
    description: string;
  };
}

export interface MerchandiseContent {
  hero: {
    title: string;
    subtitle: string;
  };
  categories: {
    apparel: {
      title: string;
      description: string;
      items: Array<{
        id: string;
        name: string;
        price: number;
        image: string;
        description: string;
      }>;
    };
    accessories: {
      title: string;
      description: string;
      items: Array<{
        id: string;
        name: string;
        price: number;
        image: string;
        description: string;
      }>;
    };
    art: {
      title: string;
      description: string;
      items: Array<{
        id: string;
        name: string;
        price: number;
        image: string;
        description: string;
      }>;
    };
  };
  seo: {
    title: string;
    description: string;
  };
}

export interface GalleryContent {
  hero: {
    title: string;
    subtitle: string;
  };
  categories: {
    traditional: {
      title: string;
      description: string;
      images: string[];
    };
    color: {
      title: string;
      description: string;
      images: string[];
    };
    blackAndGray: {
      title: string;
      description: string;
      images: string[];
    };
    custom: {
      title: string;
      description: string;
      images: string[];
    };
  };
  seo: {
    title: string;
    description: string;
  };
}

// Content fetching functions
export async function getAboutContent(): Promise<AboutContent | null> {
  return fetchContent('about');
}

export async function getContactContent(): Promise<ContactContent | null> {
  return fetchContent('contact');
}

export async function getFAQContent(): Promise<FAQContent | null> {
  return fetchContent('faq');
}

export async function getArtistsContent(): Promise<ArtistsContent | null> {
  return fetchContent('artists');
}

export async function getArtistById(id: string): Promise<ArtistsContent['artists'][0] | null> {
  const content = await getArtistsContent();
  if (!content || !content.artists) return null;
  
  return content.artists.find(artist => artist.id === id) || null;
}

export async function getMerchandiseContent(): Promise<MerchandiseContent | null> {
  return fetchContent('merchandise');
}

export async function getGalleryContent(): Promise<GalleryContent | null> {
  return fetchContent('gallery');
}

export async function getHomeContent(): Promise<HomeContent | null> {
  // For now, return default content since there's no API endpoint for home content
  // In the future, you can create an API endpoint for home content
  return defaultHomeContent;
}

// Default content for fallbacks
export const defaultAboutContent: AboutContent = {
  hero: {
    title: "About Our Tattoo Studio",
    subtitle: "Where Art Meets Skin"
  },
  content: {
    mainParagraph: "Welcome to our premier tattoo studio, where artistry and professionalism come together to create exceptional body art.",
    secondParagraph: "Our team of talented artists specializes in various styles, from traditional to contemporary, ensuring each piece is a unique masterpiece.",
    thirdParagraph: "We maintain the highest standards of hygiene and use only the best quality inks and equipment to ensure your safety and satisfaction."
  },
  images: {
    mainArtist: {
      src: "/images/assets/dec_grandma.webp",
      alt: "Main Artist",
      caption: "Our Lead Artist"
    },
    bottomLeft: {
      src: "/images/assets/dec_GrandmaDuo.webp",
      alt: "Artist Duo",
      caption: "Artist Collaboration"
    },
    topRight: {
      src: "/images/assets/dec_grandmaDuo2.webp",
      alt: "Studio Art",
      caption: "Studio Artwork"
    }
  },
  ctaButton: {
    text: "Book Consultation",
    link: "/contactUs"
  },
  testimonials: {
    title: "What Our Clients Say",
    subtitle: "Real experiences from our valued clients"
  },
  seo: {
    title: "About Our Tattoo Studio | Professional Artists & Quality Work",
    description: "Learn about our tattoo studio, our talented artists, and our commitment to quality and safety. Book your consultation today."
  }
};

export const defaultContactContent: ContactContent = {
  hero: {
    title: "Contact Us",
    subtitle: "Get in Touch"
  },
  backgroundImage: "/images/assets/bg-1.webp",
  contactInfo: {
    address: "123 Studio Street, Art District, City 12345",
    phone: "+1 (555) 123-4567",
    email: "info@tattoostudio.com",
    whatsapp: "+1 (555) 123-4567",
    hours: "Tue-Sat: 11:00 AM - 7:00 PM"
  },
  map: {
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.123456789!2d-74.00594368459395!3d40.71278377933044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjAiTiA3NMKwMDAnMjUuNyJX!5e0!3m2!1sen!2sus!4v1234567890",
    title: "Find Our Studio"
  },
  form: {
    title: "Send Us a Message",
    fields: {
      name: {
        label: "Name",
        placeholder: "Your full name",
        required: true
      },
      email: {
        label: "Email",
        placeholder: "your.email@example.com",
        required: true
      },
      phone: {
        label: "Phone",
        placeholder: "Your phone number",
        required: false
      },
      message: {
        label: "Message",
        placeholder: "Tell us about your tattoo idea...",
        required: true
      }
    },
    submitText: "Send Message"
  },
  ctaButton: {
    text: "Book Appointment",
    link: "/contactUs"
  },
  seo: {
    title: "Contact Our Tattoo Studio | Book Your Appointment Today",
    description: "Get in touch with our tattoo studio to book your appointment. Find our location, hours, and contact information."
  }
};

export const defaultMerchandiseContent: MerchandiseContent = {
  hero: {
    title: "Exclusive Tattoo Merchandise",
    subtitle: "Wear Your Art with Pride"
  },
  categories: {
    apparel: {
      title: "Apparel",
      description: "Premium clothing featuring our unique tattoo designs",
      items: [
        {
          id: "tshirt-001",
          name: "Classic Studio Tee",
          price: 29.99,
          image: "/images/components/btn_apparel.webp",
          description: "Comfortable cotton t-shirt with our signature studio logo"
        },
        {
          id: "hoodie-001",
          name: "Artist Hoodie",
          price: 59.99,
          image: "/images/components/btn_apparel.webp",
          description: "Premium hoodie featuring exclusive artwork from our artists"
        }
      ]
    },
    accessories: {
      title: "Accessories",
      description: "Complete your look with our tattoo-inspired accessories",
      items: [
        {
          id: "hat-001",
          name: "Studio Cap",
          price: 24.99,
          image: "/images/components/btn_accessories.webp",
          description: "Adjustable cap with embroidered studio logo"
        },
        {
          id: "tote-001",
          name: "Art Tote Bag",
          price: 19.99,
          image: "/images/components/btn_accessories.webp",
          description: "Spacious tote bag featuring original tattoo artwork"
        }
      ]
    },
    art: {
      title: "Art & Prints",
      description: "Original artwork and high-quality prints from our artists",
      items: [
        {
          id: "print-001",
          name: "Flash Art Print",
          price: 39.99,
          image: "/images/components/btn_artnCraft.webp",
          description: "Limited edition print of original flash artwork"
        },
        {
          id: "canvas-001",
          name: "Gallery Canvas",
          price: 149.99,
          image: "/images/components/btn_artnCraft.webp",
          description: "Gallery-wrapped canvas featuring exclusive designs"
        }
      ]
    }
  },
  seo: {
    title: "Tattoo Merchandise | Apparel, Accessories & Art | Toby Myer Tattoo Studio",
    description: "Shop our exclusive tattoo merchandise including apparel, accessories, and art prints. High-quality products featuring unique designs from our talented artists."
  }
};

export const defaultFAQContent: FAQContent = {
  title: "Frequently Asked Questions",
  faqs: [
    {
      id: 1,
      question: "How do I book a tattoo appointment?",
      answer: "You can book an appointment by filling out our contact form, calling us directly, or visiting our studio in person."
    },
    {
      id: 2,
      question: "What is the minimum age for getting a tattoo?",
      answer: "You must be at least 18 years old to get a tattoo. Valid ID is required for all appointments."
    },
    {
      id: 3,
      question: "How much do tattoos cost?",
      answer: "Tattoo prices vary based on size, complexity, and placement. We offer consultations to provide accurate quotes."
    },
    {
      id: 4,
      question: "Do you accept walk-ins?",
      answer: "We accept walk-ins based on artist availability, but appointments are recommended to ensure you get the time and attention you deserve."
    },
    {
      id: 5,
      question: "What should I do to prepare for my tattoo appointment?",
      answer: "Get a good night's sleep, eat a meal before your appointment, and avoid alcohol for 24 hours. Wear comfortable clothing that allows easy access to the tattoo area."
    }
  ],
  contactPrompt: "Still have questions?"
};

export const defaultArtistsContent: ArtistsContent = {
  hero: {
    title: "Our Talented Artists",
    subtitle: "Meet the creative minds behind our art"
  },
  artists: [],
  seo: {
    title: "Our Tattoo Artists | Meet Our Talented Team",
    description: "Meet our talented team of tattoo artists, each with their unique style and expertise. Find the perfect artist for your next tattoo."
  }
};

export const defaultGalleryContent: GalleryContent = {
  hero: {
    title: "Tattoo Gallery",
    subtitle: "Our Artistic Masterpieces"
  },
  categories: {
    traditional: {
      title: "Traditional Tattoos",
      description: "Classic tattoo designs with bold lines and vibrant colors",
      images: []
    },
    color: {
      title: "Color Tattoos",
      description: "Vibrant and colorful tattoo designs that stand out",
      images: []
    },
    blackAndGray: {
      title: "Black & Gray Tattoos",
      description: "Sophisticated monochrome tattoo artistry",
      images: []
    },
    custom: {
      title: "Custom Designs",
      description: "Unique personalized tattoo creations",
      images: []
    }
  },
  seo: {
    title: "Tattoo Gallery | Our Tattoo Artwork | Toby Myer Tattoo Studio",
    description: "Explore our tattoo gallery showcasing our artists' work in traditional, color, black & gray, and custom tattoo designs."
  }
};

export const defaultHomeContent: HomeContent = {
  hero: {
    title: "Welcome to Our Tattoo Studio",
    subtitle: "Where Art Comes to Life"
  },
  seo: {
    title: "Tattoo Studio | Professional Artists & Custom Tattoos",
    description: "Premier tattoo studio with talented artists specializing in custom tattoos. Book your consultation today for unique body art."
  }
};