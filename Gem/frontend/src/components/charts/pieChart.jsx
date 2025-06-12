import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    IconButton,
    Drawer,
    List,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    CardMedia,
    ListItem,
    ListItemText,
    TextField,
    Menu,
    MenuItem,
    useMediaQuery,
    createTheme, // Import createTheme
  } from "@mui/material";
const data = {
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3],
      backgroundColor: ['red', 'blue', 'yellow'],
      borderColor: ['red', 'blue', 'yellow'],
      borderWidth: 1,
    },
  ],
};

const PieChartComponent = () => (
  <div>
    <h2>Pie Chart Example</h2>

    <Grid container>
    <Grid item md={2}>
<Pie data={data} />
</Grid>
    </Grid>

  </div>
);

export default PieChartComponent;
