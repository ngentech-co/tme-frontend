import Link from 'next/link';
import { SITE } from '@/lib/constants';
import { articleSchema, breadcrumbSchema } from '@/lib/seo';

interface UseCase {
  slug: string;
  title: string;
  meta: string;
  intro: string;
  whyItMatters: string[];
  howItHelps: string[];
  examplePrompt: string;
  closingLine: string;
}

export const USE_CASES: UseCase[] = [
  {
    slug: 'letter-to-future-self',
    title: 'A letter to your future self',
    meta: 'Send a message to who you are becoming.',
    intro:
      'There are messages we can only write for the person we will be. Not who we were. Not who we are right now. The self five years from now, looking back and wondering if we made it.',
    whyItMatters: [
      'Future-you is the most important audience you can write for.',
      'A message sealed for years creates accountability without nagging.',
      'You will one day be grateful for the version of you that took the time.',
    ],
    howItHelps: [
      'Encrypt the letter in your browser with a key only time can release.',
      'Set a date — 1 year, 5 years, your 40th birthday, retirement day.',
      'Receive a quiet reminder on the day the math lets go.',
    ],
    examplePrompt:
      'Dear future me,\n\nIt is [today\'s date]. I am sitting at my desk and the light is [describe the light]. I want you to know that right now, I am working on [the thing]. I hope by the time you read this that [what you hope for].\n\nIf you have drifted, come back. If you have arrived, write back.\n\nLove,\nMe.',
    closingLine: 'A letter is a small ceremony.',
  },
  {
    slug: 'digital-time-capsule',
    title: 'A digital time capsule',
    meta: 'Bury something for the next generation.',
    intro:
      'A real time capsule is buried, then forgotten, then rediscovered. A digital time capsule is sealed, then released, then revealed. The result is the same — a moment preserved against the eroding force of time.',
    whyItMatters: [
      'Physical time capsules decay. Digital ones, encrypted properly, last as long as the math holds.',
      'They make excellent gifts for milestones: births, graduations, weddings.',
      'They give children and grandchildren a window into who you were.',
    ],
    howItHelps: [
      'Upload photos, letters, songs, voice memos, anything you want preserved.',
      'Seal them with an unlock date 5, 10, 25 years in the future.',
      'Share the recovery key with the recipient, or keep it for yourself.',
    ],
    examplePrompt:
      'For my daughter, on her 18th birthday.\n\nI am writing this the day you were born. The world is [a snapshot]. I want you to know what it felt like the day you arrived.',
    closingLine: 'Bury it. Forget it. Find it later.',
  },
  {
    slug: 'sealed-secrets-and-confessions',
    title: 'Sealed secrets and confessions',
    meta: 'Private by design. Read only by you, on your terms.',
    intro:
      'Some things are not for sharing. Some things are not for right now. tomorrowme gives you a place to put them — encrypted on your own device, time-locked against the moment you choose to be ready.',
    whyItMatters: [
      'A secret that waits is a different kind of secret.',
      'You can write the unsendable thing to read later, when you are ready.',
      'Time gives you distance. Distance gives you clarity.',
    ],
    howItHelps: [
      'Write the thing you cannot say yet.',
      'Encrypt it. Lock it for a year, or five.',
      'When you read it again, the past is fixed but the future has changed.',
    ],
    examplePrompt:
      'What I did not say.\n\nI was afraid to tell you then. I am still afraid. But here it is, sealed, so that when I read this in [X years] I will remember how it felt to be this honest and this scared.',
    closingLine: 'Write it. Seal it. Forgive yourself in advance.',
  },
  {
    slug: 'unreleased-music',
    title: 'Unreleased music and unreleased media',
    meta: 'Drop a song on its 10th birthday.',
    intro:
      'Some work is not ready. Some work will not be ready for years. A song you wrote this winter might only find its audience in 2034. A film you are finishing might need a decade to age into its final form. tomorrowme lets you set the release date and trust it.',
    whyItMatters: [
      'Artists lose work. Hard drives die. Computers are stolen. Tomorrowme is a vault that does not depend on a single machine.',
      'A scheduled drop is a story. "I wrote this song in 2024, sealed it, and released it on its 10th birthday." Audiences love that story.',
      'It removes the option to release something before it is ready.',
    ],
    howItHelps: [
      'Upload the master file (audio, video, image, manuscript).',
      'Set the unlock date — could be the work anniversary, could be a meaningful day.',
      'tomorrowme encrypts it. The file lives sealed until the date arrives.',
    ],
    examplePrompt: 'For my future fans — and for me.\n\nThis song was written on [date]. It will be released on [date]. Until then, only time can hear it.',
    closingLine: 'Let time release it.',
  },
  {
    slug: 'family-time-capsule',
    title: 'A family time capsule',
    meta: 'A shared vault for your people.',
    intro:
      'A family is a story told across generations. tomorrowme lets you add a chapter that will be read by the people you love, on a day of your choosing. Photos, voice memos, recipes, jokes, the sound of your grandmother\'s laugh.',
    whyItMatters: [
      'Memories fade. Voices age out. Time capsules hold them.',
      'A surprise reveal on a milestone birthday is a story for the rest of their lives.',
      'You do not have to be alive when it opens. That is the point.',
    ],
    howItHelps: [
      'Each family member contributes their piece — text, photo, voice note.',
      'Set a single unlock date (or each person\'s unlock date).',
      'Share the recovery bookmark URL with the family.',
    ],
    examplePrompt: 'For the family, 25 years from now.\n\nThis is who we were in 2026. This is what the kitchen smelled like. This is how we said goodbye at the door.',
    closingLine: 'A family time capsule is a love letter across time.',
  },
  {
    slug: 'anniversary-surprises',
    title: 'Anniversary surprises',
    meta: 'A message that opens on a specific date.',
    intro:
      'Anniversaries are small private holidays. A message sealed to open on a specific anniversary — wedding, first date, sobriety date, the day you adopted your dog — is the most romantic form of scheduling.',
    whyItMatters: [
      'The thought that survives the test of time is the one that took effort to preserve.',
      'A surprise message on a future date is more powerful than a gift on the day.',
      'It says: I am thinking about our future together, and I am planning for it.',
    ],
    howItHelps: [
      'Write the letter or record the message.',
      'Set the unlock date to the anniversary.',
      'We will remind you, gently, when it is ready.',
    ],
    examplePrompt: 'Dear [name],\n\nThree years ago today we [event]. I want you to know, when you read this on our [Xth] anniversary, that [what you want them to know].',
    closingLine: 'Set the date. Forget about it. Watch their face.',
  },
];

export default function UseCaseTemplate({ uc }: { uc: UseCase }) {
  const ldArticle = articleSchema({
    title: uc.title,
    description: uc.meta,
    url: `https://${SITE.domain}/use-cases/${uc.slug}`,
    datePublished: '2026-08-01',
  });
  const ldBreadcrumb = breadcrumbSchema([
    { name: 'Home', url: `https://${SITE.domain}` },
    { name: 'Use cases', url: `https://${SITE.domain}/use-cases` },
    { name: uc.title, url: `https://${SITE.domain}/use-cases/${uc.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumb) }}
      />
      <main className="container-page py-24 sm:py-32">
        <div className="max-w-prose mx-auto">
          <p className="mono mb-6">use case</p>
          <h1 className="display-lg mb-8 text-balance">{uc.title}</h1>
          <p className="body-lg text-ink-muted mb-16">{uc.meta}</p>

          <p className="body-lg text-ink mb-12">{uc.intro}</p>

          <h2 className="display-sm mb-6">Why it matters</h2>
          <ul className="space-y-4 mb-12">
            {uc.whyItMatters.map((item) => (
              <li key={item} className="flex gap-4 body-lg">
                <span className="text-seal">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h2 className="display-sm mb-6">How tomorrowme helps</h2>
          <ul className="space-y-4 mb-12">
            {uc.howItHelps.map((item) => (
              <li key={item} className="flex gap-4 body-lg">
                <span className="text-seal">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h2 className="display-sm mb-6">A prompt to start with</h2>
          <div className="card-paper p-8 mb-12">
            <pre className="font-mono text-body whitespace-pre-wrap text-ink">
              {uc.examplePrompt}
            </pre>
          </div>

          <p className="display-sm text-center mb-12 text-balance">{uc.closingLine}</p>

          <div className="text-center">
            <Link href="/seal" className="btn-primary text-base">
              Seal your own
            </Link>
            <p className="mt-6 body-sm text-ink-soft">
              Free forever · private by design
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
