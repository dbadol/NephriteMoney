import React, { useEffect, useMemo } from 'react';

import { Box, Container, Flex, Grid, Heading, Select, Text } from 'theme-ui';
import { SystemStats } from '@app/views/SystemStats';
import { Toggle, Window } from '@app/components';
import { RouterLink } from '@app/components/RouterLink';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useMatch } from 'react-router';
import { UserStats } from '@app/views/SystemStats/UserStats';
import { BackButton } from '@app/components/BackButton/BackButton';
import { styled } from '@linaria/react';
import FadeIn from 'react-fade-in';
import { useTroveView } from '@app/contexts/Trove/TroveViewContext';
import { useStabilityView } from '@app/contexts/StabilityDeposit/StabilityViewContext';
import useTitleGenerator from '@app/hooks/useTitleGenerator';
import { OpeningModal } from '@app/views/OpeningModal/OpeningModal';
import { selectStartAlertWindowAlreadyUsed } from '@app/store/AppPersistStore/selector';
import * as appPersistActions from '@app/store/AppPersistStore/actions';
import store from 'index';
import { useSelector } from 'react-redux';
import { Documentation } from '@app/views/SystemStats/Documentation';
import { IsTransactionStatus } from '@app/library/transaction-react/IsTransactionStatus';

const Title = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'SFProDisplay';
  font-size: 16px;
  font-weight: 800;
  line-height: 19px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #204501;
`;

export const NephriteLayout: React.FC = ({ children }) => {
  const isEditable = useMatch('/editable/:action/:view');
  const title = useTitleGenerator();
  const location = useLocation();

  const startAlertWindowAlreadyUsed = useSelector(
    selectStartAlertWindowAlreadyUsed(),
  );

  const [
    isTransactionPending,
  ] = IsTransactionStatus({
    transactionIdPrefix: ".*",
  });


  if (!startAlertWindowAlreadyUsed) {
    return (
      <Window>
        <OpeningModal
          isShown={true}
          setIsShown={() => {
            store.dispatch(appPersistActions.startAlertWindowAlreadyUsed(true));
          }}
        />
      </Window>
    );
  }

  return (
    <Window>
      <Container>
        <Grid>
          <Flex
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              mb: '25px',
              mt: '5px',
            }}
          >
            {isEditable && (
              <RouterLink
                sx={{ color: '#333', opacity: !isTransactionPending ? 1 : 0.3 }}
                to={'/'}
                state={{ action: 'back', previous: 'editable' }}
                onClick={(event) => !isTransactionPending ? event : event.preventDefault()}
              >
                <BackButton text="back" />
              </RouterLink>
            )}
            <Container sx={{ alignSelf: 'center' }}>
              {isEditable && <Title>{title}</Title>}
            </Container>
          </Flex>
        </Grid>
      </Container>

      <Container>
        <Grid variant="nephriteLayout">
          <Container>{children}</Container>

          <Container>
            <FadeIn>
              <Box>
                <SystemStats />
              </Box>
              <Box sx={{ marginTop: '16px', gridArea: '3/3' }}>
                <UserStats />
              </Box>
              <Box sx={{ mt: 4 }}>
                <Documentation />
              </Box>
            </FadeIn>
          </Container>
        </Grid>
      </Container>
    </Window>
  );
};
