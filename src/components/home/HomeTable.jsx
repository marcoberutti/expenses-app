import React from "react";
import PropTypes from "prop-types";
import { useData } from "../../dataContext";
import { Select as BaseSelect, selectClasses } from "@mui/base/Select";
import { Option as BaseOption, optionClasses } from "@mui/base/Option";
import { styled } from "@mui/system";
import UnfoldMoreRoundedIcon from "@mui/icons-material/UnfoldMoreRounded";
import { CssTransition } from "@mui/base/Transitions";
import { PopupContext } from "@mui/base/Unstable_Popup";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import HomeTableTbody from "./HomeTableTbody";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import { format, getYear } from "date-fns";
import { it } from "date-fns/locale";
import { TableCell } from "@mui/material";
import "bootstrap-icons/font/bootstrap-icons.css";
import style from "../../routes/home.module.css"

export default function HomeTable() {
  const { datas, handleToggleModals } = useData();
  
  const [filteredDatas, setFilteredDatas] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const thisYear = getYear(new Date());

  useEffect(() => {
    filterDataByMonth(selectedMonth);
  }, [datas, selectedMonth]);

  function filterDataByMonth(month) {
    const startOfMonth = new Date(thisYear, month, 1).getTime();
    const endOfMonth = new Date(thisYear, month + 1, 1).getTime();

    const newDatas = datas.filter((dato) => {
      const dataDate = new Date(dato.data).getTime();
      return dataDate >= startOfMonth && dataDate < endOfMonth
    })

    const datasWithoutCucito = newDatas.filter(dato => {
      return dato.cucito_in === null && dato.cucito_out === null
    })

    setFilteredDatas(datasWithoutCucito);
  }

  function handleChangeMonth(event, newValue) {
    if (newValue !== null) {
      setSelectedMonth(newValue);
    }
  }

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
      <button type="button" {...other} ref={ref}>
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
    min-width: 200px;
    padding: 8px 12px;
    border-radius: 8px;
    text-align: left;
    line-height: 1.5;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
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
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[700] : blue[200]};
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
    margin: 12px 0;
    min-width: 200px;
    border-radius: 12px;
    overflow: auto;
    outline: 0;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    box-shadow: 0 2px 4px ${
      theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
    };
    
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
    cursor: default;
  
    &:last-of-type {
      border-bottom: none;
    }
  
    &.${optionClasses.selected} {
      background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
      color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
    }
  
    &.${optionClasses.highlighted} {
      background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
      color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    }
  
    &:focus-visible {
      outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }
    
    &.${optionClasses.highlighted}.${optionClasses.selected} {
      background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
      color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
    }
  
    &.${optionClasses.disabled} {
      color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
    }
  
    &:hover:not(.${optionClasses.disabled}) {
      background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
      color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    }
    `,
  );
  
  const Popup = styled('div')`
    z-index: 1;
  `;

  return (
    <div>
      <div style={{display: "flex", justifyContent:"space-evenly", alignItems: "center"}}>
        <Select onChange={handleChangeMonth} value={selectedMonth}>
          {Array.from({ length: 12 }, (_, i) => (
            <Option key={i} value={i}>
              {format(new Date(thisYear, i, 1), "MMMM", { locale: it })}
            </Option>
          ))}
        </Select>
      </div>
      <br/>
      <br/>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{textAlign: "center", fontSize:"1.1rem"}}><i className="bi bi-journal-text"></i></TableCell>
              <TableCell style={{textAlign: "center", fontSize:"1.1rem"}}><i className={`bi bi-cash-coin ${style.income}`}></i></TableCell>
              <TableCell style={{textAlign: "center", fontSize:"1.1rem"}}><i className="bi bi-cart"></i></TableCell>
              <TableCell style={{textAlign: "center", fontSize:"1.1rem"}}><i className="bi bi-fuel-pump"></i></TableCell>
              <TableCell style={{textAlign: "center", fontSize:"1.1rem"}}><i className="bi bi-plus-circle"></i></TableCell>
              <TableCell style={{textAlign: "center", fontSize:"1.1rem"}}><i className="bi bi-house"></i></TableCell>
              <TableCell style={{textAlign: "center", fontSize:"1.1rem"}}><i className="bi bi-heart-pulse"></i></TableCell>
              <TableCell style={{textAlign: "center", fontSize:"1.1rem"}}><i className={`bi bi-currency-dollar ${style.income}`}></i></TableCell>
              <TableCell style={{textAlign: "center", fontSize:"1.1rem"}}><i className={`bi bi-cash-coin ${style.taxes}`}></i></TableCell>
            </TableRow>
          </TableHead>
          <HomeTableTbody
            handleToggleModals={handleToggleModals}
            filteredDatas={filteredDatas}
          />
        </Table>
      </TableContainer>
    </div>
  );
}


