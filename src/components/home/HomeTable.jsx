import { useData } from "../../dataContext";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import HomeTableTbody from "./HomeTableTbody";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { TableCell } from "@mui/material";
import "bootstrap-icons/font/bootstrap-icons.css";
import style from "../../routes/home.module.css"
import MonthSelect from "../utils/MonthSelect";

export default function HomeTable() {
  const { handleToggleModals } = useData();
  
  const [filteredDatas, setFilteredDatas] = useState([]);

  return (
    <div>
      <MonthSelect setFilteredDatas={setFilteredDatas} cucito={false}/>
      <br/>
      <br/>
      <TableContainer component={Paper}>
          <HomeTableTbody
            handleToggleModals={handleToggleModals}
            filteredDatas={filteredDatas}
          />
      </TableContainer>
    </div>
  );
}


