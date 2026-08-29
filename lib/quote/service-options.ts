export const quoteServiceOptionIds = ["qcdd", "other"] as const;

export type QuoteServiceOptionId = (typeof quoteServiceOptionIds)[number];

export function isQuoteServiceOptionId(
  value: string,
): value is QuoteServiceOptionId {
  return quoteServiceOptionIds.includes(value as QuoteServiceOptionId);
}
