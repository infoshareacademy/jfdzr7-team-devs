import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ButtonGroup, Button } from "@mui/material";
import {
  StyledUserCover,
  StyledLayout,
  StyledUserPhoto,
  StyledAuthorName,
  StyledUserIntro,
  StyledAvatar,
  StyledContent,
  StyledUserData,
  StyledUserNavigation,
} from "./UserProfileStyled";
import { singleUserCollection } from "../../../../api/firebaseIndex";
import { Loader } from "../../../../utils/Loader";
import { onSnapshot } from "firebase/firestore";
import { UserRecipes } from "./UserRecipes";
import { Outlet, Link } from "react-router-dom";

export const UserProfile = () => {
  const [user, setUser] = useState({});
  const [load, setLoad] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const docRef = singleUserCollection(id);
    onSnapshot(docRef, (doc) => {
      setUser(doc.data(), doc.id);
      setLoad(true);
    });
  }, [id, load]);

  if (load === false) {
    return <Loader />;
  }

  return (
    <>
      <StyledLayout>
        <StyledUserIntro>
          <StyledUserCover>
            <StyledAvatar
              alt={user.firstName}
              src={user.avatarUrl}
              sx={{ width: 200, height: 200 }}
            />
          </StyledUserCover>
          <StyledUserData>
            <StyledUserPhoto />
            <StyledAuthorName>
              {user.firstName} {user.lastName}
            </StyledAuthorName>
          </StyledUserData>
        </StyledUserIntro>

        <StyledUserNavigation>
          <ButtonGroup
            disableElevation
            variant="contained"
            aria-label="Disabled elevation buttons"
          >
            <Link to="added">User Recipes</Link>
            <Link to="following">User Favourites</Link>
          </ButtonGroup>
        </StyledUserNavigation>

        <StyledContent>
          <Outlet />
        </StyledContent>
      </StyledLayout>
    </>
  );
};
