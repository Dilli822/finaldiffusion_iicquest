import { useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Paper,
  CircularProgress,
  Box,
  Snackbar,
  IconButton,
  Link
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import CloseIcon from '@material-ui/icons/Close';
import Header from "../header/header";
import HeaderPublic from "../header/header_public";
import AppFooter from "../footer/footer";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    maxWidth: 800, // Reduced maxWidth for better single column layout
    margin: "0 auto",
  },
  card: {
    marginBottom: theme.spacing(3),
    borderRadius: 12,
    boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
    width: "100%", // Full width cards
  },
  title: {
    marginBottom: theme.spacing(4),
    color: theme.palette.primary.main,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    marginBottom: theme.spacing(3),
    padding: "12px 32px",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  talentTitle: {
    fontWeight: "bold",
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1),
  },
  chip: {
    margin: theme.spacing(0.5),
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.getContrastText(theme.palette.primary.light),
  },
  roleChip: {
    margin: theme.spacing(0.5),
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.getContrastText(theme.palette.secondary.light),
  },
  pre: {
    whiteSpace: "pre-wrap",
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(2),
    borderRadius: 4,
    maxHeight: 400,
    overflow: "auto",
  },
  centerContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  cardContent: {
    flexGrow: 1,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  sourceLink: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
  linkIcon: {
    marginLeft: theme.spacing(0.5),
    fontSize: '1rem',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
}));

const AiNews = () => {
  const classes = useStyles();
  const [answer, setAnswer] = useState("");
  const [parsedData, setParsedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const askGemini = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDxBUM_2ILGrVwPJKxwYqxvlctOWLf5DU4`,
        {
          contents: [
            {
              parts: [
                { 
                  text: "Provide a detailed analysis of talents and opportunities in Nepal's tech sector with credible sources. " +
                       "Respond in JSON format with exactly 5 items. Each item must include: " +
                       "talent (string), description (string), opportunities (string), " +
                       "related_technologies (array), related_roles (array), and " +
                       "source_url (string with valid URL to a credible source). " +
                       "Ensure all source_urls are real, working links to news articles, " +
                       "government reports, or industry publications."
                },
              ],
            },
          ],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = response.data.candidates[0]?.content?.parts[0]?.text;
      setAnswer(result);
      
      try {
        // Clean the response string if needed
        const cleanedJsonString = result.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanedJsonString);
        setParsedData(Array.isArray(parsed) ? parsed : [parsed]);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        setError("Failed to parse the response. Showing raw data instead.");
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      setError("Failed to fetch data from Gemini API. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (

    <> 
       {localStorage.getItem("accessToken") ? <Header /> : <HeaderPublic />}
    <div className={classes.root}>
      <Typography variant="h4" component="h1" className={classes.title} gutterBottom>
        Tech Talents & Opportunities in Nepal | AI Extracted & Generated News
      </Typography>
      
     <div style={{ textAlign: "center"}}>
       <Button
          variant="contained"
          color="primary"
          onClick={askGemini}
          className={classes.button}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? "Fetching Insights..." : "Get Tech Insights"}
        </Button>
     
     </div>
 

      {loading && !parsedData.length && (
        <Box className={classes.centerContent}>
          <CircularProgress />
        </Box>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        message={error}
        action={
          <IconButton size="small" color="inherit" onClick={handleCloseError}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />

      {parsedData.length > 0 ? (
        <div className={classes.listContainer}>
          {parsedData.map((item, index) => (
            <Card className={classes.card} key={index}>
              <CardContent className={classes.cardContent}>
                <Typography variant="h6" component="h2" className={classes.talentTitle}>
                  {item.talent}
                </Typography>
                
                <Typography variant="body1" paragraph>
                  {item.description}
                </Typography>
                
                <Typography variant="subtitle1" className={classes.sectionTitle}>
                  Opportunities
                </Typography>
                <Typography variant="body1" paragraph>
                  {item.opportunities}
                </Typography>
                
                {item.related_technologies?.length > 0 && (
                  <>
                    <Typography variant="subtitle1" className={classes.sectionTitle}>
                      Related Technologies
                    </Typography>
                    <Box>
                      {item.related_technologies.map((tech, i) => (
                        <Chip 
                          label={tech} 
                          key={`tech-${i}`} 
                          className={classes.chip} 
                          size="small"
                        />
                      ))}
                    </Box>
                  </>
                )}
                
                {item.related_roles?.length > 0 && (
                  <>
                    <Typography variant="subtitle1" className={classes.sectionTitle}>
                      Related Roles
                    </Typography>
                    <Box>
                      {item.related_roles.map((role, i) => (
                        <Chip 
                          label={role} 
                          key={`role-${i}`} 
                          className={classes.roleChip} 
                          size="small"
                        />
                      ))}
                    </Box>
                  </>
                )}

                {item.source_url && isValidUrl(item.source_url) && (
                  <Box mt={2}>
                    <Typography variant="subtitle1" className={classes.sectionTitle}>
                      Source
                    </Typography>
                    <Link 
                      href={item.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={classes.sourceLink}
                    >
                      Read more
                      <OpenInNewIcon className={classes.linkIcon} />
                    </Link>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : answer ? (
        <Paper elevation={3} className={classes.pre}>
          <pre>{answer}</pre>
        </Paper>
      ) : null}
     </div>

    <AppFooter/>
    </>
  );
};

export default AiNews;