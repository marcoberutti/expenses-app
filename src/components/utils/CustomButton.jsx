import { Button, IconButton } from "@mui/material"

export default function CustomButton({icon, title, onClick, type, sx}){

  return(
    <>
      { icon ? 
        <IconButton size="small"
            style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
            onClick={onClick}
            sx={sx}
            >
            <i className={icon} style={{fontSize:"1.5rem"}}></i>
        </IconButton> 
        :
        <Button
        variant="contained"
        type={type === "submit" ? "submit" : undefined}
        color="inherit"
        onClick={onClick}
        sx={{width:"fit-content", alignSelf:"center",borderRadius:"20px", ...sx}}
        >
        {title && title}
        </Button>
      }
    </>
  )
}