import { GROTHS_IN_BEAM } from '@app/constants';
import { useNephriteSelector } from '@app/hooks/useNephriteSelector';
import { Decimal, Difference } from '@app/library/base/Decimal';
import { selectForStabilityDepositManager } from '@app/store/StabilityDepositStore/selectors';
import { useSelector } from 'react-redux';
import useCalculateDepositFromChange from './useCalculateDepositFromChange';
import useNephriteInStabilityPoolAfterChange from './useNephriteInStabilityPoolAfterChange';

const select = ({ appParams }) => ({
  nephriteInStabilityPool: Decimal.from(appParams.stab_pool.tok).div(GROTHS_IN_BEAM)
});

const useStabilityPoolShareCalculation = ({ view, editedNephrite }) => {
  const { nephriteInStabilityPool } = useNephriteSelector(select);
  const { originalDeposit } = useSelector(selectForStabilityDepositManager());

  const nephriteInStabilityPoolAfterChange = useNephriteInStabilityPoolAfterChange({
    view, nephriteInStabilityPool, originalDeposit, editedNephrite
  });

  const change = originalDeposit.whatChanged(editedNephrite, view);
  const changedDepositValue = !change ? originalDeposit.currentNephrite : useCalculateDepositFromChange({
    originalDeposit, change
  });

  const originalPoolShare = originalDeposit.currentNephrite.mulDiv(100, nephriteInStabilityPool);
  const newPoolShare = changedDepositValue.mulDiv(100, nephriteInStabilityPoolAfterChange);

  const poolShareChange =
    originalDeposit.currentNephrite.nonZero &&
    Difference.between(newPoolShare, originalPoolShare).nonZero;

  return [newPoolShare, poolShareChange];
}

export default useStabilityPoolShareCalculation;
