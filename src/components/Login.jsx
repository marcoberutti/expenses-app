import { Container, FormControl, Button, Typography} from '@mui/material';
import { useState } from 'react';

export default function MyForm({ handleLogin }) {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  

  function handleChange(e){
    setFormData({
      ...formData, [e.target.name]: e.target.value
    })
  }

  function handleSubmit(e){
    e.preventDefault();
    handleLogin(formData)
  }

  return (
        <Container
          maxWidth="sm" // Imposta una larghezza massima
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh', // Centro verticale
          }}
        >
          <form onSubmit={handleSubmit}> {/* Sposta onSubmit qui */}
            <FormControl required fullWidth>
              <Typography>Email</Typography>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="200px"
              />

              <Typography>Password</Typography>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="20px"
              />
              <br/>
              <Button type="submit" variant="contained" color="primary">
                Send
              </Button>
            </FormControl>
          </form>
        </Container>
  );
}
