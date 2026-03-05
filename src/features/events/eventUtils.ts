export const SPORT_COLOURS: Record<string, string> = {
  Football: '#2d6a4f',
  Basketball: '#e76f51',
  Tennis: '#c9a227',
  Running: '#457b9d',
  Volleyball: '#6a4c93',
  Badminton: '#2ec4b6',
  Other: '#64748b',
};

export const getSportColour = (sport: string): string =>
  SPORT_COLOURS[sport] || '#2563eb';

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatTime = (timeStr?: string): string => {
  if (!timeStr) return '—';

  const fmt = (t: string) => {
    const [h, m] = t.trim().split(':');
    const d = new Date();
    d.setHours(Number(h), Number(m));

    return d.toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true, // 👈 24-hour format
    });
  };

  if (timeStr.includes('-')) {
    const [start, end] = timeStr.split('-');
    return `${fmt(start)} – ${fmt(end)}`;
  }

  return fmt(timeStr);
};
