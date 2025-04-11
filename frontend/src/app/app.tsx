import React, { useEffect } from 'react';

import { selectors as sharedSelectors } from '@app/store/SharedStore/';

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './styles';
import { ReadableDashboard } from '@app/pages/ReadableDashboard';
import { WalletApiConnector } from './components/WalletApiConnector';
import { NephriteProvider } from './contexts/Nephrite/NephriteContext';
import { ThemeProvider } from '@theme-ui/core';
import theme from '@app/theme';
import { RouterLink } from '@app/components/RouterLink';
import { TransactionProvider } from '@app/library/transaction-react/context/TransactionProvider';
import { TransactionMonitor } from './library/transaction-react/TransactionMonitor';
import { Editable } from './pages/Editable';
import { NephriteLayout } from './pages/NephriteLayout';
import { TransactionMonitorNephriteService } from './utils/TransactionMonitorNephriteService';
import { selectTransactions } from './store/SharedStore/selectors';
import { ApiProvider } from '@app/contexts/Nephrite/ApiContext';
import { TroveViewProvider } from '@app/contexts/Trove/TroveViewProvider';
import { StabilityViewProvider } from '@app/contexts/StabilityDeposit/StabilityViewProvider';
import { LiquidationViewProvider } from '@app/contexts/Liquidation/LiquidationViewProvider';
import { RedemptionViewProvider } from '@app/contexts/Redemption/RedemptionViewProvider';
import { TitleProvider } from './contexts/Nephrite/TitleContext';

const App = () => {

  const transactions = useSelector(selectTransactions());

  useEffect(() => {
    window.process = {
      ...window.process,
    };
  }, []);


  return (
    <ThemeProvider theme={theme}>
      <WalletApiConnector>
        <ApiProvider>
          <NephriteProvider>
            <TransactionProvider>
              <TroveViewProvider>
                <StabilityViewProvider>
                  <LiquidationViewProvider>
                    <RedemptionViewProvider>
                      <TitleProvider>
                        <NephriteLayout>
                          <Routes>
                            <Route path="/" element={<ReadableDashboard />} />
                            <Route path="/editable/:action/:view" element={<Editable />} />
                          </Routes>
                        </NephriteLayout>
                        <TransactionMonitor shaderTransactions={transactions} showStatusBlock={false} />
                        <TransactionMonitorNephriteService />
                      </TitleProvider>
                    </RedemptionViewProvider>
                  </LiquidationViewProvider>
                </StabilityViewProvider>
              </TroveViewProvider>
            </TransactionProvider>
          </NephriteProvider>
        </ApiProvider>
      </WalletApiConnector>
    </ThemeProvider>
  );
};

export default App;
