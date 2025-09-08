import React from 'react';
import { Box, Image as Img } from '@chakra-ui/react';
import { CREDITCARD_SPRITE } from '../constants/images';

/**
 * Renders a horizontal sprite containing multiple credit-card logos and dims
 * (overlays) the unused portions of the sprite so that a single network can be
 * visually highlighted.
 */
const CardLogos: React.FC<{ network?: string }> = ({ network }) => {
  const lower = network?.toLowerCase() ?? '';

  /**
   * These values correspond to fractional positions across the full sprite width (0..1).
   */
  const dimsByNetwork: Record<string, { start: number; end: number }> = {
    star: { start: 0.0, end: 0.17 },
    pulse: { start: 0.17, end: 0.37 },
    maestro: { start: 0.37, end: 0.49 },
    mastercard: { start: 0.52, end: 0.65 },
    master: { start: 0.46, end: 0.64 },
    plus: { start: 0.64, end: 0.79 },
    visa: { start: 0.78, end: 1.0 },
  };

  let highlightRange: { start: number; end: number } | null = null;
  for (const key of Object.keys(dimsByNetwork)) {
    if (lower.includes(key)) {
      highlightRange = dimsByNetwork[key];
      break;
    }
  }

  const overlays: Array<{ left: string; width: string }> = [];
  if (highlightRange) {
    const { start, end } = highlightRange;
    if (start > 0) {
      overlays.push({ left: '0%', width: `${(start * 100).toFixed(2)}%` });
    }
    if (end < 1) {
      const leftPct = (end * 100).toFixed(2);
      const widthPct = ((1 - end) * 100).toFixed(2);
      overlays.push({ left: `${leftPct}%`, width: `${widthPct}%` });
    }
  }

  return (
    <Box position="relative" h="21px" overflow="hidden">
      <Img
        src={CREDITCARD_SPRITE}
        alt="logos"
        w="85%"
        h="21px"
        objectFit="cover"
        objectPosition="top"
        transform="translateX(18px)"
      />
      {overlays.map((style, idx) => (
        <Box
          key={idx}
          data-testid="dim-overlay"
          position="absolute"
          top="0"
          bottom="0"
          left={style.left}
          width={style.width}
          bg="rgba(250, 250, 250, 0.95)"
          filter="grayscale(100%)"
          pointerEvents="none"
        />
      ))}
    </Box>
  );
};

export default CardLogos;
