import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, Text, Box, Heading, Flex } from "theme-ui";
import {
  Percent,
  Decimal
} from "@app/library/base/Decimal";

import {
  MINIMUM_COLLATERAL_RATIO,
  CRITICAL_COLLATERAL_RATIO,
  UserTrove,
} from "@app/library/nephrite";
import { useNephriteSelector } from "@app/hooks/useNephriteSelector";
import { COIN, GROTHS_IN_BEAM } from "@app/constants";

import { Icon } from "@app/components/Icon";
import { LoadingOverlay } from "@app/components/LoadingOverlay";
import { Tooltip } from "@app/components/Tooltip";
import { Abbreviation } from "@app/components/Abbreviation";
import { useSelector } from 'react-redux';
import { Pagination } from "@app/components/Pagination/pagination";
import { PaginationContainer } from "@app/components/Pagination/PaginatationComponent";
import { styled } from "@linaria/react";
import { selectAllSystemTroves } from "@app/store/NephriteStore/selectors";
import { selectUserTrove } from "@app/store/TroveStore/selector";
import { useTitle } from "@app/contexts/Nephrite/TitleContext";
import Button from "@app/components/Button";
import useAreTrovesForLiquidation from "@app/hooks/useAreTrovesForLiquidation";
import { InfoIcon } from "@app/components/InfoIcon";
import { LiquidationModal } from "../components/LiquidationModal";
import { getApi } from "@app/utils/getApi";
import { useCurrentTransactionState } from "@app/library/transaction-react/useCurrentTransactionState";
import { ShaderTransactionComments } from "@app/library/nephrite/types";
import { IsTransactionStatus } from "@app/library/transaction-react/IsTransactionStatus";
import { useLiquidationView } from "@app/contexts/Liquidation/LiquidationViewContext";
import useDidMountEffect from "@app/hooks/useDidMountEffect";
import store from "index";
import { loadUserView } from "@app/store/NephriteStore/actions";
import useCouldLiquidate from "@app/hooks/useCouldLiquidate";

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 15px 16px 17px 24px;
`;

const Table = styled.table`
  font-family: 'SFProDisplay', sans-serif;
  border-collapse: collapse;
  width: 100%;

  tr:nth-child(even) {
    background-color: rgba(32, 69, 1, 0.05);
    padding: 6px;
  }

  td:nth-child(even) {
    padding: 6px 24px;
  }

  td {
    color: #000;
    padding: 8px 24px;
  }

  th {
    color: rgba(0, 0, 0, 0.5);
    padding: 8px 0px;
    font-weight: 700;
    text-align: left;
  }
`;

const Span = styled.span`
  background-color: rgb(180, 219, 180);
  border-radius: 3px;
  color: rgba(0,0,0,0.7);
  justify-content: center;
  margin: 20%;
  font-style: italic;
  padding: 2px 8px;
  white-space: nowrap;
`;

const SpanHidden = styled(Span)`
visibility: hidden;
`
const liquidatableInNormalMode = (trove: UserTrove, price: Decimal) =>
  [trove.collateralRatioIsBelowMinimum(price), "Collateral ratio not low enough"] as const;

const liquidatableInRecoveryMode = (
  trove: UserTrove,
  price: Decimal,
  totalCollateralRatio: Decimal,
  nephriteInStabilityPool: Decimal
) => {
  const collateralRatio = trove.collateralRatio(price);

  if (collateralRatio.gte(MINIMUM_COLLATERAL_RATIO) && collateralRatio.lt(totalCollateralRatio)) {
    return [
      trove.debt.lte(nephriteInStabilityPool),
      "There's not enough LUSD in the Stability pool to cover the debt"
    ] as const;
  } else {
    return liquidatableInNormalMode(trove, price);
  }
};

type RiskyTrovesProps = {
};

const select = ({
  numberOfTroves,
  assetPrice,
  total,
  troves,
  nephriteInStabilityPool,
  blockTag,
  appParams
}/* : BlockPolledLiquityStoreState */) => ({
  numberOfTroves,
  assetPrice,
  troves,
  recoveryMode: total.collateralRatioIsBelowCritical(assetPrice),
  totalCollateralRatio: total.collateralRatio(assetPrice),
  nephriteInStabilityPool: Decimal.from(appParams.stab_pool.tok).div(GROTHS_IN_BEAM),
  blockTag,
  beamPrice: appParams.price
});

export const Liquidation: React.FC<RiskyTrovesProps> = ({ }) => {

  const {
    blockTag,
    numberOfTroves,
    recoveryMode,
    totalCollateralRatio,
    nephriteInStabilityPool,
    assetPrice,
    beamPrice,
    troves: sortedTroves
  } = useNephriteSelector(select);

  const { dispatchEvent } = useLiquidationView();

  const transactionState = useCurrentTransactionState(new RegExp(`${ShaderTransactionComments.setTrovesLiquidate}`, "g"));
  const [isTransactionPending, isTransactionFailed, isTransactionSuccess] = IsTransactionStatus({ transactionIdPrefix: ShaderTransactionComments.setTrovesLiquidate });

  const [couldLiquidate, setCouldLiquidate] = useState<boolean>();
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState({});

  const [page, setPage] = useState(1);
  const [currentTroves, setCurrentTroves] = useState<UserTrove[]>([]);

  const [isShownModal, setIsShownModal] = useState(false);

  const areTrovesForLiquidation = useAreTrovesForLiquidation();

  const { setCurrentTitle } = useTitle();

  const userTrove = useSelector(selectUserTrove());
  const normalCollateralTrovesPosition = sortedTroves.findIndex(
    trove => !trove.collateralRatioIsBelowMinimum(beamPrice)
  );

  const forceReload = useCallback(() => setReload({}), []);

  const pageSize = 12;

  const numberOfPages = Math.ceil(numberOfTroves / pageSize) || 1;
  const clampedPage = Math.min(page, numberOfPages);

  const toggleModal = () => setIsShownModal(!isShownModal);

  useEffect(() => {
    let couldLiquidateTimer = setTimeout(() => {/* tik tak */ }, 1000);

    (async () => {
      const result = await useCouldLiquidate();
      setCouldLiquidate(result);
    })();

    return () => {
      clearTimeout(couldLiquidateTimer);
    }
  }, [])

  useEffect(() => {
    setCurrentTitle("Liquidation");
  }, [])


  useEffect(() => {
    if (page !== clampedPage) {
      setPage(clampedPage);
    }
  }, [page, clampedPage]);


  useEffect(() => {
    if (isTransactionPending) {
      setIsShownModal(false);
    }

    if (isTransactionSuccess) {
      store.dispatch(loadUserView.request());
      dispatchEvent("LIQUIDATION_EMPTIED");
    }
  }, [transactionState.type])


  useEffect(() => {
    forceReload();
  }, [forceReload, numberOfTroves]);


  useEffect(() => {
    let mounted = true;

    setLoading(true);

    let currentTroves = sortedTroves.slice((clampedPage - 1) * pageSize, ((clampedPage - 1) * pageSize) + pageSize)
    if (mounted) {
      setCurrentTroves(currentTroves);
      setLoading(false);
    }

    return () => {
      mounted = false;
      currentTroves = null;
    };
  }, [clampedPage, pageSize, reload])

  let userTroveSpanAlreadyUsed = false;

  return (
    <>
      <Card sx={{ gridArea: "1 / 1 / 3 / 3" }}>
        <Box sx={{ background: '#F4F7EC', padding: '20px 20px 8px 20px', flex: 2 }}>
          <Nav>
            <Text sx={{ color: '#204501', fontWeight: 800, letterSpacing: '2px', fontSize: '16px' }}>RISKY TROVES</Text>
            <Flex>
              <Button pallete='gradient' style={{
                opacity: couldLiquidate && !isTransactionPending ? 1 : 0.2,
                height: '37px', margin: 0, letterSpacing: '0.1em'
              }} onClick={
                couldLiquidate && !isTransactionPending ? toggleModal : null
              }>INITIATE LIQUIDATION</Button>
              <Box sx={{ marginLeft: '16px', alignSelf: 'center' }}>
                <InfoIcon width={'20px'} placement='bottom' tooltip={<Card variant="tooltip">
                  <Text sx={{ fontWeight: 700 }}>Important note!</Text>
                  <Text sx={{ mb: 2, display: 'block' }}>By pressing the "Initiate liquidation" button, you send a transaction to Nephrite's smart contract, which initiates the liquidation of risky troves. </Text>
                  <Text sx={{ fontWeight: 700 }}>You don't have to repay a debt of that troves - you only have to pay a gas fee</Text> for the transaction, and the system will liquidate these troves by itself.

                  <Text sx={{ mt: 2, display: 'block' }}>You will get 10 NPH for each liquidated trove as a reward, and you can liquidate a maximum of 10 troves at once.</Text>
                </Card>} />
              </Box>
            </Flex>
          </Nav>

          {!currentTroves || currentTroves.length === 0 ? (
            <Box sx={{ p: [2, 3] }}>
              <Box sx={{ p: 4, fontSize: 3, textAlign: "center" }}>
                {!currentTroves ? "Loading..." : "There are no Troves yet"}
              </Box>
            </Box>
          ) : (
            <>
              <Table>
                <thead style={{ marginBottom: "20px" }}>
                  <tr style={{ backgroundColor: 'rgba(32, 69, 1, 0.05)' }}>
                    <th style={{ padding: '8px 24px', verticalAlign: 'baseline' }}>
                      <Abbreviation short="Coll.">#</Abbreviation>
                    </th>
                    <th style={{ padding: '8px 24px' }}>
                      <Abbreviation short="Coll.">Collateral</Abbreviation>
                      <Box sx={{ fontSize: [0], fontWeight: "body", opacity: 0.5 }}>(BEAM)  </Box>
                    </th>
                    <th style={{ padding: '8px 24px' }}>
                      Debt
                      <Box sx={{ fontSize: [0], fontWeight: "body", opacity: 0.5 }}>({COIN})  </Box>
                    </th>
                    <th style={{ paddingTop: '8px', verticalAlign: 'baseline' }}>
                      Collateral Ratio
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {currentTroves.map(
                    (trove, i) => {

                      if (!trove.isEmpty) {

                        let userSpan = <SpanHidden>my trove</SpanHidden>;

                        if (!userTroveSpanAlreadyUsed &&
                          userTrove?.cr &&
                          Decimal.from(trove.cr).eq(userTrove.cr)
                        ) {
                          userSpan = <Span>my trove</Span>;
                          userTroveSpanAlreadyUsed = true;
                        }

                        return (
                          <tr key={`liquidate-${trove.cuid}-${trove.collateral.shorten()}`} style={{ margin: "10px 5px", borderBottom: userTrove?.cr ? '1px solid rgba(32, 69, 1, 0.2)' : 'none' }}>
                            <td>
                              <Abbreviation short={1} sx={{ fontStyle: 'italic', color: 'rgba(0,0,0,0.5)', fontSize: '12px', fontWeight: '400', lineHeight: '14px' }}>
                                {(i + 1) + ((page - 1) * pageSize)}
                              </Abbreviation>
                            </td>
                            <td>
                              <Abbreviation short={trove.collateral.shorten()}>
                                {trove.collateral.prettify()}
                              </Abbreviation>
                            </td>
                            <td>
                              <Abbreviation short={trove.debt.shorten()}>
                                {trove.debt.prettify()}
                              </Abbreviation>
                            </td>
                            <td>
                              {(collateralRatio => (
                                <Text
                                  color={
                                    collateralRatio.gt(CRITICAL_COLLATERAL_RATIO)
                                      ? "default"
                                      : collateralRatio.gt(1.2)
                                        ? "warning"
                                        : "danger"
                                  }
                                >
                                  {new Percent(collateralRatio).prettify()}
                                </Text>
                              ))(trove.collateralRatio(beamPrice))}
                              {userSpan}
                            </td>
                          </tr>
                        )

                      }

                      return null;
                    }
                  )}
                </tbody>
              </Table>

            </>
          )}

          {
            currentTroves.length &&
            numberOfPages > 1 &&
            <PaginationContainer totalPages={numberOfPages} clampedPage={clampedPage} pageSize={pageSize} numberOfTroves={numberOfTroves} page={page} setPage={setPage} />
          }

          {loading && <LoadingOverlay />}
        </Box>
      </Card>
      <LiquidationModal onCloseModal={toggleModal} isShown={isShownModal} />
    </>

  );
};







