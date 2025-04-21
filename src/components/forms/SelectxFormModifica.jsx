import React from "react";
import PropTypes from "prop-types";
import { Select as BaseSelect, selectClasses } from "@mui/base/Select";
import { Option as BaseOption, optionClasses } from "@mui/base/Option";
import { styled } from "@mui/system";
import UnfoldMoreRoundedIcon from "@mui/icons-material/UnfoldMoreRounded";
import { CssTransition } from "@mui/base/Transitions";
import { PopupContext } from "@mui/base/Unstable_Popup";
import {useState, useEffect} from 'react'
import { useData } from "../../dataContext";
import { useConfig } from "../../configContext";

export default function SelectxFormModifica({datasForUpdate, setFormData}) {

  const getCurrentTipologia = () => {
    if (!datasForUpdate) return "";
    
    if (datasForUpdate.Spesa) return "Spesa";
    if (datasForUpdate.Income) return "Income";
    if (datasForUpdate.Benzina) return "Benzina";
    if (datasForUpdate.Extra) return "Extra";
    if (datasForUpdate.Casa) return "Casa";
    if (datasForUpdate.Salute) return "Salute";
    if (datasForUpdate.Investimenti) return "Investimenti";
    if (datasForUpdate.tasse) return "tasse";
    if (datasForUpdate.cucito_in) return "cucito_in";
    if (datasForUpdate.cucito_out) return "cucito_out";
  }
  
  const [selectedValue, setSelectedValue] = useState("");
  const {select, formData} = useData();
  const { valoriOutcome, valoriIncome } = useConfig();

  const Select = React.forwardRef(function CustomSelect(props, ref) {
    const slots = {
      root: StyledButton,
      listbox: AnimatedListbox,
      popup: Popup,
      ...props.slots,
    };
  
    return <BaseSelect {...props} ref={ref} slots={slots} />;
  });
  
  Select.propTypes = {
    /**
     * The components used for each slot inside the Select.
     * Either a string to use a HTML element or a component.
     * @default {}
     */
    slots: PropTypes.shape({
      listbox: PropTypes.elementType,
      popup: PropTypes.elementType,
      root: PropTypes.elementType,
    }),
  };

  const blue = {
    100: '#DAECFF',
    200: '#99CCF3',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
    900: '#003A75',
  };

  const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
  };
  
  const Button = React.forwardRef(function Button(props, ref) {
    const { ownerState, ...other } = props;
    return (
      <button type="button" {...other} ref={ref} style={{width:"60%", alignSelf:"center"}}>
        {other.children}
        <UnfoldMoreRoundedIcon />
      </button>
    );
  });
  
  Button.propTypes = {
    children: PropTypes.node,
    ownerState: PropTypes.object.isRequired,
  };
  
  const StyledButton = styled(Button, { shouldForwardProp: () => true })(
    ({ theme }) => `
      font-family: 'IBM Plex Sans', sans-serif;
      font-size: 0.875rem;
      box-sizing: border-box;
      min-width: 60%;
      width: 60%;
      padding: 8px 12px;
      border-radius: 8px;
      text-align: left;
      line-height: 1.5;
      background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'}!important;
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]}!important;
      color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]}!important;
    position: relative;
    box-shadow: 0 2px 4px ${
      theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
    };
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  
    &:hover {
      background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
    }
  
    &.${selectClasses.focusVisible} {
      outline: 0;
      border-color: ${grey[400]}!important;
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? grey[700] : grey[200]}!important;
    }
  
    & > svg {
      font-size: 1rem;
      position: absolute;
      height: 100%;
      top: 0;
      right: 10px;
    }
    `,
  );  
  
  const Listbox = styled('ul')(
    ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    box-sizing: border-box;
    padding: 6px;
    margin: 12px 36%;
    min-width: 150px;
    align-self: center;
    border-radius: 12px;
    overflow: auto;
    outline: 0;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'} !important;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]} !important;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]} !important;
    box-shadow: 0 2px 4px ${
      theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
    } !important;
    
    .closed & {
      opacity: 0;
      transform: scale(0.95, 0.8);
      transition: opacity 200ms ease-in, transform 200ms ease-in;
    }
    
    .open & {
      opacity: 1;
      transform: scale(1, 1);
      transition: opacity 100ms ease-out, transform 100ms cubic-bezier(0.43, 0.29, 0.37, 1.48);
    }
  
    .placement-top & {
      transform-origin: bottom;
    }
  
    .placement-bottom & {
      transform-origin: top;
    }
    `,
  );
  
  const AnimatedListbox = React.forwardRef(function AnimatedListbox(props, ref) {
    const { ownerState, ...other } = props;
    const popupContext = React.useContext(PopupContext);
  
    if (popupContext == null) {
      throw new Error(
        'The `AnimatedListbox` component cannot be rendered outside a `Popup` component',
      );
    }
  
    const verticalPlacement = popupContext.placement.split('-')[0];
  
    return (
      <CssTransition
        className={`placement-${verticalPlacement}`}
        enterClassName="open"
        exitClassName="closed"
      >
        <Listbox {...other} ref={ref} />
      </CssTransition>
    );
  });
  
  AnimatedListbox.propTypes = {
    ownerState: PropTypes.object.isRequired,
  };
  
  const Option = styled(BaseOption)(
    ({ theme }) => `
    list-style: none;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
  
    &:last-of-type {
      border-bottom: none;
    }
  
    &.${optionClasses.selected} {
      background-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]} !important;
      color: ${theme.palette.mode === 'dark' ? grey[100] : grey[900]} !important;
    }
  
    &.${optionClasses.highlighted} {
      background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]} !important;
      color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]} !important;
    }
  
    &:focus-visible {
      outline: 3px solid ${grey[600]} !important;
      outline-offset: 2px !important;
    }
  
    &.${optionClasses.highlighted}.${optionClasses.selected} {
      background-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]} !important;
      color: ${theme.palette.mode === 'dark' ? grey[100] : grey[900]} !important;
    }

    &:hover {
      background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
    }
  `
  );
  
  const Popup = styled('div')`
    z-index: 1;
  `;

  useEffect(() => {
    const initialValue = getCurrentTipologia();
    setSelectedValue(initialValue);
  }, [select, datasForUpdate]);

  const handleSelectChange = (event, newValue) => {
    const value = newValue ?? (event?.target?.textContent ?? "");
    if (!value) return;
  
    setSelectedValue(value);

    
    setFormData((prev) => ({
      ...prev
    }));
  };
  
  return (
    <Select
      name="tipologia"
      value={selectedValue}
      onChange={(e, newValue) => handleSelectChange(e, newValue)}
    >
      {select === "outcome" ? 
      valoriOutcome.map((valore) => (
        <Option key={valore} value={valore}>
          {valore}
        </Option>
      ))
      :
      valoriIncome.map((valore) => (
        <Option key={valore} value={valore}>
          {valore}
        </Option>
      ))
    }
    </Select>
  );
}