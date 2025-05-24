import { Box, Typography, CardContent, Divider,Grid,GridItem ,
GridContainer, Card, CardMedia, Button, useTheme, Stack, Avatar, Tooltip } from "@mui/material";

import { format } from 'date-fns';
import LocationDisplay from "./LocationDisplay";
import { useEffect, useRef, useState } from "react";
const imgs = [
  {
    title: "Big Inkstone 4 (2018)",
    url: "https://www.composition.gallery/art/xiaobai-su-big-inkstone-4/"
  },
  {
    title: "Intellectual Aristocracy (2013)",
    url: "https://www.composition.gallery/art/xiaobai-su-intellectual-aristocracy-1/"
  },
  {
    title: "Blue Lacquer Square",
    url: "https://ocula.com/artists/su-xiaobai/"
  },
  {
    title: "Green Crackle Square",
    url: "https://www.pinterest.com/pin/su-xiaobai-biography-artworks-exhibitions--762375043195178008/"
  },
  {
    title: "Beige Crackle Square",
    url: "https://www.pinterest.com/pin/1034631714384060763/"
  },
  {
    title: "Harmony (2006)",
    url: "https://www.mutualart.com/Artwork/Harmony/D9A8AFB8661DB4E9"
  },
  {
    title: "Blue Lacquer Square",
    url: "https://www.pinterest.com/pin/art--559079741254699466/"
  },
  {
    title: "Untitled",
    url: "https://www.mutualart.com/Artwork/Untitled/866E4527B0DBCBA8/"
  }
];

const featherImageEdges = (img, feather = 40) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const w = img.width;
  const h = img.height;
  canvas.width = w;
  canvas.height = h;

  ctx.drawImage(img, 0, 0);

  // Create image data
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;

      const left = x;
      const right = w - x;
      const top = y;
      const bottom = h - y;

      const dist = Math.min(left, right, top, bottom);
      let alphaFactor = 1;

      if (dist < feather) {
        alphaFactor = dist / feather;
      }

      data[idx + 3] *= alphaFactor; // apply to alpha
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
};

function FeatheredSquareImage({ src, feather = 150, ...props }) {
  const [output, setOutput] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // If needed
    img.src = src;
    img.onload = () => {
      const result = featherImageEdges(img, feather);
      setOutput(result);
    };
  }, [src, feather]);

  return output ? <img width={500} src={output} alt="" {...props} /> : null;
}


export default function ChronologicalFeed({ openLocation, parcelData, fireData, posts, body }) {
    const items = [];
    const yearBuilt = parcelData?.properties?.YearBuilt1;
    // if (yearBuilt) {
    //     items.push({
    //         type: 'post',
    //         date: new Date(yearBuilt, 0, 1),
    //         label: `Built in ${yearBuilt}`,
    //         content: (
    //         ),
    //     });
    // }
    if (body) {
        items.push({
            type: 'post',
            date: new Date('2025-01-15'),
            label: 'Fire Damage Reported',
            content: (<div>
                <Typography variant="h6" fontWeight="bold" sx={{
                    textAlign: 'center',
                    color: 'text.primary',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    mt: 1,
                }}>
                    Fire Damage
                </Typography>
                <Typography variant="body2">{body}</Typography>
                {yearBuilt&&<Typography variant="body2" sx={{
                    textAlign: 'center',
                    color: 'text.primary',
                    fontSize: '1rem', 
                }}>
                    Year Built:
                    {yearBuilt}
                </Typography>}
            </div>
            ),
        });
    }






    const sortedPosts = (posts || [])
        .filter(Boolean)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    sortedPosts.forEach((postData, ii) => {
        const post = {
            ...postData,
            imageUrl: postData.image,
            excerpt: postData.body,
        };
        items.push({
            type: 'post',
            date: new Date(post.date),
            label: post.title,
            content: (<>
                <Grid container spacing={2} sx={{

                }} >

            {imgs.map((img, idx) => {
                // render grid of images
                return (
                    <Grid item xs={6} sm={4} md={3} key={idx}>
                        <Card sx={{
                            borderRadius: 0,
                            boxShadow: 0,
                            backgroundColor: 'transparent',
                            border: 'none',
                            padding: 0,
                        }}>
                            <a href={img.url} target="_blank" rel="noopener noreferrer">
                                <FeatheredSquareImage src={img.url} alt={img.title} />
                            </a>
                        </Card>
                    </Grid>
                );
            })}
            </Grid>
{/* <FeatheredSquareImage src={'https://img.artlogic.net/w_1320,h_1320,c_limit/exhibit-e/62f52bf90af321abff00fe82/25ca4a09cb5a712e68e31c034176e5f6.jpeg'} /> */}
                <LocationDisplay
                    mini
                    pageData={{ slug: post.id }}
                    onClose={() => { }}
                />
                {
                    <Divider sx={{ my: 2 }} />
                }
            </>
            ),
        });
    });
    items.sort((a, b) => b.date - a.date);
    return (
        <Box sx={{ px: 0, py: 0 ,

            color: 'text.primary',
        }}>
            {items.map((item, idx) => item.type === 'post' ?
                item.content
                : (
                    <div variant="outlined"
                        key={idx} sx={{
                        }}>
                        <CardContent >
                            <Typography variant="caption" color="text.secondary">
                                {format(item.date, 'MMMM dd, yyyy')}
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
                                {item.label}
                            </Typography>
                            <Box mt={1}>{item.content}</Box>
                        </CardContent>
                    </div>
                )
            )}
        </Box>
    );
}
