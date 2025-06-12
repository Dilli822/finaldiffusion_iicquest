import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Typography,
  Box,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const plans = [
  {
    id: "free",
    title: "Free Plan",
    price: "$0",
    billing: "forever",
    features: ["Basic access", "Limited ", "C"],
  },
  {
    id: "monthly",
    title: "Monthly Plan",
    price: "$9.99",
    billing: "per month",
    features: [
      "Unlimited access",
      "100 GB storage",
      "Priority support",
      "Cancel anytime",
    ],
  },
  {
    id: "yearly",
    title: "Yearly Plan",
    price: "$99.99",
    billing: "per year",
    features: [
      "Unlimited access",
      "1 TB storage",
      "Priority support",
      "2 months free",
    ],
  },
];

function Subscription({ onClose, open }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubscribe = (planId) => {
    alert(`Subscribed to ${planId} plan!`);
    onClose();
  };

  const getStyles = (planId) => {
    switch (planId) {
      case "free":
        return {
          borderColor: "success.main",
          backgroundColor: "success.lighter",
        };
      case "monthly":
        return {
          borderColor: "primary.main",
          backgroundColor: "primary.lighter",
        };
      case "yearly":
        return {
          borderColor: "secondary.main",
          backgroundColor: "secondary.lighter",
        };
      default:
        return {};
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          px: 3,
          py: 2,
        }}
      >
        <IconButton onClick={onClose} aria-label="close" sx={{ ml: "auto" }}>
  <CloseIcon />
</IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 4, px: 3 }}>
        <Grid container spacing={4}>
          {plans.map((plan) => {
            const styles = getStyles(plan.id);
            return (
              <Grid item xs={12} sm={6} md={4} key={plan.id}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: styles.backgroundColor,
                    borderColor: styles.borderColor,
                    boxShadow: 3,
                  }}
                >
                  <Typography variant="h6" fontWeight="600" mb={1}>
                    {plan.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="text.primary"
                  >
                    {plan.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    / {plan.billing}
                  </Typography>

                  <Box component="ul" sx={{ flexGrow: 1, pl: 2, mb: 3 }}>
                    {plan.features.map((feature, index) => (
                      <li key={index}>
                        <Typography variant="body2">{feature}</Typography>
                      </li>
                    ))}
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    color={plan.id === "free" ? "success" : "primary"}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {plan.id === "free" ? "Get Started" : "Subscribe"}
                  </Button>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default Subscription;
