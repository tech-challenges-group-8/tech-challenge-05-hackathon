/**
 * Converts a rem token string (e.g. "1.5rem" or "1.5") to pixels,
 * using a base of 16 px — matching the @mindease/ui-kit token convention.
 *
 * @example rem(space[4]) // → 64
 */
export const rem = (value: string): number => Number.parseFloat(value) * 16;

/**
 * Extracts the integer pixel value from a design token string
 * (e.g. the output of `radii` tokens like "8px", "0.5rem", or plain "8").
 *
 * @example extractPixels(radii.md) // → 8
 */
export const extractPixels = (value: string): number => Number.parseInt(value, 10);
