import React from 'react';
import { Box, Flex, Heading, SxProp, Text } from "theme-ui";

export const BlockBody: React.FC<SxProp> = ({ sx, children }) => (
    <Flex sx={{ py: ["30px"], px: ["20px"], alignItems: "stretch", justifyContent: "center", height: "100%", flex:"100", ...sx }}>
        <Flex variant="layout.block">
            {children}
        </Flex>
    </Flex>
);