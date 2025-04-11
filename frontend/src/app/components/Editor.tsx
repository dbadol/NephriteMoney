import React, { useState } from 'react';
import {
  Text,
  Flex,
  Label,
  Input,
  SxProp,
  Button,
  ThemeUICSSProperties,
  Box,
  Container,
} from 'theme-ui';
import { Icon } from '@app/components/Icon';
import PercentIcon from '@app/components/icons/percent.svg';
import SeperatorLong from '@app/components/icons/separator-long.svg';
import { isAmountValid } from '@app/utils/amountHandler';

type RowProps = SxProp & {
  label: string;
  labelId?: string;
  labelFor?: string;
  infoIcon?: React.ReactNode;
  statistic?: boolean;
  icrPositive?: boolean;
  isInput?: boolean;
};

const UsdEqualizer: React.FC<{ equalizer: any }> = ({ equalizer }) => (
  <Flex sx={{ px: '20px', opacity: 0.5, fontSize: '14px', fontWeight: '300' }}>
    <Text sx={{ color: '#000' }}>{equalizer()} USD</Text>
  </Flex>
);

export const Row: React.FC<RowProps> = ({
  sx,
  label,
  labelId,
  labelFor,
  children,
  infoIcon,
  isInput,
}) => {
  return (
    <Flex
      sx={{
        alignItems: 'stretch',
        flexDirection: 'column',
        fontWeight: 500,
        p:
          labelFor && !labelFor.includes('collaterialRatio')
            ? '0'
            : label == 'Your pool share'
              ? '4px 10px 4px 0px'
              : labelFor == 'borrow'
                ? '4px 0px'
                : '4px 10px',
        ...sx,
      }}
    >
      <Label
        id={labelId}
        htmlFor={labelFor}
        sx={{
          position: 'relative',
          flex: labelId.includes('input') ? '1 auto' : '0 55%',
          display: 'flex',
          fontSize: '14px',
          color: '#8b9496',
          border: 1,
          fontWeight:
            labelId.includes('input') ||
              label == 'Amount' ||
              label == 'Redemption Fee'
              ? 700
              : 400,
          borderColor: 'transparent',
          ml: isInput ? '16px' : '0px',
          minWidth:
            labelId.includes('static') && labelFor !== 'borrow'
              ? '170px'
              : labelFor == 'borrow'
                ? '144px'
                : 'auto',
        }}
      >
        {labelFor === 'collaterialRatio' ? (
          <Flex
            sx={{
              fontFamily: 'SFProDisplay',
              alignItems: 'center',
              color: 'rgba(0,0,0,0.7)',
              whiteSpace: 'nowrap',
              fontStyle: 'italic',
            }}
          >
            {label}
            {infoIcon && infoIcon}
          </Flex>
        ) : labelId.includes('input') ||
          label == 'Amount' ||
          label == 'Redemption fee' ||
          labelFor == 'collaterialRatio_trove' ? (
          <Flex
            sx={{
              fontFamily: 'SFProDisplay',
              alignItems: 'center',
              color: 'rgba(0,0,0,0.5)',
              whiteSpace: 'nowrap',
              fontStyle: 'normal',
            }}
          >
            {label}
            {infoIcon && infoIcon}
          </Flex>
        ) : (
          <Flex
            sx={{
              fontFamily: 'SFProDisplay',
              fontWeight: label == 'Your pool share' ? 700 : 400,
              alignItems: 'center',
              color:
                label === 'Your pool share'
                  ? 'rgba(0,0,0,0.5)'
                  : 'rgba(0,0,0,0.7)',
              whiteSpace: 'nowrap',
              fontStyle:
                labelFor || label == 'Your pool share' ? 'normal' : 'italic',
            }}
          >
            {label}
            {infoIcon && infoIcon}
          </Flex>
        )}
      </Label>
      {children}
    </Flex>
  );
};

type PendingAmountProps = {
  value: string;
};

const PendingAmount: React.FC<PendingAmountProps & SxProp> = ({
  sx,
  value,
}) => (
  <Text {...{ sx }}>
    (
    {value === '++' ? (
      <Icon name="angle-double-up" />
    ) : value === '--' ? (
      <Icon name="angle-double-down" />
    ) : value?.startsWith('+') ? (
      <>
        <Icon name="angle-up" /> {value.substr(1)}
      </>
    ) : value?.startsWith('-') ? (
      <>
        <Icon name="angle-down" /> {value.substr(1)}
      </>
    ) : (
      value
    )}
    )
  </Text>
);

type StaticAmountsProps = {
  inputId?: string;
  labelledBy?: string;
  amount?: string;
  unit?: string;
  unitPosition?: string;
  unitIcon?: any;
  color?: string;
  showPercent?: boolean;
  pendingAmount?: string;
  pendingColor?: string;
  statistic?: boolean;
  icrPositive?: boolean;
  showIfZero?: boolean;
  onClick?: () => void;
};

export const StaticAmounts: React.FC<StaticAmountsProps & SxProp> = ({
  sx,
  inputId,
  labelledBy,
  amount,
  unit,
  unitPosition,
  unitIcon,
  color,
  pendingAmount,
  pendingColor,
  showPercent,
  onClick,
  statistic,
  icrPositive,
  showIfZero = false,
  children,
}) => {
  const textcolor = color || 'text';
  return (
    <Box
      id={inputId}
      aria-labelledby={labelledBy}
      {...{ onClick }}
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        flexDirection: inputId && !statistic ? 'row-reverse' : 'row',
        flex: '1 auto',
        ...(onClick ? { cursor: 'text' } : {}),
        ...staticStyle,
        ...sx,
      }}
    >
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: unitPosition ?? 'start',
          flex: inputId ? '0 55%' : '0 auto',
          height: '100%',
        }}
      >
        {statistic ? (
          <Text
            sx={{
              color: '#000',
              fontWeight: 600,
              mr: '5px',
              fontStyle: 'italic',
              background: icrPositive
                ? 'rgba(172, 200, 116, 0.5)'
                : 'transparent',
              padding: icrPositive ? '4px 8px' : '0',
              borderRadius: icrPositive ? '4px' : '0',
              minWidth: 'auto',
            }}
          >
            {amount}
          </Text>
        ) : (
          <Text
            sx={{
              color: inputId && amount != '0.00' ? '#000' : 'rgba(0,0,0,3)',
              mr: '2px',
              minWidth: 'auto',
              fontWeight: inputId.includes('icr_input') ? 700 : 400,
              fontStyle: inputId.includes('icr_input') ? 'italic' : 'normal',
              padding:
                icrPositive && inputId === 'trove-icr' ? '4px' : '4px 0px',
              background:
                icrPositive && inputId === 'trove-icr'
                  ? 'rgba(172, 200, 116, 0.5)'
                  : 'transparent',
              borderRadius: inputId === 'trove-icr' ? '4px' : '0px',
            }}
          >
            {!showIfZero ? (!!+amount ? amount : '0') : amount}
          </Text>
        )}
        {unit && (
          <Flex
            sx={{
              alignItems: 'center',
              minWidth: unitPosition ? '100px' : 'auto',
            }}
          >
            {unitIcon ? (
              <>
                <Flex sx={{ alignItems: 'center', mr: '15px' }}>
                  <SeperatorLong />
                </Flex>
                <Box
                  sx={{
                    padding: inputId === 'trove-icr_input' ? '4px' : '0px',
                    background:
                      inputId === 'trove-icr_input'
                        ? 'rgba(172, 200, 116, 0.5)'
                        : 'transparent',
                    borderRadius: inputId === 'trove-icr_input' ? '4px' : '0px',
                  }}
                >
                  {unitIcon} &nbsp;
                </Box>
                <Text
                  sx={{
                    color: textcolor,
                    fontWeight: '600',
                    fontSize: '20px',
                    mr: unit == 'BEAM' ? '16px' : '30px',
                    padding: inputId === 'trove-icr_input' ? '4px' : '0px',
                    background:
                      inputId === 'trove-icr_input'
                        ? 'rgba(172, 200, 116, 0.5)'
                        : 'transparent',
                    borderRadius: inputId === 'trove-icr_input' ? '4px' : '0px',
                  }}
                >
                  {unit}
                </Text>
              </>
            ) : showPercent ? (
              <>
                <Box sx={{ ml: 2 }}>
                  <Box
                    sx={{
                      background: 'rgba(172, 200, 116, 0.5)',
                      margin: '6px 4px 6px 0px',
                      borderRadius: '4px',
                    }}
                  >
                    <Text
                      sx={{
                        color: textcolor,
                        fontStyle:
                          inputId.includes('trove') || inputId === 'redeem-fee'
                            ? 'normal'
                            : 'italic',
                        fontWeight:
                          inputId === 'redemption-fee' ? '400' : '700',
                        fontSize: '14px',
                        padding: '0 6px',
                        verticalAlign: 'middle',
                      }}
                    >
                      {unit}
                    </Text>
                  </Box>
                  <Box
                    sx={{
                      fontStyle:
                        inputId.includes('trove') ||
                          inputId === 'trove-icr_input'
                          ? 'normal'
                          : 'italic',
                      background: 'rgba(0,0,0,0.05)',
                      borderRadius: '4px',
                    }}
                  >
                    <PercentIcon />
                  </Box>
                </Box>
              </>
            ) : (
              <Text
                sx={{
                  color: textcolor,
                  fontWeight:
                    inputId.includes('trove') || inputId === 'redeem-fee'
                      ? '400'
                      : '700',
                  fontStyle:
                    inputId.includes('trove') ||
                      inputId === 'redeem-fee' ||
                      inputId == 'stability-pool-share' ||
                      inputId == 'trove-icr_input'
                      ? 'normal'
                      : 'italic',
                  fontSize: '14px',
                  padding: '4px 0px',
                  margin: '0 3px',
                  verticalAlign: 'middle',
                }}
              >
                {unit}
              </Text>
            )}
          </Flex>
        )}

        {pendingAmount && (
          <>
            &nbsp;
            <PendingAmount
              sx={{
                color: pendingColor ? pendingColor : 'rgba(0,0,0)',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                mr: '10px',
              }}
              value={pendingAmount}
            />
          </>
        )}
      </Flex>

      {children}
    </Box>
  );
};

const staticStyle: ThemeUICSSProperties = {
  flexGrow: 1,

  mb: 0,
  pl: 3,
  pr: '11px',
  pb: 0,
  pt: '28px',

  fontSize: 3,

  border: 1,
  borderColor: 'transparent',
};

const editableStyle: ThemeUICSSProperties = {
  flexGrow: 1,

  mb: '5px',
  px: '16px',
  py: '6px',

  fontSize: 6,
  border: 5,
  borderColor: 'none',
  borderRadius: '10px',
  color: '#000',
  mt: '14px',
};

type StaticRowProps = RowProps & StaticAmountsProps;

export const StaticRow: React.FC<StaticRowProps> = ({
  label,
  labelId,
  labelFor,
  infoIcon,
  statistic,
  ...props
}) => (
  <Row {...{ label, labelId, labelFor, infoIcon, statistic }}>
    <StaticAmounts {...props} />
  </Row>
);

type DisabledEditableRowProps = Omit<
  StaticAmountsProps,
  'labelledBy' | 'onClick'
> & {
  label: string;
  labelId: string;
};

export const DisabledEditableRow: React.FC<DisabledEditableRowProps> = ({
  inputId,
  label,
  unit,
  unitPosition,
  unitIcon,
  amount,
  color,
  pendingAmount,
  statistic,
  pendingColor,
}) => (
  <Row labelId={`${inputId}-label`} {...{ label, unit }}>
    <StaticAmounts
      sx={{ ...editableStyle, boxShadow: 0, p: 0 }}
      labelledBy={`${inputId}-label`}
      {...{
        inputId,
        amount,
        unit,
        unitPosition,
        unitIcon,
        color,
        pendingAmount,
        pendingColor,
        statistic,
      }}
    />
  </Row>
);

type EditableRowProps = DisabledEditableRowProps & {
  editingState: [string | undefined, (editing: string | undefined) => void];
  editedAmount: string;
  setEditedAmount: (editedAmount: string) => void;
  maxAmount?: string;
  allDept?: boolean;
  maxedOut?: boolean;
  equalizer?: any;
  showPercent?: boolean;
  statistic?: boolean;
  isInput?: boolean;
  minAmount?: number;
};

export const EditableRow: React.FC<EditableRowProps> = ({
  label,
  labelId,
  inputId,
  unit,
  unitPosition,
  unitIcon,
  amount,
  color,
  pendingAmount,
  pendingColor,
  editingState,
  editedAmount,
  setEditedAmount,
  maxAmount,
  allDept,
  maxedOut,
  equalizer,
  showPercent,
  statistic,
  isInput,
  minAmount

}) => {
  const [editing, setEditing] = editingState;
  const [invalid, setInvalid] = useState(false);
  const [minVal, setMinVal] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value }: { value: string | number } = e.target;
  if(minAmount){
    if(value >= minAmount ){
      setMinVal(false)
    } else
      setMinVal(true)
  }
    if (
      !!isAmountValid(value) &&
      ((+maxAmount && +value <= +maxAmount) || !+maxAmount)
    ) {
      setInvalid(false);
      setEditedAmount(value);
    } else {
      e.target.value = editedAmount;
      setInvalid(true);
    }
  };

  return editing === inputId ? (
    <Row
      {...{
        label,
        labelFor: inputId,
        labelId,
        unit,
        unitIcon,
        showPercent,
        isInput,
      }}
      sx={{ mb: '20px' }}
    >
      <Input
        autoFocus
        id={inputId}
        step="any"
        defaultValue={!+editedAmount ? '' : editedAmount}
        onChange={handleChange}
        maxLength={"false"}
        onBlur={() => {
          setEditing(undefined);
          setInvalid(minVal ? minVal : false);
        }}
        sx={{
          ...editableStyle,
          fontWeight: 'light',
          background: invalid || minVal
            ? 'linear-gradient(0deg, rgba(198, 62, 62, 0.1), rgba(198, 62, 62, 0.1)), #fff'
            : '#fff',
          border: invalid || minVal ? '1px solid #C63E3E' : '1px solid transparent',
        }}
      />

      {equalizer && <UsdEqualizer equalizer={equalizer} />}
    </Row>
  ) : (
    <Row
      labelId={`${inputId}-label`}
      labelFor="label"
      {...{ label, unit, isInput }}
      sx={{ mb: '20px' }}
    >
      <StaticAmounts
        sx={{
          ...editableStyle,
          paddingRight: 0,
          background: invalid
            ? 'linear-gradient(0deg, rgba(198, 62, 62, 0.1), rgba(198, 62, 62, 0.1)), #fff'
            : '#fff',
          border: invalid ? '1px solid #C63E3E' : '1px solid transparent',
        }}
        labelledBy={`${inputId}-label`}
        onClick={() => setEditing(inputId)}
        {...{
          inputId,
          amount,
          unit,
          unitPosition,
          unitIcon,
          color,
          pendingAmount,
          pendingColor,
          invalid,
          showPercent,
          statistic,
        }}
      >
        {maxAmount && (
          <Button
            sx={{
              fontSize: 1,
              p: 1,
              px: 2,
              position: 'absolute',
              right: '140px',
              top: '0%',
              color: 'white',
              borderRadius: '4px',
              background:
                'linear-gradient(102.75deg, #74A30B 1.76%, #547D0C 100%)',
              display: editedAmount === maxAmount ? 'none' : 'block',
              marginTop: "20px"
            }}
            onClick={event => {
              setEditedAmount(maxAmount);
              event.stopPropagation();
            }}
            disabled={maxedOut}
          >
            {inputId === 'trove-repaying' ? 'all debt' : 'max'}
          </Button>
        )}
      </StaticAmounts>

      {equalizer && <UsdEqualizer equalizer={equalizer} />}
    </Row>
  );
};

export const StaticParamsRow: React.FC<StaticRowProps> = ({
  label,
  labelId,
  labelFor,
  infoIcon,
  isInput,
  ...props
}) => (
  <Row
    {...{ label, labelId, labelFor, infoIcon, isInput }}
    sx={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}
  >
    <StaticAmounts {...props} sx={{ p: 0, fontSize: 1 }} />
  </Row>
);
