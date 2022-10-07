import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getDoc, onSnapshot, query } from "firebase/firestore";
import {
  bannerCollection,
  singleRecipeCollection,
} from "../../../../api/firebaseIndex";
import {
  StyledDescription,
  StyledNavigation,
  StyledSlider,
  StyledImg,
  StyledDescriptionText,
  BannerTitle,
} from "../MainBanner/MainBanner.styled";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { IconButton, Paper, Button, Box, Typography } from "@mui/material";
import { Loader } from "../../../../utils/Loader";

export const MainBanner = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [datafromFirebase, setdatafromFirebase] = useState([]);

  const preventUpdate = useRef(false);

  useEffect(() => {
    if (!preventUpdate.current) {
      const q = query(bannerCollection);

      onSnapshot(q, (snapshot) => {
        snapshot.forEach((doc) => {
          setdatafromFirebase([]);
          doc.data().bannerArray.forEach((id) => {
            getDoc(singleRecipeCollection(id)).then((recipe) => {
              setdatafromFirebase((current) => [
                ...current,
                { ...recipe.data(), id: id },
              ]);
            });
          });
        });
        preventUpdate.current = true;
      });
    }
  }, []);

  const goToNextSlide = () => {
    if (currentSlideIndex === datafromFirebase.length - 1) {
      setCurrentSlideIndex(0);
    } else {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlideIndex === 0) {
      setCurrentSlideIndex(datafromFirebase.length - 1);
    } else {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  return (
    <>
      {datafromFirebase != 0 ? (
        <Paper sx={{ mb: 5 }}>
          <StyledSlider
            sx={{
              flexDirection: { xs: "column", md: "row" },
              height: { md: "450px" },
              minHeight: { xs: "600px", md: "450px" },
            }}
          >
            <Paper
              sx={{
                flex: 1,
                width: { xs: "100%", md: "60%" },
                maxHeight: { xs: "700px", md: "450px" },
              }}
            >
              <StyledImg
                src={datafromFirebase[currentSlideIndex].image}
                alt={datafromFirebase[currentSlideIndex].name}
              />
            </Paper>

            <StyledDescription
              elevation={0}
              sx={{
                width: { xs: "100%", md: "40%" },
                textAlign: { xs: "center", md: "left" },
                backgroundColor: "secondary.main",
              }}
            >
              <StyledDescriptionText>
                <BannerTitle>
                  {datafromFirebase[currentSlideIndex].name}
                </BannerTitle>
                <Typography variant="body1" sx={{ my: 2 }}>
                  {datafromFirebase[currentSlideIndex].metaDescription}
                </Typography>
              </StyledDescriptionText>
              <Box
                sx={{
                  textAlign: { xs: "center", md: "right" },
                }}
              >
                <Button
                  variant="contained"
                  component={Link}
                  to={`/recipe/${datafromFirebase[currentSlideIndex].id}`}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Check it!
                </Button>
              </Box>
            </StyledDescription>

            <StyledNavigation>
              <IconButton aria-label="previous" onClick={goToPreviousSlide}>
                <ArrowBackIosNewIcon fontSize="large" />
              </IconButton>
              <IconButton aria-label="next" onClick={goToNextSlide}>
                <ArrowForwardIosIcon fontSize="large" />
              </IconButton>
            </StyledNavigation>
          </StyledSlider>
        </Paper>
      ) : (
        <Loader />
      )}
    </>
  );
};
