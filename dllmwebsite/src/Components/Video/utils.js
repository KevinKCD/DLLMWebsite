export const sports = [
  'Badminton',
  'Football',
  'Tennis',
  'Running',
  'Volleyball',
];

export function getYouTubeId(url) {
  if (!url) return null;
  const regExp = new RegExp(
    '(?:youtube\\.com/(?:watch\\?v=|embed/)|youtu\\.be/)([^&?/]+)'
  );
  const match = url.match(regExp);
  return match ? match[1] : null;
}

const utils = { sports, getYouTubeId };
export default utils;
