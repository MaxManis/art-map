export const extractTimeAndText = (input) => {
  const regex = /(\d{1,2}:\d{2}(?::\d{2})?)\s*([^\s]*)/;
  const match = input.match(regex);

  if (match) {
    const time = match[1];
    const textAfterTime = match[2] || null;
    return { time, textAfterTime };
  }

  return null;
};
