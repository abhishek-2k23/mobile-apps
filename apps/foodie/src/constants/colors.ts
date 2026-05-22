// ─── Foodie Design System ─────────────────────────────────────
// Theme: Warm Charcoal + Amber-Gold  (completely distinct from prior themes)

export const C = {
  // Backgrounds
  bg:        '#0C0906',
  bg2:       '#1A1008',

  // Glass cards — amber-tinted (warm glass feel)
  card:      'rgba(250,190,60,0.05)',
  card2:     'rgba(250,190,60,0.10)',
  cardN:     'rgba(255,255,255,0.06)',   // neutral (no tint)

  // Borders
  border:    'rgba(250,190,60,0.14)',
  border2:   'rgba(250,190,60,0.26)',
  borderN:   'rgba(255,255,255,0.10)',

  // Primary accent — amber-gold
  amber:     '#F5A623',
  amberLo:   'rgba(245,166,35,0.18)',
  amberMid:  'rgba(245,166,35,0.30)',

  // Secondary accent — ruby-red (for non-veg, CTAs)
  ruby:      '#E8436A',
  rubyLo:    'rgba(232,67,106,0.16)',

  // Tertiary — emerald green (for veg)
  emerald:   '#00D97E',
  emeraldLo: 'rgba(0,217,126,0.15)',

  // Text
  text:      '#FFFFFF',
  text80:    'rgba(255,255,255,0.80)',
  text60:    'rgba(255,255,255,0.60)',
  text40:    'rgba(255,255,255,0.40)',
  text20:    'rgba(255,255,255,0.20)',
  text10:    'rgba(255,255,255,0.10)',
} as const;

type Gradient = readonly [string, string, ...string[]];

export const GRAD: Record<string, Gradient> = {
  page:    ['#0C0906', '#1A1008', '#0C0906'],
  amber:   ['#F5A623', '#E8436A'],
  amberH:  ['#F5A623', '#D4890A'],
  hero:    ['rgba(12,9,6,0.05)', 'rgba(12,9,6,0.78)', '#0C0906'],
  heroTop: ['rgba(12,9,6,0.55)', 'transparent'],
  dark:    ['transparent', 'rgba(12,9,6,0.95)'],
  tab:     ['rgba(12,9,6,0.97)', 'rgba(12,9,6,0.99)'],
};
