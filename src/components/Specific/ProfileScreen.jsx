import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import moment from "moment";
import {
  Face as FaceIcon,
  AlternateEmail as UserIcon,
  CalendarMonth as CalenderIcon,
  Call as CallIcon,
  VideoCall as VideoCallIcon
} from "@mui/icons-material";
import { orange } from "../../Constants/Color";
import { transformImage } from "../../lib/features";
const ProfileScreen = ({user}) => {
  return (
    <Stack spacing={"1.5rem"} direction={"column"} alignItems={"center"}>
      {" "}
      <Avatar
      src={transformImage(user?.avatar?.url)}
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid White",
        }}
      />

<Stack direction={"row"} spacing={"2rem"}>
        <IconButton
          sx={{
            backgroundColor: orange,
            boxSizing: "8rem",
            color:"white",
            borderRadius:"20px",
            padding: "0.8rem",
            "&:hover": {
               bgcolor: "lightgreen",
               color:"black"
            },
          }}
        >
          <CallIcon />
        </IconButton>


        <IconButton
          sx={{
            backgroundColor: orange,
            boxSizing: "8rem",
            color:"white",
            borderRadius:"20px",
            padding: "0.8rem",
            "&:hover": {
              bgcolor: "lightgreen",
              color:"black"
            },
          }}
        >
          <VideoCallIcon />
        </IconButton>
      </Stack>
      
      <ProfileCard heading="bio" text={user?.bio} />
      <ProfileCard
        heading="username"
        text={user?.username}
        Icon={<UserIcon />}
      />
      <ProfileCard heading="Name" text={user?.name} Icon={<FaceIcon />} />
      <ProfileCard
        heading="Joined"
        text={moment(user.createdAt).fromNow()}
        Icon={<CalenderIcon />}
      />
     
    </Stack>
  );
};

const ProfileCard = ({ text, Icon, heading }) => {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      spacing={"1rem"}
      color={"white"}
      textAlign={"center"}
    >
      {Icon && Icon}

      <Stack>
        <Typography variant="body1">{text}</Typography>
        <Typography color="gray" variant="caption">
          {heading}
        </Typography>
      </Stack>
    </Stack>
  );
};
export default ProfileScreen;
