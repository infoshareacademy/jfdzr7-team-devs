import { onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useReducer, useState } from "react";
import { recipesCollection, tags } from "../../../../api/firebaseIndex";
import { getDataFromSnapshot } from "../../../../utils/GetDataFromSnapshot";
import { Button, Grid, TextField, Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { SingleCard } from "../../../../utils/SingleCard/SingleCard";
import { WrongPage } from "../../../../utils/WrongPage";

const reducer = (currState, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        ...currState,
        inputCategory: [...currState.inputCategory, action.payload],
      };
    case "DELETE_ITEM":
      return {
        ...currState,
        inputCategory: currState.inputCategory.filter(
          (tag) => tag !== action.payload
        ),
      };
    case "newTextInput":
      return { ...currState, textInput: action.payload };
    case "inputState":
      return { ...currState, inputState: !currState.inputState };
    default:
      throw new Error();
  }
};

export const UserRecipes = () => {
  const [datafromFirebase, setdatafromFirebase] = useState([]);
  const [visible, setVisible] = useState(12);
  const { id } = useParams();

  const [state, dispatcher] = useReducer(reducer, {
    inputCategory: "",
    textInput: "",
    inputState: false,
  });

  const handelTextInput = (e) => {
    dispatcher({ type: "newTextInput", payload: e.target.value });
  };

  const handleInput = (e) => {
    dispatcher({ type: "inputState" });
    if (e.target.checked) {
      dispatcher({ type: "ADD_ITEM", payload: e.target.name });
    } else {
      dispatcher({ type: "DELETE_ITEM", payload: e.target.name });
    }
  };

  useEffect(() => {
    const q = query(
      recipesCollection,
      where("isApproved", "==", true),
      where("author", "==", id)
    );
    onSnapshot(q, (snapshot) => {
      setdatafromFirebase(getDataFromSnapshot(snapshot));
    });
  }, [id]);

  const showMoreItems = () => {
    setVisible((prev) => prev + 8);
  };

  const moreLoading = datafromFirebase.length - visible;

  const listofRecipe2 = datafromFirebase
    .filter((item) => {
      if (state.inputCategory.length > 0) {
        let arr = state.inputCategory.filter((tag) => item.tags?.includes(tag));
        return !(arr.length === 0);
      } else if (state.textInput.toLowerCase() === "") {
        return item;
      } else return item.name?.toLowerCase().includes(state.textInput);
    })
    .slice(0, visible)
    .map((singleRecipe, index) => {
      return (
        <Grid key={index} item xs={12} sm={12} md={4} lg={3}>
          <SingleCard singleRecipe={singleRecipe} />
        </Grid>
      );
    });

  return (
    <Box>
      {datafromFirebase == 0 ? (
        <Typography sx={{ p: "16px" }}>
          User has not added any recipes yet
        </Typography>
      ) : (
        <Box>
          <TextField
            id="filter"
            placeholder="please enter the recipe name..."
            variant="outlined"
            value={state.textInput}
            type="text"
            onChange={handelTextInput}
            fullWidth
          />

          <Grid
            direction="row"
            justifyContent="center"
            container
            spacing={4}
            sx={{ py: 5 }}
          >
            {listofRecipe2.length ? listofRecipe2 : <WrongPage />}
          </Grid>
          {listofRecipe2.length > 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={showMoreItems}
                variant="contained"
                sx={{ mb: 10 }}
              >
                Show more
              </Button>
            </Box>
          ) : null}
        </Box>
      )}
    </Box>
  );
};
