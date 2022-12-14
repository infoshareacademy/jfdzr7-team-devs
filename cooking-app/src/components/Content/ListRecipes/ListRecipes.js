import { onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useReducer, useState } from "react";
import { recipesCollection, tags } from "../../../api/firebaseIndex";
import { getDataFromSnapshot } from "../../../utils/GetDataFromSnapshot";
import { PageTitle } from "../../../utils/styles/Global.styled";
import { InputElement } from "../../../utils/Search/InputElement";
import { Button, Grid, Box, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import { SingleCard } from "../../../utils/SingleCard/SingleCard";
import { WrongPage } from "../../../utils/WrongPage";

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

export const ListRecipes = () => {
  const { tag } = useParams();

  const [datafromFirebase, setdatafromFirebase] = useState([]);
  const [visible, setVisible] = useState(12);
  const [moreTags, setMoreTags] = useState(10);

  const [state, dispatcher] = useReducer(reducer, {
    inputCategory: tag ? [tag] : "",
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
    const q = query(recipesCollection, where("isApproved", "==", true));
    onSnapshot(q, (snapshot) => {
      setdatafromFirebase(getDataFromSnapshot(snapshot));
    });
  }, []);

  const showMoreItems = () => {
    setVisible((prev) => prev + 8);
  };

  const showMoreTags = () => {
    setMoreTags(100);
  };

  const showLessTags = () => {
    setMoreTags(10);
  };

  const listofRecipe2 = datafromFirebase
    .filter((item) => {
      if (state.inputCategory.length > 0) {
        let arr = state.inputCategory.filter((tag) =>
          item.tags?.concat(item.specialDiets).includes(tag)
        );
        return !(arr.length === 0);
      } else if (state.textInput.toLowerCase() === "") {
        return item;
      } else return item.name?.toLowerCase().includes(state.textInput);
    })
    .slice(0, visible)
    .map((singleRecipe, index) => {
      return (
        <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
          <SingleCard singleRecipe={singleRecipe} />
        </Grid>
      );
    });

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", md: "left" },
          flexGrow: "1",
        }}
      >
        <PageTitle>Recipes</PageTitle>
      </Box>
      <TextField
        fullWidth
        id="filter"
        placeholder="please enter the recipe name..."
        variant="outlined"
        value={state.textInput}
        type="text"
        onChange={handelTextInput}
      />
      <br />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          my: 2,
          justifyContent: "center",
        }}
      >
        {tags.map((singleTag, index) => {
          if (index < moreTags) {
            return (
              <InputElement
                isClicked={state.inputCategory.includes(singleTag)}
                key={index}
                tag={singleTag}
                handleInput={handleInput}
              />
            );
          }
        })}
      </Box>
      <Box sx={{ justifyContent: "center", display: "flex" }}>
        {moreTags < 20 ? (
          <Button onClick={showMoreTags} variant="contained" sx={{}}>
            Show more tags
          </Button>
        ) : (
          <Button onClick={showLessTags} variant="contained" sx={{}}>
            Show less tags
          </Button>
        )}
      </Box>

      <Grid
        direction="row"
        justifyContent="center"
        container
        spacing={4}
        sx={{ py: 5 }}
      >
        {listofRecipe2.length ? listofRecipe2 : <WrongPage />}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {listofRecipe2.length ? (
          <Button onClick={showMoreItems} variant="contained" sx={{ mb: 10 }}>
            Show more
          </Button>
        ) : null}
      </Box>
    </Box>
  );
};
