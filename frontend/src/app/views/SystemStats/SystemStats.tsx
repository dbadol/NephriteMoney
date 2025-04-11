import React from "react";
import { Card, Heading, Link, Box, Text, Flex } from "theme-ui";
import theme from '../../theme';
import { Statistic } from "@app/components/Statistic";
import { useNephriteSelector } from '@app/hooks/useNephriteSelector';
import { Decimal, Percent } from "@app/library/base/Decimal";
import { COIN, CRITICAL_COLLATERAL_RATIO, GROTHS_IN_BEAM, GT } from '@app/constants';
import Coin from "@app/components/icons/coin/nephrite.svg";
import { useSelector } from "react-redux";
import { selectIssueRate } from "@app/store/NephriteStore/selectors";

export const SystemStats: React.FC = () => {
  const select = ({
    assetPrice,
    appParams,
    troves,
    total,
  }) => ({
    assetPrice,
    appParams,
    troves,
    total,
    price: Decimal.from(appParams.price)
  });

  const {
    appParams,
    assetPrice,
    troves,
    total,
    price
  } = useNephriteSelector(select);

  const tcr = new Percent(appParams.tcr.div(100));
  const tvl = Decimal.from(appParams.totals.col).div(GROTHS_IN_BEAM);
  const issuanceFee = useSelector(selectIssueRate());
  const borrowingFeePct = new Percent(+appParams.baserate);
  const nephriteSupply = Decimal.from(appParams.totals.tok).div(GROTHS_IN_BEAM);
  const nephriteInStabilityPool = Decimal.from(appParams.stab_pool.tok).div(GROTHS_IN_BEAM);
  const nephriteInStabilityPoolPct =
    Decimal.from(appParams.totals.tok).nonZero && new Percent(Decimal.from(appParams.stab_pool.tok).div(appParams.totals.tok));

  const bg = 'linear-gradient(#527B0B 0%, #73A30A 100%)';

  return (
    <Card sx={{ p: '24px', m: '0px !important', minWidth: '280px', height: '100%' }}>
      <Heading as="h3" sx={{ color: '#000', letterSpacing: '2px' }}>NEPHRITE ECOSYSTEM</Heading>

      <Box sx={{ py: "10px" }}>
        <Flex sx={{ height: "44px", background: 'linear-gradient(273.6deg, rgba(82, 123, 11, 0.3) 0.88%, rgba(115, 163, 10, 0.3) 94.96%)', alignItems: "center", bg: bg, borderRadius: "10px", border: "1px solid rgba(109, 187, 185, 0.3)" }}>
          <Flex sx={{ justifyContent: "center", alignItems: "center", flex: "0 0 100%" }}>
            <Coin style={{ width: "26px", height: "26px" }} />
            <Text variant="systemStats" sx={{ ml: "8px", fontWeight: 700 }}>
              1 NPH = 1 USD
            </Text>
          </Flex>
        </Flex>
      </Box>

      <Box>
        <Statistic
          name="TVL"
          tooltip="The Total Value Locked (TVL) is the total value of BEAM locked as collateral in the system, given in BEAM and USD."
        >
          <Text sx={{ fontSize: 1 }}>
            &nbsp;${Decimal.from(tvl.mul(assetPrice)).shorten()}
            <br />
            <Text sx={{ fontSize: '10px', color: 'rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}>
              &nbsp; {tvl.prettify(2)} BEAM
            </Text>
          </Text>

          <br />
        </Statistic>
        <Statistic name="Troves" tooltip="The total number of active Troves in the system.">
          {troves.length}
        </Statistic>
        <Statistic name="NPH supply" tooltip="The total NPH minted by the Nephrite Dapp.">
          {nephriteSupply.shorten()}
        </Statistic>
        {nephriteInStabilityPoolPct && (
          <Statistic
            name="NPH in Stability Pool"
            tooltip="The total NPH currently held in the Stability Pool, expressed as an amount and a fraction of the NPH supply."
          >
            {nephriteInStabilityPool.shorten()}
            <Text sx={{ fontSize: 1 }}>&nbsp;({nephriteInStabilityPoolPct.toString(1)})</Text>
          </Statistic>
        )}

        <Statistic
          name="TCR"
          tooltip="The Total Collateral Ratio (TCR) is the ratio of the US dollar value of the entire system collateral at the current BEAM:USD price, to the entire system debt."
        >
          {tcr.prettify()}
        </Statistic>

        <Statistic name="Issuance fee" tooltip="The Issuance Fee is a one-off fee charged as a percentage of the borrowed amount (in BEAM). The fee varies between 0.5% and 5% depending on NPH redemption volumes.  Under the Recovery mode the fee is set to 0%.">
          {issuanceFee.toString()}
        </Statistic>

        <Statistic
          name="Recovery Mode"
          tooltip="Recovery Mode is activated when the Total Collateral Ratio (TCR) falls below 150%. When active, your Trove can be liquidated if its collateral ratio is below the TCR. The maximum collateral you can lose from liquidation is capped at 110% of your Trove's debt. Operations are also restricted that would negatively impact the TCR."
        >
          {total.collateralRatioIsBelowCritical(price) ? <Box color="danger">Yes</Box> : <Box color="#000">No</Box>}
        </Statistic>

        {
          !total.collateralRatioIsBelowCritical(price) &&
          <Statistic
            name={(<Text>Recovery Mode <br /> Price Threshold</ Text>)}
            tooltip="The US dollar value of BEAM below which the Total Collateral Ratio will drop below 150% and the system will enter Recovery Mode"
          >
            ${total.debt.mulDiv(CRITICAL_COLLATERAL_RATIO, total.collateral).prettify()}
          </Statistic>
        }

      </Box>
    </Card>
  );
};
