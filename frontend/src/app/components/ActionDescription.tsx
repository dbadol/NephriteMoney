import React from "react";
import { Box, Flex, Text } from "theme-ui";
import { Icon } from "@app/components/Icon";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

interface ActionDescriptionProps {
  children: React.ReactNode[] | React.ReactNode | ReactJSXElement;
  bgColor?: string;
  fontStyle?: string;
}
export const ActionDescription: React.FC<ActionDescriptionProps> = ({ children, bgColor = 'rgba(0,0,0,0.1)', fontStyle }) => (
  <Box
    sx={{
      display: "block",
      borderRadius: '4px',
      mb: [2, 3],
      bg: bgColor,
      width: 'fit-content'
    }}
  >
    <Flex sx={{ alignItems: "center" }}>
      <Text sx={{ color:'rgba(0,0,0,0.7)', fontStyle:fontStyle, padding: '4px 10px',width:'100%' }}>{children}</Text>
    </Flex>
  </Box>
);


export const Amount: React.FC = ({ children }) => (
  <Text sx={{color:'rgba(0,0,0)',fontWeight: 600, fontStyle:'italic'}}>{children}</Text>
);
