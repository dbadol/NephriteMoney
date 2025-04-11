import React, { useEffect } from "react"
import { Box, Flex, Text } from 'theme-ui';
import SvgLoader from '@app/components/icons/nephrite-loader.svg';

export const Loader: React.FC<{}> = () => {

    useEffect(() => {
    }, [])

    return (
        <Flex sx={{ alignItems: "center", justifyContent: "center", flexDirection: "column", height: "-webkit-fill-available" }}>
            <Box sx={{textAlign:"center", width:"300px", /* height:"300px" */}}>
                <SvgLoader style={{marginBottom:"20px"}} />
                <Text sx={{
                    color: "#333",
                    fontSize: "10px",
                    fontStyle: "italic",
                    width: "100%",
                    textAlign: "center"
                }}>Please wait, Nephrite App is loading...</Text>
            </Box>
        </Flex>
    );
}

