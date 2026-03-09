import { describe, expect, it } from 'vitest';
import { getRecommendations } from '@/lib/recommendations';

describe('recommendation service', () => {
  it('returns scored recommendations with reason labels', async () => {
    const feed = await getRecommendations({}, 4);
    expect(feed.length).toBeGreaterThan(0);
    feed.forEach((item) => {
      expect(typeof item.score).toBe('number');
      expect(item.reason.length).toBeGreaterThan(0);
    });
  });

  it('respects region filter for Gangnam', async () => {
    const gangnam = await getRecommendations({ region: 'Gangnam' }, 5);
    expect(gangnam.every((item) => item.regionName === 'Gangnam')).toBe(true);
  });

  it('applies style score filter correctly', async () => {
    const highStyle = await getRecommendations({ minStyleScore: 85 }, 5);
    expect(highStyle.every((item) => item.styleScore >= 85)).toBe(true);
  });
});
