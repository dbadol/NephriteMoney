import * as React from 'react';
import { Box, Flex, Text } from "theme-ui";

import { Icon } from "./Icon";

export const Warning: React.FC = ({ children }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",

      mb: [2, 3],
      p: 3,

      border: 1,
      borderRadius: "8px",
      borderColor: "warning",
      boxShadow: 2
    }}
  >
    <Flex sx={{ alignItems: "center" }}>
      <Icon name="exclamation-triangle" size="lg" />
      <Text sx={{ ml: 2 }}>{children}</Text>
    </Flex>
  </Box>
);
