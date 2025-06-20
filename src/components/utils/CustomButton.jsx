import { Button, IconButton } from "@mui/material"

export default function CustomButton({icon, title, onClick, type}){

  return(
    <>
      { icon ? 
        <IconButton size="small"
            style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
            onClick={onClick}
            >
            <i className={icon} style={{fontSize:"1.5rem"}}></i>
        </IconButton> 
        :
        <Button
        variant="contained"
        type={type === "submit" ? "submit" : undefined}
        color="inherit"
        sx={{width:"fit-content", alignSelf:"center",borderRadius:"20px"}}
        >
        {title && title}
        </Button>
      }
    </>
  )
}