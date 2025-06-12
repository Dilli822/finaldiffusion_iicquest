// components/DoctorCard.jsx
import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const DoctorCard = ({ doctor }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{doctor.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          {doctor.address}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
