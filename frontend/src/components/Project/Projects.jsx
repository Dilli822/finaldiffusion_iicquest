import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

const projects = [
  {
    id: 1,
    title: "Project 1",
    description: "Description of Project 1",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    id: 2,
    title: "Project 2",
    description: "Description of Project 2",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    id: 3,
    title: "Project 3",
    description: "Description of Project 3",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    id: 4,
    title: "Project 4",
    description: "Description of Project 4",
    imageUrl: "https://via.placeholder.com/300",
  },
];

const Projects = () => {
  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>
      <Grid container spacing={2}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={3} lg={3} key={project.id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                component="img"
                height="140"
                image={project.imageUrl}
                alt={project.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {project.title}
                </Typography>
                <Typography>{project.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Projects;
