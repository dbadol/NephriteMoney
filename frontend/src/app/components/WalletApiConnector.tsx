import React, { useEffect, useReducer, useState, useCallback, useMemo } from "react";
import Utils from '../library/base/utils';
import UtilsShader from '../library/base/shader/utilsShader';
import ShaderApi, { ShaderStore } from "@library/base/api/ShaderApi";
import { WalletApiConnectorProvider } from "@app/library/wallet-react/context/WalletApiConnector/WalletApiConnectorProvider";
import store from "index";
import { setSystemState } from '@app/store/SharedStore/actions';
import { selectIsLoaded } from '@app/store/SharedStore/selectors';
import { useSelector, useDispatch } from 'react-redux';

import { loadAppParams, loadRate } from '@app/store/NephriteStore/actions';
import { selectRate } from '@app/store/NephriteStore/selectors';
import { setDappVersion, loadAdminKey } from '@app/store/SharedStore/actions';
import { setTransactionsRequest } from '@app/store/SharedStore/actions';
import { Loader } from './BeamLoader';
import Window from "./Window";
import _ from "lodash";

const walletEventhandler = ({ walletEventPayload }) => {
  if (walletEventPayload) {
    try {
      switch (walletEventPayload.id) {
        case 'ev_system_state':
          store.dispatch(setSystemState(walletEventPayload.result));

          break;

        case 'ev_txs_changed':
          _.isObject(walletEventPayload.result) &&
            walletEventPayload.result &&
            store.dispatch(setTransactionsRequest(walletEventPayload.result.txs));

          break;

        default:
          break;
      }
    } catch (e) {
    }
  }
}

export const WalletApiConnector = ({ children }) => {
  const dispatch = useDispatch();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const rate = useSelector(selectRate());

  const [walletShaders, setWalletShaders] = useState<Array<UtilsShader>>(null);

  const isLoaded = useSelector(selectIsLoaded());

  useEffect(() => {
    if (!isAuthorized) {
      try {
        Utils.initialize({
          "appname": "BEAM DAO NEPHRITE APP",
          "min_api_version": "6.3",
          "headless": false,
          "apiResultHandler": (error, result, full) => {
            result && walletEventhandler({ walletEventPayload: full });
          }
        }, (err) => {
          Utils.bulkShaderDownload(shadersData, (err, shadersData: Array<UtilsShader>) => {
            err ? (() => { throw new err })() : setIsAuthorized(true);

            const apiShaderRegester: ShaderStore = ShaderApi.useShaderStore;

            shadersData.forEach(
              (shaderData) => apiShaderRegester.addShaderToStore(shaderData)
            );

            setWalletShaders(shadersData)


            Utils.callApi("ev_subunsub", {
              "ev_system_state": true,
              "ev_txs_changed": true,
            },
              (error, result, full) => {
                if (result) {
                  store.dispatch(loadAppParams.request());
                }
              }
            );

            Utils.callApi("get_version", false,
              (error, result, full) => {
                if (error) {
                  throw new Error("version could't fetch!");
                }

                if (result) {
                  store.dispatch(setDappVersion(result));
                }
              }
            );
          });

        });
      } catch (e) {
      }
    }
  }, [isAuthorized, isLoaded]);

  return <WalletApiConnectorProvider
    isLoaded={isLoaded}
    loader={<Window><Loader /></Window>}
    isAuthorized={isAuthorized}
    connectorWalletShaders={walletShaders}>{children}</WalletApiConnectorProvider>;
};
