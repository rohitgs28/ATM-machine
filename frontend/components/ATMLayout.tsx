import React from 'react';
import { Box, Image as Img, Flex } from '@chakra-ui/react';
import { ATM_SIGN, GRAFFITI, STICKER_GRAF, SYSTEMS } from '../constants/images';
import CardLogos from './CardLogos';

interface ATMLayoutProps {
  cardNetwork?: string;
  leftButtonHandlers?: Array<(() => void) | undefined>;
  rightButtonHandlers?: Array<(() => void) | undefined>;
  children: React.ReactNode;
}

/**
 * Main layout wrapper for the ATM UI: central container, top sign, left/right side buttons,
 * card logos row, screen area (children), and decorative images.
 */

const ATMLayout: React.FC<ATMLayoutProps> = ({
  cardNetwork,
  children,
  leftButtonHandlers,
  rightButtonHandlers,
}) => {

   // vertical positions for the larger side buttons
  const BIG_TOPS = [220, 250, 280, 310];
  // vertical positions for the small slat/line indicators
  const LINE_TOPS = [230, 260, 290, 320];

  // styling constants reused across the layout
  const BTN_BG = 'atm.sideBtn';
  const BTN_TOP = '1px solid rgba(255,255,255,.6)';
  const BTN_BOTTOM = '2px solid #9aa0a8';
  const SLAT_COLOR = '#9aa0a8';
  const RADIUS = '5px';

  return (
    <Flex minH="100vh" align="center" justify="center" bg="atm.purple" pt={180} >
      <Box
        position="relative"
        w={['320px', '360px']}
        bg="white"
        borderRadius="8px"
        pt="45px"
        minH={{ base: '640px', md: '900px' }}
        overflow="visible"
      >
        {/* Top sign */}
        <Box
          position="absolute"
          top="-110px"
          left="50%"
          transform="translateX(-50%)"
          bg="atm.signBlue"
          w={['240px', '280px', '420px']}
          h="120px"
          borderRadius="18px"
          boxShadow="md"
          overflow="visible"
        >
          <Img src={ATM_SIGN} alt="ATM sign" h="100%" objectFit="cover" pl="60px" />
          <Img
            src={GRAFFITI}
            alt="Graffiti"
            position="absolute"
            right="10%"
            top="22%"
            w="46%"
            opacity={0.9}
            pointerEvents="none"
          />
          <Box
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
            w="85%"
            h="6px"
            bg="#bdbdbd"
          />
        </Box>

        {BIG_TOPS.map((top, i) => {
          const handler = leftButtonHandlers?.[i];
          return (
            <React.Fragment key={`left-${i}`}>
              <Box
                position="absolute"
                left="3px"
                top={`${top}px`}
                w="36px"
                h="20px"
                bg={BTN_BG}
                borderRadius={RADIUS}
                borderTop={BTN_TOP}
                borderBottom={BTN_BOTTOM}
                cursor={handler ? 'pointer' : 'default'}
                onClick={handler}
              />
              <Box
                position="absolute"
                left="40px"
                top={`${LINE_TOPS[i]}px`}
                w="15px"
                h="3px"
                borderRadius="6px"
                bg={SLAT_COLOR}
                cursor={handler ? 'pointer' : 'default'}
                onClick={handler}
              />
            </React.Fragment>
          );
        })}

        {/* RIGHT side buttons + lines */}
        {BIG_TOPS.map((top, i) => {
          const handler = rightButtonHandlers?.[i];
          return (
            <React.Fragment key={`right-${i}`}>
              <Box
                position="absolute"
                right="3px"
                top={`${top}px`}
                w="36px"
                h="20px"
                bg={BTN_BG}
                borderRadius={RADIUS}
                borderTop={BTN_TOP}
                borderBottom={BTN_BOTTOM}
                cursor={handler ? 'pointer' : 'default'}
                onClick={handler}
              />
              <Box
                position="absolute"
                right="40px"
                top={`${LINE_TOPS[i]}px`}
                w="15px"
                h="3px"
                borderRadius="6px"
                bg={SLAT_COLOR}
                cursor={handler ? 'pointer' : 'default'}
                onClick={handler}
              />
            </React.Fragment>
          );
        })}

        <Box px="8" mb="2" mt="-6">
          <CardLogos network={cardNetwork} />
        </Box>

        <Box px="12">
          <Box
            border="3px solid"
            borderColor="atm.strip"
            bg="atm.screenBlue"
            borderRadius="4px"
            width="100%"
            boxShadow="inset 0 0 0 2px rgba(255,255,255,.3)"
            p="4"
          >
            <Box minH="260px" position="relative">
              {children}
            </Box>
          </Box>
        </Box>

        <Img
          src={SYSTEMS}
          alt="Systems logo"
          position="absolute"
          right="50px"
          w="auto"
          pt="10px"
          opacity={1.0}
          pointerEvents="none"
        />

        <Img
          src={STICKER_GRAF}
          alt="sticker"
          position="absolute"
          left="24px"
          top="330px"
          w="125px"
          pointerEvents="none"
        />
      </Box>
    </Flex>
  );
};

export default ATMLayout;
