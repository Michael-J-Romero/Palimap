"use client";
import React, { useState, useRef, useEffect } from "react";
import {
    Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  useTheme,
  IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import {types} from '@/data/builtIn'
import AddressAutocomplete from "./searchAdress";

const categories = types//.map((type) => type.name);
// const categories = ["Fire", "Flood", "Earthquake", "Other"];


export default function NewPostButton({ButtonComponent}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    body: "",
    date: dayjs(),
    address: "",
    category: "",
    photo: null,
    previewUrl: null,
  });
  

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleDateChange = (newDate) => {
    setForm((prev) => ({ ...prev, date: newDate }));
  };

  const handleAddressChange = (address, place) => {
    setForm((prev) => ({ ...prev, address }));
    // optionally also store lat/lng: place.geometry?.location.lat() / lng()
  };
const ButtonComponentUsed = ButtonComponent || ButtonComponentDefault;
  return (
    <>
      <ButtonComponentUsed onClick={() => setOpen(true)}/>


      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {
        form.title ? form.title 
          :'New Post'}
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        {/* <DialogContent dividers>
            <div>
               (Post UI under construction)
            </div>
          <TextField
            fullWidth
            label="Title"
            value={form.title}
            onChange={handleChange("title")}
            margin="normal"
          />

<Box sx={{ mt: 2 }}>
  <Typography variant="subtitle2" gutterBottom>
    Photo
  </Typography>
  <Button
    variant="outlined"
    component="label"
    sx={{ width: "100%" }}
  >
    Upload Photo
    <input
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const previewUrl = URL.createObjectURL(file);
          setForm((prev) => ({ ...prev, photo: file, previewUrl }));
        }
      }}
    />
  </Button>

  {form.previewUrl && (
    <Box
      mt={2}
      sx={{
        width: "100%",
        height: 200,
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={form.previewUrl}
        alt="Preview"
        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
      />
    </Box>
  )}
</Box>


            <AddressAutocomplete
                value={form.address}
                onChange={handleAddressChange}
            />
          <TextField
            fullWidth
            label="Body"
            multiline
            rows={4}
            value={form.body}
            onChange={handleChange("body")}
            margin="normal"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={form.date}
              onChange={handleDateChange}
              renderInput={(params) => <TextField fullWidth margin="normal" {...params} />}
            />
          </LocalizationProvider>
          
          <TextField
            fullWidth
            select
            label="Category"
            value={form.category}
            onChange={handleChange("category")}
            margin="normal"
          >
            {categories.map(({type:option,icon}) => (
              <MenuItem key={option} value={option}>
                {icon} {' '} {option}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent> */}


        <DialogContent dividers>
          {/* SIGN IN TO POST */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 200,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Sign in to post
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You need to be signed in to post. Please sign in to your account.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => {
                // Handle sign-in logic here
                console.log("Sign in clicked");
                alert("not functional yet")
              }}
            >
              Sign In
            </Button>
          </Box>
          </DialogContent>


        <DialogActions>
          <Button disabled onClick={() => setOpen(false)}>Cancel</Button>
          <Button disabled onClick={() => { console.log(form); setOpen(false); }} variant="contained">
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const ButtonComponentDefault = ({onClick}) => {

  const theme = useTheme();

  return <Button
        onClick={onClick}
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          whiteSpace: "nowrap",
          width: "max-content",
          px: 2,
          py: 1,
          borderRadius: 3,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: theme.shadows[3],
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          "&:hover": {
            bgcolor: theme.palette.primary.dark,
            transform: "translateY(-1px)",
            boxShadow: theme.shadows[6],
          },
          "&:active": {
            transform: "translateY(0)",
            boxShadow: theme.shadows[2],
          },
        }}
      >
        <Typography variant="button" fontWeight={600}>
          New Post
        </Typography>
      </Button>
}