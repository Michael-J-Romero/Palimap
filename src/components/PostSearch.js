import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Link,
  ClickAwayListener,
  Popper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import NextLink from 'next/link';

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

export default function PostSearch({ posts }) {
  const [query, setQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const listRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return posts.filter(post => {
      const titleMatch = post.title.toLowerCase().includes(q);
      const excerptMatch = post.excerpt.toLowerCase().includes(q);
      return titleMatch || excerptMatch;
    });
  }, [posts, query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!query || filtered.length === 0) return;
      if (e.key === 'ArrowDown') {
        setFocusedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        setFocusedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        window.open(filtered[focusedIndex].imageUrl, '_blank');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filtered, query, focusedIndex]);

  return (
    <ClickAwayListener onClickAway={() => setShowResults(false)}>
      <Box sx={{ position: 'relative', flexGrow: 1 }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setFocusedIndex(-1);
            setShowResults(true);
            setAnchorEl(e.currentTarget);
          }}
          onFocus={(e) => {
            setShowResults(true);
            setAnchorEl(e.currentTarget);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{
            mb: 0,
            '& .MuiInputBase-root': {
              paddingY: '2px',
              height: 36,
            }
          }}
        />

        <Popper
          open={Boolean(query && showResults)}
          anchorEl={anchorEl}
          placement="bottom-start"
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: [0, 4],
              },
            },
            {
              name: 'preventOverflow',
              options: {
                boundary: 'viewport',
              },
            },
          ]}
          style={{ zIndex: 1300 }}
        >
          <Paper
            variant="outlined"
            sx={{
              width: 600,
              maxHeight: 300,
              overflowY: 'auto',
              boxShadow: 3,
              backgroundColor: 'background.paper',
            }}
          >
            <List ref={listRef}>
              {filtered.length > 0 ? (
                filtered.map((post, idx) => {
                  const q = query.toLowerCase();
                  const titleMatch = post.title.toLowerCase().includes(q);
                  const excerptMatch = post.excerpt.toLowerCase().includes(q);

                  return (
                    <ListItem disablePadding key={post.id}>
                      <NextLink href={`/community/board/${post.id}`} passHref legacyBehavior>
  <ListItemButton
    component="a"
    selected={idx === focusedIndex}
    onMouseEnter={() => setFocusedIndex(idx)}
    target="_blank"
    rel="noopener"
  >
                        <ListItemText
                          primary={highlightMatch(post.title, query)}
                          secondary={
                            excerptMatch && !titleMatch
                              ? highlightMatch(post.excerpt, query)
                              : null
                          }
                          primaryTypographyProps={{ color: 'primary' }}
                          secondaryTypographyProps={{ color: 'text.secondary' }}
                        />
                        <OpenInNewIcon fontSize="small" color="action" />
                      </ListItemButton>
                    </NextLink>
                    </ListItem>
                  );
                })
              ) : (
                <ListItem>
                  <ListItemText primary="No posts found." />
                </ListItem>
              )}
            </List>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
