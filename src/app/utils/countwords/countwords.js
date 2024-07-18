export function countMessageWord(message) {
  const wordRegex = /\b\w+\b/g;
  const matches = message.match(wordRegex);
  return matches ? matches.length : 0;
}
