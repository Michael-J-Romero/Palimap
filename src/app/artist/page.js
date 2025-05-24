"use client";
let settings = {
  recentActivityRows: 1
}
import { useState } from "react";
 
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText, 
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia, 
  Divider, useMediaQuery, Stack 
} from "@mui/material";
import Footer from "@/components/Footer";
import { useTheme } from "@mui/material/styles";
import HeroSlideshow from "@/components/HeroSlideshow";
      import { motion } from "framer-motion";
const pySection = 16
const darkBg = '#282936'
const homepageContent = {
  sections: [
    {
      title: "ABOUT THE FOUNDATION",
      align: "left",
      img: "/home1.jpg",
      text: `The Su Xiaobai Foundation was founded in 2024. Sponsored by the artist Su Xiaobai, the Foundation is dedicated to supporting research and greater public interest in the ideas and practice of new generations of international artists. 

 

In particular, the Foundation seeks to support artists who share Su Xiaobai’s commitment to reviving traditional materials and techniques in the production of contemporary art. 

 

The Foundation is building a collection of Su Xiaobai's work. The majority of the collection is donated by the artist himself, and donations from individual collectors and institutions are welcomed. `
    
    },
    {
      title: "ABOUT THE ARTIST",
      align: "right",
      img: "/home2.jpg",
      text: `Su Xiaobai is one of the most significant contemporary Chinese artists working today. His practice bridges traditional Chinese lacquer techniques and modern abstract aesthetics, focusing on surface, texture, and material.`,
    },
    {
      title: "HOW IT WORKS",
      align: "center",
    },
  ],
};

const motionProps = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
  viewport: { once: true , amount: 0.2 },
  exit: { opacity: 0, y: 20 },
}



 
const tabs = ["About", 
  "Chronology", 
  // "Selected Works",
  // "Exhibitions",
  "Bibliography",
  "Publications",
  "Studio",
  "Videos",




];

const HomepageBody = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("about");

  const renderTabContent = () => {

    return (<>
      {getTabContent(activeTab)}
       <br />
            <br />
            <h1>
              Note: this layout has not been designed yet, it is only here to visualize the structure.
            </h1>
    </>)

    function getTabContent(tab) {
    switch (activeTab) {
      case "About":
        return (
          <Typography>
            information and background on Su Xiaobai.
            sections can be separated into tabs in a sidebar.
           

          </Typography>
        );
      case "Chronology":
        return (
          <Typography>
            chronology of Su Xiaobai's life and work.
            <br />
            this can be a timeline or a list of key events.
          </Typography>
        );
      case "Bibliography":
        return (
          <Typography>
            bibliography of Su Xiaobai's work.
            <br />
          </Typography>
        );
      case "Publications":
        return (
          <Typography>
            publications related to Su Xiaobai's work.
            <br />
          </Typography>
        );
      case "Studio":
        return (
          <Typography>
            information about Su Xiaobai's studio.
            </Typography>
        );
      default:
        return null;
    }
  }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Static Left Drawer */}
      <Box
        sx={{
          width: 200,
          backgroundColor: "#f4f4f4",
          borderRight: "1px solid #ccc",
          py: 14,
          px: 2,
        }}
      >
        <List>
          {tabs.map((tab) => (
            <ListItem disablePadding key={tab}>
              <ListItemButton
              color="default"
                selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                <ListItemText primary={tab} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        <motion.div {...motionProps}>
          <Container maxWidth="md" sx={{ py: pySection * 2, pt: pySection * 1.5 }}>
            <SectionDiv title="Su Xiaobai - The Artist" 
             align="left" />
            {renderTabContent()}
          </Container>
        </motion.div>

         
      </Box>
    </Box>
  );
};

function FullWidthSection({ img }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        backgroundColor: darkBg,
        py: pySection,
        px: 4,
        position: "relative",
      }}
    >
      {img === undefined ? (
        <>
          {[
            "there’s nothing here yet",
            "foundation information will be here",
            "including the foundation’s mission, vision, and values",
            "it will be split into 3 sections:",
            "1. about the foundation + mission",
            "2. the foundation’s recent activity / future plans",
            "3. board members",
          ].map((text, i) => (
            <motion.div key={i} {...motionProps}>
              <div style={{ margin: "14px", color: "white" }}>{text}</div>
            </motion.div>
          ))}
        </>
      ) : (
        <img
          src={img}
          alt="Full Width Section"
          style={{
            maxWidth: "1000px",
            width: "100%",
            height: "auto",
          }}
        />
      )}
    </Box>
  );
}
 







function FullWidthSection4({img}) {
  return <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    backgroundColor: darkBg,
    py: pySection,
    px: 4,
    position: 'relative',
  }}>  
            


     {img== undefined ? [

         <motion.div   {...motionProps}  ><div style = {{margin:"14px",color:"white"}}> theres nothing here yet</div></motion.div>,
         <motion.div   {...motionProps}  ><div style = {{margin:"14px",color:"white"}}> foundation information will be here</div></motion.div>,
         <motion.div   {...motionProps}  ><div style = {{margin:"14px",color:"white"}}> including the foundation's mission, vision, and values</div></motion.div>,
         <motion.div   {...motionProps}  ><div style = {{margin:"14px",color:"white"}}> it will be split into 3 sections:</div></motion.div>,
         <motion.div   {...motionProps}  ><div style = {{margin:"14px",color:"white"}}> 1. about the foundation + mission</div> </motion.div>,
         <motion.div   {...motionProps}  ><div style = {{margin:"14px",color:"white"}}> 2. the foundation's recent activity / future plans</div></motion.div>,
         <motion.div   {...motionProps}  ><div style = {{margin:"14px",color:"white"}}> 3. board members</div></motion.div>,
     ]
     :
      <img src={img} alt="Full Width Section" style={{
        maxWidth: '1000px',
        width: '100%',
        height: 'auto',
        /* Add any additional styles here */
      }} />}
      </Box>
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      delay: customDelay,
    },
  }),
};

 function Section({ section }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      <Box sx={{}}>
        <motion.div
  initial={{ x: -100, opacity: 0 }}
  whileInView={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
  viewport={{ once: true, amount: 0.4 }}
  
>
        <SectionDiv title={section.title} align={section.align} />
       </motion.div>
        {section.img && (
          <Media
            img={section.img}
            text={section.text}
            reverse={section.align === "right"}
          />
        )}
      </Box>
    </motion.div>
  );
}

  function Media({ img, text, reverse }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: reverse ? "row-reverse" : "row" },
        gap: 4,
        py: 2,
        // mb: 12,
            // boxShadow: 2,

        mt: 2,
      }}
    >
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        custom={0.1}
        style={{ flex: 1,display: 'flex',  }}
      >
        <CardMedia
          component="img"
          image={img}
          sx={{
            // overflow: "visible",
            boxShadow: 4,
            width: "100%",
            height: "auto",
            borderRadius: .5,
          }}
        />
      </motion.div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        custom={0.2}
        style={{ flex: 1 }}
      >
        <Typography variant="body1" color="text.primary" paragraph>
          {text}
          <br />
          <br />
          {text.split(" ").slice(10, 20).join(" ")}
          {text.split(" ").slice(0, 20).join(" ")}...
        </Typography>
        <motion.div variants={fadeInUp} 
        viewport= {{ once: true , amount: 0.2 }}
        custom={0.2}>
          <Button variant="default" fullWidth sx={{
            border: '1px solid',
            color: 'primary.main',
            borderColor: 'primary.transparent',
          }}>
            Learn More
          </Button>
        </motion.div>
      </motion.div>
    </Box>
  );
}


function SectionDiv({title, align, dark}) {
  return <Box sx={{
        transform: 'scale(1.15)',
        transformOrigin: 'bottom center',
 width: '100%',
    display: 'flex',
    flexDirection: align === 'left' ? 'row' : 'row-reverse' ,
    justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
    alignItems: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
  }} >  
  {align=='center' ? <div style={{
    opacity: 0.3,
    width: '100%',
    height: '1px',
    backgroundColor: dark ? '#fff' : '#000',
    margin: '  4px',
  }} /> : null}
  <Box sx={{
    minWidth: 'max-content',
    flex: 1,
    textAlign: align === 'left' ? 'left' : align === 'right' ? 'right' : 'center',
    px: 2,
    fontSize: '36px',
    ...(align === 'left' ? { 
      pr: 2,
    } : align === 'right' ? { 
      pl: 2,
    } : { 
      px: 2,
    }),
    // fontWeight: 'bold',
  }}>
  <Typography variant="h4" color={dark ? '#fff' : "text.primary" } sx={{
    fontSize: '1.725rem',
    textTransform: 'uppercase',
    letterSpacing: 1,
    lineHeight: 1.2,
    // color: dark ? '#fff' : "text.primary",
  }}>
  {title}
  </Typography>
  </Box>
  <div style={{
    opacity: 0.2,
    width: '100%',
    height: '.8px',
    backgroundColor: dark ? '#fff' : '#000',
    margin: '4px 16px',
  }} />
  </Box>
}


export default HomepageBody;