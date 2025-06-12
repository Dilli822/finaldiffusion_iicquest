import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  makeStyles,
} from "@material-ui/core";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 500,
    margin: "0 auto",
    borderRadius: 12,
    boxShadow: "0 4px 20px 0 rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  searchField: {
    backgroundColor: theme.palette.background.paper,
    "& .MuiOutlinedInput-root": {
      borderRadius: 12,
      "& fieldset": {
        borderColor: theme.palette.grey[300],
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary.light,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
      },
    },
  },
  list: {
    maxHeight: 300,
    overflow: "auto",
    padding: 0,
    marginTop: theme.spacing(1),
  },
  listItem: {
    padding: "12px 16px",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.Mui-selected": {
      backgroundColor: theme.palette.action.selected,
    },
  },
  noResults: {
    padding: 16,
    color: theme.palette.text.secondary,
    textAlign: "center",
  },
  selectedText: {
    fontWeight: 500,
    color: theme.palette.primary.main,
  },
  normalText: {
    fontWeight: 400,
  },
  highlight: {
    fontWeight: 700,
    backgroundColor: theme.palette.warning.light,
  },
}));

// Highlight matching query in result
const highlightMatch = (text, query, highlightClass) => {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;

  return (
    <>
      {text.substring(0, index)}
      <span className={highlightClass}>{text.substring(index, index + query.length)}</span>
      {text.substring(index + query.length)}
    </>
  );
};

const SearchComponent = ({ placeholder = "Search...", onItemClick }) => {
  const classes = useStyles();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [filtered, setFiltered] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const listRef = useRef(null);

  // Fetch usernames from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/sushtiti/account/profile/full/");
        const usernames = response.data.users.map(user => user.username);
        setUserNames(usernames);
        console.log("Fetched usernames:", usernames);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Filter usernames by query
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFiltered(
        userNames.filter((name) =>
          name.toLowerCase().includes(query.toLowerCase())
        )
      );
      setSelectedIndex(-1);
    }, 200); // Debounce

    return () => clearTimeout(timeout);
  }, [query, userNames]);

  const handleItemClick = (item, index) => {
    setSelectedIndex(index);
    onItemClick?.(item);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      handleItemClick(filtered[selectedIndex], selectedIndex);
    }
  };

  return (
    <Paper className={classes.root} role="search">
      <TextField
        fullWidth
        variant="outlined"
        label={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className={classes.searchField}
      />

      {query && (
        <List className={classes.list} ref={listRef} disablePadding>
          {filtered.length > 0 ? (
            filtered.map((item, index) => (
              <ListItem
                button
                key={index}
                onClick={() => handleItemClick(item, index)}
                className={classes.listItem}
                selected={selectedIndex === index}
              >
                <ListItemText
                  primary={highlightMatch(item, query, classes.highlight)}
                  classes={{
                    primary:
                      selectedIndex === index
                        ? classes.selectedText
                        : classes.normalText,
                  }}
                />
              </ListItem>
            ))
          ) : (
            <Typography className={classes.noResults}>
              No results found for "{query}"
            </Typography>
          )}
        </List>
      )}
    </Paper>
  );
};

export default SearchComponent;
