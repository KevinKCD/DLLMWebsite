// utils.ts

// Array of sports
export const sports: string[] = [
  'Badminton',
  'Football',
  'Tennis',
  'Running',
  'Volleyball',
];

// Function to extract YouTube video ID from URL
export function getYouTubeId(url: string | undefined | null): string | null {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

// Default export (optional)
const utils = { sports, getYouTubeId };
export default utils;