import { PageTitle } from "../../../utils/styles/Global.styled";
import { useParams, Link } from "react-router-dom";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { recipesCollection } from "../../../api/firebaseIndex";
import { getDataFromSnapshot } from "../../../utils/GetDataFromSnapshot";
import { ERROR_MESSAGE } from "../../../utils/ErrorMessageTexts";
import { Alert } from "@mui/material";
import { Loader } from "../../../utils/Loader";
import { variantType } from "../../../utils/styles/muiStyles";
import styled from "styled-components";
import { DisplayRecipe } from "./DisplayRecipe";

export const SingleRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [load, setLoad] = useState(false);
  const idCurrent = useParams();

  useEffect(() => {
    onSnapshot(recipesCollection, (singleRecipe) => {
      setRecipes(getDataFromSnapshot(singleRecipe));
      setLoad(true);
    });
  }, [load]);

  if (load === false) {
    return <Loader />;
  }

  const ErrorMessage = () => {
    return (
      <Alert severity="error" variant={variantType.outlined}>
        {ERROR_MESSAGE.MISSING_WEBSITE}
      </Alert>
    );
  };

  const recipeFound = recipes.some((item) => {
    if (item.id === idCurrent.id) {
      return true;
    } else return false;
  });

  return <>{recipeFound ? <DisplayRecipe /> : <ErrorMessage />}</>;
};

const StyledLayout = styled.div`
  background-color: lightblue;
`;

const StyledRecipeGallery = styled.div`
  background: lightblue;
  height: 445px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url("https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fG9hdG1lYWx8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60");
`;

const StyledRecipeSection = styled.div`
  flex: 1 0 50%;
  overflow-y: auto;
  padding: 30px;
`;

const StyledCommentInput = styled.div`
  width: 100%;
  display: flex;
`;
