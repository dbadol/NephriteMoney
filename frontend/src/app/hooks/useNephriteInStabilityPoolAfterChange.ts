import { Decimal } from '@app/library/base/Decimal';
import { useCallback, useMemo } from 'react';

const useNephriteInStabilityPoolAfterChange = ({ view, nephriteInStabilityPool, originalDeposit, editedNephrite }) => {
  const userCurrentNeprite = originalDeposit.currentNephrite;

  return userCurrentNeprite.isZero ? Decimal.ZERO : (
    nephriteInStabilityPool.lte(userCurrentNeprite) ? userCurrentNeprite : (
      view == "adjusting" ?
        nephriteInStabilityPool
          .sub(userCurrentNeprite)
          .add(editedNephrite) :
        (
          view == "opening" ?
            nephriteInStabilityPool
              .sub(userCurrentNeprite)
              .add(editedNephrite) :
            (
              view == "depositing" ?
                nephriteInStabilityPool.add(editedNephrite) : (
                  !nephriteInStabilityPool.isZero ? nephriteInStabilityPool.sub(editedNephrite) : Decimal.ZERO
                )
            )
        )
    )
  )

}

export default useNephriteInStabilityPoolAfterChange;