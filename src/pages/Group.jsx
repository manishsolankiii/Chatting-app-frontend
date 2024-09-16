import { Backdrop, Box, Button, CircularProgress, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import { orange } from "../Constants/Color";
import { KeyboardBackspace as KeyboardBackspaceIcon ,Menu as MenuIcon,Edit as EditIcon, Done as DoneIcon, Add as AddIcon,Delete as DeleteIcon} from "@mui/icons-material";
import { useNavigate,useSearchParams } from "react-router-dom";
import { Link } from "../components/styles/StylesCOmponenet";
import AvatarCard from "../components/Shared/AvatarCard";
import { Samplechats, sampleUser } from "../Constants/SampleData";
import UserItem from "../components/Shared/UserItem";
import { useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from "../redux/api/api";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { LayoutLoader } from "../components/layout/Loaders";
import { setIsAddMember } from "../redux/reducers/misc";
const ConfirmDeleteDialog = lazy(()=> import("../components/dialogs/ConfirmDeleteDialog"));
const AddMemberDialog = lazy(()=> import("../components/dialogs/AddMemberSialog"));
const isAddmember=false;

const Group = () => {
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddMember } = useSelector((state) => state.misc);

  const myGroups = useMyGroupsQuery("");

  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );

  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );

  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
    useDeleteChatMutation
  );

  const [isMobileMneuOpen,setOsmobileMenuOpen] = useState(false);
  const [isEdit,setIsEdit]=useState(false);
  const [confirmDeleteDialog,setCOnfitmDeleteDialog]=useState(false);

  
   
  
  const [groupName,setGroupName]= useState("");
  const [groupnameupdatedValue,setGroupNameupdatedValue]= useState("");

  
  const [members, setMembers] = useState([]);

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];

  useErrors(errors);
  
  useEffect(() => {
    const groupData = groupDetails.data;
    const namee=  groupData?.chat?.name;
    if (groupData) {
      setGroupName(namee);
      setGroupNameupdatedValue(namee);
      setMembers(groupData.chat.members);
    }

  //  console.log("use effec runs again",);

    return () => {
      setGroupName("");
      setGroupNameupdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails]);
 
 // console.log("grp details",groupDetails)
 // console.log(chatId);
   const navigateBack= () => {
       navigate("/");
   };

   const handleMobile= () => {
    setOsmobileMenuOpen((prev) => !prev)
   };

   const handleMobileClose= () => setOsmobileMenuOpen(false);
  
   const updateGroupName =() => {
    setIsEdit(false);
   updateGroup("Updating Group Name...",{chatId,name:groupnameupdatedValue})
   
 }
  
 const OpenconfirmDeleteHandler = () => {

   setCOnfitmDeleteDialog(true);
   console.log("inside delete")
  
   console.log("group deleted");
 }

 const closeConfirmDelereHandler= () => {
  setCOnfitmDeleteDialog(false);
 }

 const OpenAddMemberHandler = () => {
  dispatch(setIsAddMember(true));

 }
  
 const deleteHandler= () => {
    deleteGroup("deleting Group",chatId);
    closeConfirmDelereHandler();
    navigate("/groups")
 }  

 const removeMemberHandler = (userId) => {
  removeMember("Removing Member...", { chatId, userId });
};
   


  const IconBtns = <>

     
      <Box sx={{
           display:{
            xs:"block",
            sm:"none",
           },
           position:"fixed",
           right:"1rem",
           top:"1rem",
        }}>
           <Tooltip title="Menu">
           <IconButton  onClick={handleMobile}>
            <MenuIcon/>
        </IconButton>
           </Tooltip>
   
      </Box>
      
    
     <Tooltip title="back">

         <IconButton 
         sx={
          {
            position:"absolute",
            top:"2rem",
            left:"2rem",
            bgcolor:"rgba(0,0,0,0.8)",
            color:"white",
            ":hover":{
              bgcolor:"rgba(0,0,0,0.7)",
            }
          }

         }
         onClick={navigateBack}
         
         >
             <KeyboardBackspaceIcon/>
         </IconButton>

     </Tooltip>
  </>;
  
  const ButtonGroup = <Stack 
    direction={{
      sm:"row",
      xs:"column-reverse",
    }}
    spacing={"1rem"}
    padding={{
      sm:"1rem",
      xs:"0",
      md:"1rem 4rem"
    }}
   sx={{
    justifyContent:"space-evenly",
    display: 'flex', // Ensure flex display for justifyContent to work
    
    
   }}
   
  >
     <Button size="large" color="error" startIcon={<DeleteIcon/>} onClick={OpenconfirmDeleteHandler}>Delete Group</Button>
     <Button size="large" variant="contained" startIcon={<AddIcon/>} onClick={OpenAddMemberHandler}>Add Member</Button>
  
  </Stack>

  

  const GroupName = <Stack direction={"row"}alignItems={"center"} justifyContent={"center"} spacing={"1rem"}padding={"3rem"} >
     {
      isEdit? <>
         
         <TextField value={groupnameupdatedValue} onChange={(e) => setGroupNameupdatedValue(e.target.value)}  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "black", // Default border color
                      },
                      "&:hover fieldset": {
                        borderColor: "black", // Border color on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "black", // Border color when focused
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "black", // Text color
                    },
                    "& .MuiInputLabel-root": {
                      color: "white", // Label color
                    },
                    backgroundColor:"white",
                    
                  }}/>
         <IconButton onClick={updateGroupName} disabled={isLoadingGroupName} sx={{
                       
                       backgroundColor: orange,
                       color:"white",                      
                       padding:"0.5rem",
                       "&:hover":{
                         bgcolor:"error.dark"
                       }}}>
              <DoneIcon/>
         </IconButton>
      </>:<>
           <Typography variant="h4">
               {groupName}

           </Typography>

           <IconButton  onClick={() => setIsEdit(true)} disabled={isLoadingGroupName} sx={{
                       
                        backgroundColor: orange,
                        color:"white",                      
                        padding:"0.5rem",
                        "&:hover":{
                          bgcolor:"error.dark"
                        }}}>
               <EditIcon/>
           </IconButton>
      </>
     }
  </Stack>
  return  myGroups.isLoading?<LayoutLoader/>: (
    <Grid container height={"100vh"}>
      <Grid
        item
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
          '&::-webkit-scrollbar': {
            width: '8px', // Width of the scrollbar
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888', // Color of the scrollbar thumb
            borderRadius: '4px', // Rounded corners of the scrollbar thumb
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent', // Color of the scrollbar track
          },
         
        }}
        sm={4}
        bgcolor={orange}
        height={"100%"}
        overflow={"auto"}
        
      >
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId}/>
      </Grid>

      <Grid
        
        sx={{
          backgroundImage: 'url("/wallapaper.jpeg")', 
            backgroundSize: 'cover', // Ensures the background image covers the entire container
            backgroundPosition: 'center', // Centers the background image
            backgroundRepeat: 'no-repeat',
        }}
        item
        xs={12}
        sm={8}
        display={"flex"}
        alignItems={"center"}
        flexDirection={"column"}
        position={"relative"}
        padding={"1rem 3rem"}
      > 
              {IconBtns}

              {
                groupName && <>
                   {GroupName}

                   <Typography
                     margin={"1rem"}
                     alignSelf={"flex-start"}
                     variant="h5"
                   >
                    Members
                   </Typography>

                   <Stack 
                     maxWidth={"45rem"}
                     width={"100%"}
                     boxSizing={"border-box"}
                     padding={{
                      sm:"1rem",
                      xs:"0",
                      md:"1rem 4rem",
                     }}
                     spacing={"2rem"}
                    
                     sx={{
                       borderBottomRightRadius:"50px",
                       borderBottomLeftRadius:"50px",
                       borderTopRightRadius:"50px",
                       '&::-webkit-scrollbar': {
                        width: '8px', // Width of the scrollbar
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#888', // Color of the scrollbar thumb
                        borderRadius: '4px', // Rounded corners of the scrollbar thumb
                      },
                      '&::-webkit-scrollbar-track': {
                        backgroundColor: 'transparent', // Color of the scrollbar track
                      },
                     }}
                     height={"50vh"}
                     overflow={"auto"}
                   >
                        
                    {isLoadingRemoveMember ? (
                              <CircularProgress />
                           
                     ):( members.map((i) => (
                            <UserItem key={i._id} user={i}isAdded styling={{
                               boxShadow:"0 0 0.5rem rgba(0,0,0,0.5)",
                               padding:"1rem 2rem",
                               bgcolor:"#ea7070",
                               borderRadius:"1rem",
                              
                            }} handler={removeMemberHandler}/>
                          )))
                      }
                   </Stack>

                   {ButtonGroup}
                </>
              }
        
      </Grid>
    
    {
      isAddMember &&  <Suspense fallback={<Backdrop open/>}>

         <AddMemberDialog chatId={chatId}/>
      </Suspense>
    }

    {
      confirmDeleteDialog && (<Suspense fallback={<Backdrop open/>}>
             <ConfirmDeleteDialog open={confirmDeleteDialog} handleClose={closeConfirmDelereHandler} deleteHandler={deleteHandler}/>
      </Suspense>)
    }

      <Drawer sx={{
        display:{
          xs:"block",
          sm:"none",
        },
    
  }}
        
  overflowY="scroll"  open={isMobileMneuOpen} onClose={handleMobileClose}>
         <GroupsList  w={"50vw"} myGroups={myGroups?.data?.groups} chatId={chatId}/>
      </Drawer>
    </Grid>
  );
};

const GroupsList = ({w="100%",myGroups=[],chatId}) => (

  <Stack width={w} bgcolor={orange}>
      {
        myGroups.length>0 ? myGroups.map((group) => <GroupListItem group={group} chatId={chatId} key={group._id} />) :<Typography textAlign={"center"} padding={"1rem"}>No Groups</Typography>
      }
  </Stack>
);

const GroupListItem= memo(({group,chatId}) => {
     const {name,avatar,_id} =group;

     return (<Link to={`?group=${_id}`} onClick={(e) => {if(chatId===_id) e.preventDefault();}}>
        <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
           <AvatarCard avatar={avatar}/>
           <Typography>{name}</Typography>
        </Stack>
     </Link>);
})
export default Group;
