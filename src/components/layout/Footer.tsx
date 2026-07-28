import { Mail, MapPin, Phone } from 'lucide-react';
import { Container } from './Container';
import { useI18n } from '../../i18n/i18nContext';

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.34.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.43-2.7 5.41-5.26 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.51 10.51 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

const CONTACT = {
  email: 'alaa.abdelaziz04@eng-st.cu.edu.eg',
  phone: '+201090492332',
  phoneDisplay: '01090492332',
  linkedin: 'https://www.linkedin.com/in/alaa-abdelaziz-3a50b3318/',
  github: 'https://github.com/AlaaHaytham58',
};

const linkClasses =
  'flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-neutral-100 transition-colors hover:border-accent-500 hover:bg-white/10 hover:text-accent-500';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-16 bg-primary-600">
      <Container className="flex flex-col gap-4 py-10">
        <h2 className="font-heading text-lg font-bold text-neutral-50">{t.footer.aboutTitle}</h2>

        <div className="max-w-2xl">
          <p className="font-medium text-neutral-50">{t.footer.name}</p>
          <p className="mt-1 flex items-center gap-1 text-sm text-neutral-300">
            <MapPin size={14} />
            {t.footer.location}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-300">{t.footer.bio}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a href={`mailto:${CONTACT.email}`} aria-label="Email" className={linkClasses}>
            <Mail size={16} />
            {CONTACT.email}
          </a>
          <a href={`tel:${CONTACT.phone}`} aria-label="Phone" className={linkClasses}>
            <Phone size={16} />
            {CONTACT.phoneDisplay}
          </a>
          <a
            href={CONTACT.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className={linkClasses}
          >
            <LinkedinIcon />
            LinkedIn
          </a>
          <a
            href={CONTACT.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className={linkClasses}
          >
            <GithubIcon />
            GitHub
          </a>
        </div>

        <p className="mt-4 text-xs text-neutral-400">{t.footer.builtWith}</p>
      </Container>
    </footer>
  );
}
