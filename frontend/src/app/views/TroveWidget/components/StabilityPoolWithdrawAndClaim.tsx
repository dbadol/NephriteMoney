import Button from '@app/components/Button';
import React from 'react';
import { Box, Flex, Text } from 'theme-ui';
import Coin from "@app/components/icons/coin/nephrite.svg";
import IconBeamx from "@app/components/icons/icon-beamx.svg";

import { UserStats } from '@app/views/SystemStats/UserStats';
import { SystemStats } from '@app/views/SystemStats';
import { PageTitle } from '@app/components/PageTitle/PageTitle';
import { Statistic } from '@app/components/Statistic';

export const StabilityPoolWithdrawAndClaim = () => {
  return (
    <>
    <PageTitle title='Stability Pool'/>
      <Flex>
        <Box sx={{background:'#F4F7EC',flex: 6, borderRadius: '20px', padding:'20px', marginRight: '16px', }}>
          <Flex>
            <Flex sx={{flexDirection:'column', marginRight:'120px'}}>
              <Text sx={{color:'rgba(0,0,0,0.5)'}}>Deposit</Text>
              <Flex sx={{ justifyContent: "center", alignItems: "start",  marginTop:'8px', marginBottom:'32px'}}>
                  <Coin />
                  <Flex sx={{flexDirection: 'column'}}>
                    <Text variant="systemStats" sx={{ color: '#000', ml: '8px' }}>
                      1000 NPH
                    </Text>
                    <Text variant="subStats" sx={{ color: '#000', ml: '8px' }}>
                      1000 USD
                    </Text>
                  </Flex>
              </Flex>
              <Button variant='ghostBordered'>
                WITHDRAW
              </Button>
            </Flex>
            <Flex sx={{flexDirection:'column'}}>
              <Text sx={{color:'rgba(0,0,0,0.5)'}}>Reward</Text>
              <Flex sx={{ justifyContent: "center", alignItems: "start", marginTop:'8px', marginBottom:'32px' }}>
                  <IconBeamx />
                  <Flex sx={{flexDirection: 'column'}}>
                    <Text variant="systemStats" sx={{ color: '#000', ml: '8px' }}>
                      1000 BEAMX
                    </Text>
                    <Text variant="subStats" sx={{ color: '#000', ml: '8px', opacity:0 }}>
                      BEAM
                    </Text>
                  </Flex>
              </Flex>
              <Button variant='ghostBordered'>
                CLAIM REWARD
              </Button>
            </Flex>
          </Flex>
          <Statistic
            maxSize= '400px'
            name="Your pool share"
          >
            17.4603%
          </Statistic>
          <Statistic
            maxSize= '400px'
            name="Liquidation revenue"
          >
            1000 BEAM
          </Statistic>
        </Box>
      <Box sx={{ flex:6}}>
        <Box>
          <SystemStats />
        </Box>
        <Box sx={{marginTop:'48px'}}>
          <UserStats />
        </Box>
      </Box>
      </Flex>
    </>
)}