// components/Header.jsx
"use client";
import React , { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import styled from "styled-components";
import Nav from "./Nav";
import { usePathname, useRouter } from "next/navigation";
import { settings as allSettings } from "@/data/builtIn";

const settings = allSettings;
const Logo = styled(Typography)`
  font-weight: 100;
  font-family: system-ui;
  margin-left: 1rem;
  // letter-spacing: 1px;
  // flex-grow: 1;
`;
const Header = () => { 
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 160); // adjust threshold as needed
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <AppBar
      id="primary-header"
      position="fixed"
      sx={{
        top: 0, 
        // backgroundColor: "#fff8",
        backdropFilter: "blur(10px)",
        color: "text.primary", 
        transition: "background-color 0.3s ease, padding 0.6s ease",
        backgroundColor: scrolled ? "rgb(212, 220, 226)" : 'rgb(200 213 224 / 56%)',
        py: scrolled ? 1.5 : 3.5,
        zIndex: settings.zIndex.header,
      }}
    >
      <Toolbar 
        variant="dense" 
        sx={{
          minHeight: "0px",
          display: "flex",
          justifyContent: "space-between",
          px: 1,
          // py: 2,
        }}
      >
        <Box
          onClick={() => router.push("/", undefined, { shallow: true })}
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            fontSize: "1.7rem",
          }}
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            fontSize: "1.7rem",
            // fontWeight: 100,
            //space letters
            letterSpacing: "5px",
            fontFamily: "system-ui",
            marginLeft: "1rem",
          }}>

          蘇笑柏
          </div>
          <Logo
            onClick={() => router.push("/", undefined, { shallow: true })}
            variant="h6"
            sx={{
              // alignSelf: "flex-end",
              fontWeight: "normal",
              fontSize: scrolled?"1.4rem":'1.45rem',
        transition: "font-size 0.3s ease",

              display: { xs: "none", sm: "block" },
              flexGrow: 0,
              cursor: "pointer",
              
              "&:hover": {
                textDecoration: "underline",
              },
            }} 
          >
            <div style={{
              display: "flex",
              alignItems: "center", 
              // fontSize: "1.3rem",
              fontWeight: 500,
            }}>

            SU XIAOBAI 
            <div style={{
              width: ".45em",
              height: ".45em",
              backgroundColor: "red", 
              borderRadius: "2px",
              marginLeft: ".5em",
              marginRight: ".5em",
              // border: "1px solid darkred",
              boxShadow: "0 0 2px rgba(0,0,0,.2)",
            }}>
            </div>
            FOUNDATION
              </div>
          </Logo> 
        </Box>
        <Nav />
      </Toolbar>
    </AppBar>
  );
};
export default Header;
