import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Container,
} from "@mui/material";
import AppFooter from "../footer/footer";
import Header from "../header/header";
import PublicHeader from "../header/header_public";

const Question = ({ question, options, selectedOption, onChange }) => {
  return (
    <>
      <PublicHeader />

      <Container>
        <br />
        <Typography variant="h4" gutterBottom>
          Stress/Aptitude Test 🩺
        </Typography>
        <Card variant="outlined" mt={2}>
          <CardContent>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                <Typography variant="h5">{question}</Typography>
              </FormLabel>
              <RadioGroup
                value={selectedOption}
                onChange={onChange}
                name="quiz-options"
              >
                {options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default Question;
