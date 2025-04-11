import { Decimal } from '@app/library/base/Decimal';
import { useCallback, useMemo } from 'react';
import { StabilityDeposit, StabilityDepositChange } from '@app/library/nephrite/StabilityDeposit';

const useCalculateDepositFromChange = ({ originalDeposit, change }): Decimal => {
    return useMemo(() => change.withdrawAllNephrite ?
        Decimal.ZERO :
        (
            change?.withdrawNephrite && originalDeposit.currentNephrite.lt(change.withdrawNephrite) ? Decimal.ZERO :
                (
                    change.openDepositNephrite ?? (
                        change.depositNephrite ?
                            change.depositNephrite.add(originalDeposit.currentNephrite) :
                            originalDeposit.currentNephrite.sub(change.withdrawNephrite)
                    )
                )
        ), [originalDeposit, change])
}

export default useCalculateDepositFromChange;
