import React from "react";
import Tippy, { TippyProps } from "@tippyjs/react";
import { Icon } from "./Icon";
import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import InfoIconSvg from '@app/components/icons/icon-info.svg';
import { Flex } from "theme-ui";

export type InfoIconProps = Pick<TippyProps, "placement"> &
  Pick<FontAwesomeIconProps, "size"> & {
    tooltip: React.ReactNode;
    width?: string;
  };

export const InfoIcon: React.FC<InfoIconProps> = ({ placement = "top", tooltip, size = "1x", width }) => {
  return (
    <Tippy interactive={true} placement={placement} content={tooltip} maxWidth="260px">
      <Flex sx={{alignItems:"center", opacity:0.3}}>
        &nbsp;
        <InfoIconSvg width={width} height={width}/>
      </Flex>
    </Tippy>
  );
};
