import React from "react";
import { Box, Flex, Text } from "theme-ui";

interface NotifyMessageProps {
  color: string;
  children: React.ReactNode,
  italic?: boolean;
}
export const NotifyMessage: React.FC<NotifyMessageProps> = ({ children, color, italic }) => (
  <Box
    sx={{
      display: "inline-block",
      borderRadius: '4px',
      mb: [2, 3],
      bg: color
    }}
  >
    <Flex sx={{ alignItems: "center" }}>
      <Text sx={{ color:'rgba(0,0,0,0.7)', padding: '4px 10px', fontStyle: italic ? 'italic' : 'normal' }}>{children}</Text>
    </Flex>
  </Box>
);
