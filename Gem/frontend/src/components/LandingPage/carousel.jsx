import React, { useState, useEffect } from "react";
import { Box, Button, Slider, SliderItem, Typography } from "@mui/material";

const images = [
  "https://via.placeholder.com/600x400/ff0000/ffffff",
  "https://via.placeholder.com/600x400/00ff00/ffffff",
  "https://via.placeholder.com/600x400/0000ff/ffffff",
];

const Carousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Auto slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", position: "relative" }}>
      <Slider
        index={index}
        onChangeIndex={(newIndex) => setIndex(newIndex)}
        autoPlay
        disableDragging
        interval={6000} // Optional: custom interval (in ms)
      >
        {images.map((image, idx) => (
          <SliderItem key={idx}>
            <img
              src={image}
              alt={`Slide ${idx}`}
              style={{ width: "100%", height: "100%" }}
            />
          </SliderItem>
        ))}
      </Slider>
      <Button
        onClick={handlePrev}
        sx={{
          position: "absolute",
          top: "50%",
          left: 10,
          transform: "translateY(-50%)",
        }}
      >
        Prev
      </Button>
      <Button
        onClick={handleNext}
        sx={{
          position: "absolute",
          top: "50%",
          right: 10,
          transform: "translateY(-50%)",
        }}
      >
        Next
      </Button>
      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
        }}
      >
        Slide {index + 1} of {images.length}
      </Typography>
    </Box>
  );
};

export default Carousel;
