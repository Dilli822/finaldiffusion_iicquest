import React, { useEffect } from "react";
import { Box, Typography, Link, Grid, Container } from "@mui/material";
import XIcon from "@mui/icons-material/X";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

function AppFooter() {
  useEffect(() => {
    if (!window.googleTranslateScriptAdded) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        );
      };

      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateScriptAdded = true;
    }
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#222222",
        color: "white",
        py: 4,
        mt: "auto",
      }}
    >
      <Container sx={{ display: "flex", flexDirection: "column" }}>
        <Grid container spacing={4} justifyContent="center">
          {/* Links + Translate */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              {["Home", "About Us", "Contact Us", "FAQ", "Terms & Conditions", "Privacy Policy"].map(
                (label, index) => (
                  <Link key={index} href="#" color="inherit" underline="none">
                    {label}
                  </Link>
                )
              )}
              <Box id="google_translate_element" sx={{ minWidth: 120 }} />
            </Box>
          </Grid>

          {/* Social Icons */}
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            {[XIcon, FacebookIcon, WhatsAppIcon].map((Icon, idx) => (
              <Link key={idx} href="#" color="inherit" sx={{ mx: 1 }}>
                <Icon />
              </Link>
            ))}
          </Grid>

          {/* Bottom Row */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                px: 2,
              }}
            >
              <Typography variant="body2">Designed By Final Diffusion</Typography>
              <Typography variant="body2">
                &copy; {currentYear} All Rights Reserved
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default AppFooter;
