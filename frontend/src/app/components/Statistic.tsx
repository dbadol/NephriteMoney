import React from "react";
import { Flex, Card, Box } from "theme-ui";
import { InfoIcon } from "@app/components/InfoIcon";

type StatisticProps = {
  name: React.ReactNode;
  tooltip?: React.ReactNode;
  maxSize?: string;
};

export const Statistic: React.FC<StatisticProps> = ({ name, tooltip, maxSize, children }) => {
  return (
    <Flex sx={{ py: "6px",
     maxWidth:(maxWidth) => `${maxSize}`, alignItems: name =='TVL' ? 'baseline': 'center' }}>
      <Flex sx={{ alignItems: "center", flex: 8, fontWeight: 200, marginRight: '20px', justifyContent: 'flex-start' }}>
        <Flex sx={{ fontSize: "14px", fontWeight:700, color:'rgba(0,0,0,0.5)',whiteSpace:'nowrap' }}>{name}</Flex>
        {tooltip && <Box sx={{alignSelf:'flex-end'}}><InfoIcon size="xs" tooltip={<Card variant="tooltip">{tooltip}</Card>}/> </Box>}
      </Flex>
      <Flex sx={{ justifyContent: "flex-start",flex: 4, alignItems: "center", color:'#000'}}>{children}</Flex>
    </Flex>
  );
};
