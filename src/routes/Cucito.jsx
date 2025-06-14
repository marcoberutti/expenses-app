import { useState } from 'react'
import Intestazione from '../components/utils/Intestazione.tsx'
import Loader from '../components/utils/Loader';
import { useData } from '../dataContext';
import HomeForm from '../components/forms/HomeForm';
import HomeFormModifica from '../components/forms/HomeFormModifica';
import TableCucito from '../components/cucito/TableCucito';
import { Paper, TableContainer } from '@mui/material';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Clienti from '../components/cucito/Clienti';
import Materiali from '../components/cucito/Materiali';
import { CucitoProvider } from '../cucitoContext';
import GraficoCucito from '../components/cucito/GraficoCucito.tsx';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={index}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: {index},
  };
}

export default function Cucito(){

  const { isLoading, modal } = useData();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function setWhatModalSays(){
    switch (modal) {
      case "modifica":
        return <HomeFormModifica /> 
      case "form":
        return <HomeForm />
      case "normal":
        return (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', p:0 }}>
              <Tabs value={value} onChange={handleChange} component={Paper}>
                <Tab sx={{fontSize:"1.2rem"}} label={<i className="bi bi-currency-euro"></i>} {...a11yProps(0)}/>
                <Tab sx={{fontSize:"1.2rem"}} label={<i className="bi bi-people"></i>} {...a11yProps(1)} />
                <Tab sx={{fontSize:"1.2rem"}} label={<i className="bi bi-tools"></i>} {...a11yProps(2)} />
                <Tab sx={{fontSize:"1.2rem"}} label={<i className="bi bi-graph-up-arrow"></i>} {...a11yProps(3)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <TableCucito />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Clienti />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <Materiali />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              <GraficoCucito />
            </CustomTabPanel>
          </>
        )
      default:
    }
  }
  
  return(
    <>
      { isLoading ? <Loader/> :
        <div style={{padding:"0 15px"}}>
          <Intestazione
            title = "Pagina del cucito"
          />
          {setWhatModalSays()}
        </div>
      }
    </>
  )
}