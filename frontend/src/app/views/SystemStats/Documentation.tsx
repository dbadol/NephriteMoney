import React from 'react';
import { styled } from '@linaria/react';
import { Card, Heading, Link, Box, Text, Flex } from 'theme-ui';
import { IconExternalLink } from '@app/components/icons';

const ExternalLink = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-weight: 700;
`;
const ExternalLinkText = styled.span`
  font-family: 'SFProDisplay';
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  line-height: 17px;
  color: #2a5a01;
  margin-right: 4px;
`;
export const Documentation: React.FC = () => {
  return (
    <Card
      sx={{
        p: '20px 10px',
        m: '0px !important',
        minWidth: '280px',
        position: 'static',
      }}
    >
      <Heading
        as="h3"
        sx={{
          color: '#000',
          letterSpacing: '2px',
          fontWeight: 800,
          mb: '16px',
          whiteSpace: 'nowrap',
        }}
      >
        NEPHRITE DOCUMENTATION
      </Heading>
      <Flex sx={{ justifyContent: 'center' }}>
        <Box sx={{ mr: 4 }}>
          <ExternalLink
            href="https://drive.proton.me/urls/SK5DXN4DNG#ALVvWMTkfayD"
            target="_blank"
          >
            <ExternalLinkText>Manifesto</ExternalLinkText> <IconExternalLink />
          </ExternalLink>
        </Box>
        <Box>
          <ExternalLink href="#">
            <ExternalLinkText>Audit</ExternalLinkText> <IconExternalLink />
          </ExternalLink>
        </Box>
      </Flex>
    </Card>
  );
};
