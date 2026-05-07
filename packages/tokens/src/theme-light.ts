// Light theme source-of-truth. Re-exports existing color tokens as a single
// shape so build-css.ts can iterate light/dark uniformly.
import { surfaces, borders, primary, secondary, text } from './colors';
import { statusTokens } from './status';

export const themeLight = {
  surfaces,
  borders,
  primary,
  secondary,
  text,
  statusTokens,
} as const;
