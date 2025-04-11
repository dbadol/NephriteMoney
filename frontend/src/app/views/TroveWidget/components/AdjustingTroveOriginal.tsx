import { Decimal } from "@app/library/base/Decimal";
import React from "react";
import { Flex, Button, Box, Card, Heading, Container, Text } from "theme-ui";
import { ASSET, COIN, NEPHRITE_LIQUIDATION_RESERVE } from '@app/constants';
import { Icon } from "@app/components/Icon";
import { InfoIcon } from "@app/components/InfoIcon";
import { LoadingOverlay } from "@app/components/LoadingOverlay";
import { CollateralRatio } from "../components/CollateralRatio";
import { EditableRow, StaticParamsRow, StaticRow } from "@app/components/Editor";
import { AdjustingTroveInterface } from "../interfaces";
import { ActionDescription } from "@app/components/ActionDescription";
import { TroveAction } from "@app/views/Actions/TroveAction";
import BeamSmallCoin from '@app/components/icons/coin/beam-small.svg';
import NephriteSmallCoin from '@app/components/icons/coin/nephrite-flat-small.svg';
import { useSelector } from "react-redux";
import { selectRate } from "@app/store/NephriteStore/selectors";

export const AdjustingTrove: React.FC<AdjustingTroveInterface> = ({
    isDirty,
    reset,
    isTransactionPending,
    collateral,
    setCollateral,
    editingState,
    netDebt,
    setNetDebt,
    fee,
    feePct,
    totalDebt,
    collateralRatio,
    collateralRatioChange,
    description,
    handleCancelPressed,
    stableTroveChange,
    maxBorrowingRate,
    TRANSACTION_ID,
    trove
}) => {

    const beamPrice = useSelector(selectRate());

    return (
        <Card sx={{ gridArea: "1 / 1 / 3 / 3" }}>
            <Box sx={{ p: [2, 3] }}>
                <Flex sx={{ justifyContent: "space-between", mb: "20px" }}>
                    <Heading>
                        Borrowing
                    </Heading>
                    {isDirty && !isTransactionPending && (
                        <Button variant="titleIcon" sx={{ ":enabled:hover": { color: "danger" }, height: "auto" }} onClick={reset}>
                            <Icon name="history" size="lg" />
                        </Button>
                    )}
                </Flex>

                <EditableRow
                    label="Security deposit"
                    inputId="trove-collateral"
                    amount={collateral.prettify()}
                    editingState={editingState}
                    unit="BEAM"
                    unitPosition="space-between"
                    unitIcon={<BeamSmallCoin />}
                    editedAmount={collateral.toString()}
                    setEditedAmount={(amount: string) => setCollateral(Decimal.from(amount))}
                    equalizer={() => beamPrice.mul(+collateral.toString()).prettify(2)}
                    isInput={true}
                />

                <EditableRow
                    label="Borrowing volume"
                    inputId="trove-net-debt-amount"
                    amount={netDebt.prettify()}
                    unit={"NPH"}
                    unitPosition="space-between"
                    unitIcon={<NephriteSmallCoin />}
                    editingState={editingState}
                    editedAmount={netDebt.toString()}
                    setEditedAmount={(amount: string) => setNetDebt(Decimal.from(amount))}
                    equalizer={() => netDebt.prettify(2)}
                    isInput={true}
                />

                <Container sx={{ my: "30px", mx: 0, width: "40%" }}>
                    <CollateralRatio value={collateralRatio} change={collateralRatioChange}  labelId="icr-input"/>

                    <StaticParamsRow
                        label="Liquidation"
                        inputId="trove-liquidation-reserve"
                        amount={`${NEPHRITE_LIQUIDATION_RESERVE}`}
                        unit={COIN}
                        statistic={true}
                        infoIcon={
                            <InfoIcon
                                tooltip={
                                    <Card variant="tooltip" sx={{ width: "200px" }}>
                                        An amount set aside to cover the liquidator’s gas costs if your Trove needs to be
                                        liquidated. The amount increases your debt and is refunded if you close your Trove
                                        by fully paying off its net debt.
                                    </Card>
                                }
                            />
                        }
                    />

                    <StaticParamsRow
                        label="Borrowing Fee"
                        inputId="trove-borrowing-fee"
                        amount={fee.prettify(2)}
                        pendingAmount={feePct.toString(2)}
                        unit={ASSET}
                        statistic={true}
                        infoIcon={
                            <InfoIcon
                                tooltip={
                                    <Card variant="tooltip" sx={{ width: "240px" }}>
                                        This amount is deducted from the borrowed amount as a one-time fee. There are no
                                        recurring fees for borrowing, which is thus interest-free.
                                    </Card>
                                }
                            />
                        }
                    />

                    <StaticParamsRow
                        label="Total debt"
                        inputId="trove-total-debt"
                        amount={totalDebt.prettify(2)}
                        unit={ASSET}
                        statistic={true}
                        infoIcon={
                            <InfoIcon
                                tooltip={
                                    <Card variant="tooltip" sx={{ width: "240px" }}>
                                        The total amount of Nephrite your Trove will hold.{" "}
                                        {isDirty && (
                                            <>
                                                You will need to repay {totalDebt.sub(NEPHRITE_LIQUIDATION_RESERVE).prettify(2)}{" "}
                                                NEPHRITE to reclaim your collateral ({NEPHRITE_LIQUIDATION_RESERVE.toString()} NEPHRITE
                                                Liquidation Reserve excluded).
                                            </>
                                        )}
                                    </Card>
                                }
                            />
                        }
                    />
                </Container>


                {description ?? (
                    <ActionDescription>
                        Adjust your Trove by modifying its collateral, debt, or both.
                    </ActionDescription>
                )}

                {collateralRatio?.lt(1.5) && (
                    <ActionDescription>
                        Keeping your CR above <Text sx={{color:'rgba(0,0,0)',fontWeight: 600, fontStyle:'italic'}}>150%</Text> can help avoid liquidation under Recovery Mode.
                    </ActionDescription>
                )}

                <Flex variant="layout.actions">
                    <Button variant="cancel" onClick={handleCancelPressed} sx={{ mr: "10px" }}>
                        Cancel
                    </Button>

                    {stableTroveChange ? (
                        <TroveAction
                            transactionId={TRANSACTION_ID}
                            change={stableTroveChange}
                            maxBorrowingRate={maxBorrowingRate}
                            trove={trove}
                        >
                            Confirm
                        </TroveAction>
                    ) : (
                        <Button disabled>Confirm</Button>
                    )}
                </Flex>
            </Box>
            {isTransactionPending && <LoadingOverlay />}
        </Card>
    );

}
