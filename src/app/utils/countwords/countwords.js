export function countMessageWord(message) {
  if (typeof message !== "string") {
    return 0; // Handle non-string inputs gracefully
  }

  const wordRegex = /\b\w+\b/g;
  const matches = message.match(wordRegex);
  return matches ? matches.length : 0;
}
