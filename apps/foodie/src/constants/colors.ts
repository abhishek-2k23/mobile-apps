export interface AppColors {
  bg: string; bg2: string;
  card: string; card2: string; cardN: string;
  border: string; border2: string; borderN: string;
  amber: string; amberLo: string; amberMid: string;
  ruby: string; rubyLo: string;
  emerald: string; emeraldLo: string;
  text: string; text80: string; text60: string; text40: string; text20: string; text10: string;
}

type Gradient = readonly [string, string, ...string[]];
export type AppGrad = Record<string, Gradient>;

// ─── Non-veg theme — soft red + black gradient ─────────────────
export const NONVEG_COLORS: AppColors = {
  bg: '#0D0607',  bg2: '#1A0D0D',
  card:    'rgba(232,114,114,0.06)',  card2:   'rgba(232,114,114,0.12)',  cardN:   'rgba(255,255,255,0.06)',
  border:  'rgba(232,114,114,0.16)', border2: 'rgba(232,114,114,0.28)', borderN: 'rgba(255,255,255,0.10)',
  amber:   '#E87272',  amberLo:  'rgba(232,114,114,0.14)', amberMid: 'rgba(232,114,114,0.32)',
  ruby:    '#E8436A',  rubyLo:   'rgba(232,67,106,0.16)',
  emerald: '#00D97E',  emeraldLo:'rgba(0,217,126,0.15)',
  text:    '#FFFFFF',  text80:   'rgba(255,255,255,0.80)', text60:   'rgba(255,255,255,0.60)',
  text40:  'rgba(255,255,255,0.40)', text20: 'rgba(255,255,255,0.20)', text10: 'rgba(255,255,255,0.10)',
};

export const NONVEG_GRAD: AppGrad = {
  page:    ['#0D0607', '#1A0D0D', '#0D0607'],
  amber:   ['#E87272', '#D45454'],
  amberH:  ['#E87272', '#C85050'],
  hero:    ['rgba(13,6,7,0.05)', 'rgba(13,6,7,0.78)', '#0D0607'],
  heroTop: ['rgba(13,6,7,0.55)', 'transparent'],
  dark:    ['transparent', 'rgba(13,6,7,0.95)'],
  tab:     ['rgba(13,6,7,0.97)', 'rgba(13,6,7,0.99)'],
};

// ─── Veg theme — soft green + black gradient ───────────────────
export const VEG_COLORS: AppColors = {
  bg: '#060C07',  bg2: '#0D1A0E',
  card:    'rgba(116,200,122,0.06)',  card2:   'rgba(116,200,122,0.12)',  cardN:   'rgba(255,255,255,0.06)',
  border:  'rgba(116,200,122,0.16)', border2: 'rgba(116,200,122,0.28)', borderN: 'rgba(255,255,255,0.10)',
  amber:   '#74C87A',  amberLo:  'rgba(116,200,122,0.14)', amberMid: 'rgba(116,200,122,0.32)',
  ruby:    '#E8436A',  rubyLo:   'rgba(232,67,106,0.16)',
  emerald: '#00D97E',  emeraldLo:'rgba(0,217,126,0.15)',
  text:    '#FFFFFF',  text80:   'rgba(255,255,255,0.80)', text60:   'rgba(255,255,255,0.60)',
  text40:  'rgba(255,255,255,0.40)', text20: 'rgba(255,255,255,0.20)', text10: 'rgba(255,255,255,0.10)',
};

export const VEG_GRAD: AppGrad = {
  page:    ['#060C07', '#0D1A0E', '#060C07'],
  amber:   ['#74C87A', '#4CAF52'],
  amberH:  ['#74C87A', '#56B85C'],
  hero:    ['rgba(6,12,7,0.05)', 'rgba(6,12,7,0.78)', '#060C07'],
  heroTop: ['rgba(6,12,7,0.55)', 'transparent'],
  dark:    ['transparent', 'rgba(6,12,7,0.95)'],
  tab:     ['rgba(6,12,7,0.97)', 'rgba(6,12,7,0.99)'],
};

// ─── All (neutral) theme — classic dark with gold accent ──────
export const ALL_COLORS: AppColors = {
  bg: '#0C0906',  bg2: '#1A1510',
  card:    'rgba(255,255,255,0.05)',  card2:   'rgba(255,255,255,0.09)',  cardN:   'rgba(255,255,255,0.05)',
  border:  'rgba(255,255,255,0.11)', border2: 'rgba(255,255,255,0.18)', borderN: 'rgba(255,255,255,0.09)',
  amber:   '#F5A623',  amberLo:  'rgba(245,166,35,0.13)', amberMid: 'rgba(245,166,35,0.30)',
  ruby:    '#E8436A',  rubyLo:   'rgba(232,67,106,0.16)',
  emerald: '#00D97E',  emeraldLo:'rgba(0,217,126,0.15)',
  text:    '#FFFFFF',  text80:   'rgba(255,255,255,0.80)', text60:   'rgba(255,255,255,0.60)',
  text40:  'rgba(255,255,255,0.40)', text20: 'rgba(255,255,255,0.20)', text10: 'rgba(255,255,255,0.10)',
};

export const ALL_GRAD: AppGrad = {
  page:    ['#0C0906', '#140E0A', '#0C0906'],
  amber:   ['#F5A623', '#E08020'],
  amberH:  ['#F7C048', '#E08020'],
  hero:    ['rgba(12,9,6,0.05)', 'rgba(12,9,6,0.78)', '#0C0906'],
  heroTop: ['rgba(12,9,6,0.55)', 'transparent'],
  dark:    ['transparent', 'rgba(12,9,6,0.95)'],
  tab:     ['rgba(12,9,6,0.97)', 'rgba(12,9,6,0.99)'],
};

// ─── Legacy re-exports (default = non-veg) ─────────────────────
export const C = NONVEG_COLORS;
export const GRAD = NONVEG_GRAD;
