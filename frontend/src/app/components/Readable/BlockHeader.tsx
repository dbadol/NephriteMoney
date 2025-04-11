import React from 'react';
import { Box, Flex, Heading, Text } from "theme-ui";
import IconNephrite from '@app/components/icons/icon-nephrite.svg';

type BlockHeaderProps = {
  title: string;
  icon?: React.ReactNode;
};

export const BlockHeader: React.FC<BlockHeaderProps> = ({ title, children, icon }) => (
  <Box sx={{ mx: 1, mb: 3 }}>
    <Flex sx={{ alignItems: "center", flexDirection: "column", mb: "10px" }}>
      <Box sx={{ mb: "20px" }}>{icon || <IconNephrite />}</Box>

      <Heading as="h2">{title}</Heading>
    </Flex>

    <Text sx={{ fontSize: 2 }}>{children}</Text>
  </Box>

);
