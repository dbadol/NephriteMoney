import React from "react";
import { Box, Flex, Text } from "theme-ui";

interface ErrorDescripionProps  {
  fontStyle?:string,
  children: React.ReactNode
}
export const ErrorDescription: React.FC<ErrorDescripionProps> = ({ children, fontStyle }) => (
  <Box
    sx={{
      display: "inline-block",
      borderRadius: '4px',
      mb: [2, 3],
      bg: "rgba(198, 62, 62, 0.5)",
      fontStyle: fontStyle ?? 'normal',
    }}
  >
    <Flex sx={{ alignItems: "center" }}>
      <Text sx={{ color:'rgba(0,0,0,0.7)', padding: '4px 10px' }}>{children}</Text>
    </Flex>
  </Box>
);
