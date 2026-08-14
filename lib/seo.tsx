import { SITE } from './constants';

/**
 * JSON-LD structured data builders. Emit as <script type="application/ld+json">.
 */

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data);
  return (
    <script
      {...({ type: 'application/ld+json' } as Record<string, string>)}
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.finalUrl,
    logo: `${SITE.finalUrl}/logo.png`,
    sameAs: [
      `https://twitter.com/${SITE.twitter.replace('@', '')}`,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: SITE.email,
      contactType: 'customer support',
    },
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.finalUrl,
    description:
      'Seal digital messages, secrets, letters, or unreleased media to your future self. Cryptographically hidden until an exact future date.',
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE.finalUrl}/explore?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function softwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE.name,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    description:
      'A privacy-first time capsule app. Seal messages to your future self with cryptographic time-lock encryption.',
    url: SITE.finalUrl,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    featureList: [
      'Client-side encryption',
      'Time-lock cryptography (Drand)',
      'Anonymous accounts',
      'Passkey authentication',
      'Recovery key backup',
      'Self-custody',
    ],
  };
}

export function faqSchema(
  items: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function howToSchema(
  steps: Array<{ name: string; text: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to seal a message to your future self',
    description:
      'A three-step process to encrypt and time-lock a digital capsule using tomorrowme.',
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: {
      '@type': 'Person',
      name: opts.authorName ?? SITE.name,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE.finalUrl}/logo.png`,
      },
    },
    image: opts.image ?? `${SITE.finalUrl}/og/default.png`,
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function creativeWorkSchema(opts: {
  title: string;
  unlockAt: string;
  url: string;
  authorName?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: opts.title,
    url: opts.url,
    dateCreated: opts.url,
    datePublished: opts.unlockAt,
    isAccessibleForFree: true,
    author: {
      '@type': 'Person',
      name: opts.authorName ?? SITE.name,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
    },
  };
}

export function techArticleSchema(opts: {
  title: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name },
    inLanguage: 'en',
    about: [
      { '@type': 'Thing', name: 'Time-lock cryptography' },
      { '@type': 'Thing', name: 'Drand network' },
      { '@type': 'Thing', name: 'Threshold cryptography' },
    ],
  };
}
