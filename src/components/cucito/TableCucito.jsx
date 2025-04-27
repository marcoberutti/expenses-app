import React, { useEffect, useState } from 'react'
import { useData } from '../../dataContext';
import { useCucito } from '../../cucitoContext';
import { Table, TableBody, TableHead, TableRow, TableCell, Box, Button, Input } from '@mui/material';
import { format } from 'date-fns';
import { it } from "date-fns/locale";
import {formatCurrency} from '../../utils'
import {parseEuroString} from '../../utils'
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function TableCucito(){

  const { datas, setSelect, ottieniDati, getDataForUpdateForm, setModal } = useData();
  const { trasferimento } = useCucito();
  const [datiFiltrati, setDatiFiltrati] = useState([])
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [erroreTrasferimento, setErroreTrasferimento] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (datas.length === 0) {
      ottieniDati("expenses");
    }
  }, [ottieniDati, datas.length]);

  useEffect(() => {
    const newDatas = datas.filter(dato => dato.cucito_in !== null || dato.cucito_out !== null);
    setDatiFiltrati(newDatas);
  }, [datas]);

  const safeSum = (arr, key) => {
    return arr.reduce((acc, curr) => {
      return acc + parseEuroString(curr[key]);
    }, 0);
  };

  function handleSubmit(){
    if(inputValue <= safeSum(datiFiltrati, 'cucito_in')){

      const data = {
        data: format(new Date(), "yyyy-MM-dd hh:mm:ss"),
        descrizione: "girofondo",
        importo: inputValue,
      }
      trasferimento(data)
    } else {
      setErroreTrasferimento(true)
      setTimeout(() => {
        setErroreTrasferimento(false)
      }, 2000);
    }
  }
  
  return(
    <>
      <Box sx={{display:"flex", justifyContent: "space-between", alignItems:"center", px:3}}>
        <p>Income netto: {formatCurrency((safeSum(datiFiltrati, 'cucito_in')-safeSum(datiFiltrati, 'cucito_out')))}</p>
        <Button 
          onClick={handleOpen}
          style={{display: "flex", justifyContent: "space-between", alignItems:"center", gap:"5px"}}
        >
          <AutorenewIcon/>
          Prelievo
        </Button>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style} style={{display:"flex", justifyContent:"center", flexDirection:"column"}}>
          <Box style={{display:"flex", justifyContent:"center"}}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Importo da prelevare
            </Typography>
            <Input
              onChange={(e) => setInputValue(e.target.value)}
              />
            <Button
              onClick={()=> handleSubmit()}
              >
              <ArrowForwardIcon/>
            </Button>
          </Box>
          {erroreTrasferimento && 
          <Box style={{display:"flex", justifyContent:"center"}}>
            <p style={{backgroundColor:"red", width:"fit-content", borderRadius:"6px", padding:"8px"}}>Importo superiore al guadagnato!</p>
          </Box>
          }
        </Box>
      </Modal>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Data</TableCell>
            <TableCell>Descrizione</TableCell>
            <TableCell sx={{ color: "green", fontWeight: "bold", fontSize: "1.2rem" }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <span>In</span>
                <span style={{ color: "white", fontWeight: "normal", fontSize: ".8rem" }}>
                  Tot: {formatCurrency(safeSum(datiFiltrati, 'cucito_in'))}
                </span>
              </Box>
            </TableCell>

            <TableCell sx={{ color: "red", fontWeight: "bold", fontSize: "1.2rem" }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <span>Out</span>
                <span style={{ color: "white", fontWeight: "normal", fontSize: ".8rem" }}>
                  Tot: {formatCurrency(safeSum(datiFiltrati, 'cucito_out'))}
                </span>
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {datiFiltrati.map((data) => (
          <TableRow 
          key={data.id}
          onClick={()=>{
            if(data.Income || data.cucito_in){
              setSelect("income")
            } else {
              setSelect("outcome")
            }
            getDataForUpdateForm(data)
            setModal("modifica")}
          }>
            <TableCell>{format(data.data, "dd-MMM", { locale: it })}</TableCell>
            <TableCell>{data && data.descrizione}</TableCell>
            <TableCell>{data.cucito_in && formatCurrency(data.cucito_in)}</TableCell>
            <TableCell>{data.cucito_out && formatCurrency(data.cucito_out)}</TableCell>
          </TableRow>
        ))}
        </TableBody>
      </Table>
    </>
  )
}