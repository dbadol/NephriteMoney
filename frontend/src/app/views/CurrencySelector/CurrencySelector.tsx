import { setCurrentCurrency } from "@app/store/NephriteStore/actions";
import { selectCurrentCurrency } from "@app/store/NephriteStore/selectors";
import store from "index";
import React from "react"
import { useSelector } from "react-redux"
import { Box, Flex, Select } from "theme-ui"



export const CurrencySelector: React.FC = () => {
    const currentCurrency = useSelector(selectCurrentCurrency());

    return (
            <Select
              sx={{ background: "transparent", width: "80px", color:"#ffffff87", fontSize:"12px", textAlign:"right", border: "none" }}
              variant='currencySelector'
              arrow={
                <Box
                  as="svg"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="#ffffff87"
                  sx={{
                    ml: "-5px",
                    alignSelf: 'center',
                    pointerEvents: 'none',
                  }}>
                  <path d="M7.41 7.84l4.59 4.58 4.59-4.58 1.41 1.41-6 6-6-6z" />
                </Box>
              }
              defaultValue={currentCurrency}
              onChange={(e) => store.dispatch(setCurrentCurrency(e.target.value))}
              >
              <option value={"crypto"}>CRYPTO</option>
              <option value={"usd"}>USD</option>
            </Select>
    )
}