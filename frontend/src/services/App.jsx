import { useEffect, useState } from 'react'
import axios from 'axios'
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';    
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Layout from '../Layout/Layout';


function App() {
  const [subcribers, setSubscribers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/suscribers');
    setSubscribers(response.data);
  }

  const handleSumit = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://127.0.0.1:8000/api/suscribers',{name, email});
    setSubscribers([...subcribers, response.data]);
  }
  return(
      <Container maxWidth="lg" sx={{ mt: 4, px: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Prueba
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Suscriptores" />
        </ListItem>
        {subcribers.map((subscriber) => (
          <ListItem key={subscriber.id}>
            <ListItemText primary={`${subscriber.name} - ${subscriber.email}`} />
          </ListItem>
        ))}
      </List>
      <FormControl component="form" onSubmit={handleSumit} style={{ marginTop: '2rem' }}>
        <TextField
          label="Nombre"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSumit}>
          Suscribirse
        </Button>
      </FormControl>
    </Container>
  )
}

export default App;
