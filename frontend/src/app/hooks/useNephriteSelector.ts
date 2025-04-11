import { selectNephriteAppParams } from '@app/store/NephriteStore/selectors';
import { useSelector } from 'react-redux';

export const useNephriteSelector = <S, T>(select/* : (state: LiquityStoreState<T>) => S */)/* : S */ => {
  const nephriteStoreParams = useSelector(selectNephriteAppParams());

  return select(nephriteStoreParams);
};
