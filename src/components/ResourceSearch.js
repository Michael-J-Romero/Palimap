import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Link,
  ClickAwayListener
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

function highlightMatch(text, query) {
  if (!query) return text;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

export default function ResourceSearch({ resources, featuredResources = [] }) {
  const [query, setQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const listRef = useRef(null);

  const flatResources = useMemo(() => {
    return Object.entries(resources).flatMap(([category, data]) =>
      data.items.map(item => ({ ...item, category }))
    );
  }, [resources]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return flatResources.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(q);
      const descriptionMatch = item.description.toLowerCase().includes(q);
      const categoryMatch = item.category.toLowerCase().includes(q);
      return titleMatch || descriptionMatch || categoryMatch;
    });
  }, [flatResources, query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!query || filtered.length === 0) return;
      if (e.key === 'ArrowDown') {
        setFocusedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        setFocusedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        window.open(filtered[focusedIndex].link, '_blank');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filtered, query, focusedIndex]);

  return (
    <ClickAwayListener onClickAway={() => setShowResults(false)}>
      <Box>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search resources..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setFocusedIndex(-1);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{ mb: 2 }}
        />

        {query && showResults && (
          <Paper variant="outlined">
            <List ref={listRef}>
              {filtered.length > 0 ? (
                filtered.map((res, idx) => {
                  const q = query.toLowerCase();
                  const titleMatch = res.title.toLowerCase().includes(q);
                  const descriptionMatch = res.description.toLowerCase().includes(q);

                  return (
                    <ListItem disablePadding key={`${res.title}-${idx}`}> 
                      <ListItemButton
                        selected={idx === focusedIndex}
                        onMouseEnter={() => setFocusedIndex(idx)}
                        component={Link}
                        href={res.link}
                        target="_blank"
                        rel="noopener"
                      >
                        <ListItemText
                          primary={highlightMatch(res.title, query)}
                          secondary={
                            descriptionMatch && !titleMatch
                              ? highlightMatch(res.description, query)
                              : null
                          }
                          primaryTypographyProps={{ color: 'primary' }}
                          secondaryTypographyProps={{ color: 'text.secondary' }}
                        />
                        <OpenInNewIcon fontSize="small" color="action" />
                      </ListItemButton>
                    </ListItem>
                  );
                })
              ) : (
                <ListItem>
                  <ListItemText primary="No resources found." />
                </ListItem>
              )}
            </List>
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
}
