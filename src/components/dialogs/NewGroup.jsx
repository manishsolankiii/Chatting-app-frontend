import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import {sampleUser as users}  from "../../Constants/SampleData"
import UserItem from '../Shared/UserItem';
import { useInputValidation } from '6pp';
import { useDispatch, useSelector } from 'react-redux';
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api';
import { useAsyncMutation, useErrors } from '../../hooks/hook';
import { setIsNewGroup } from '../../redux/reducers/misc';
const NewGroup = () => {
  const dispatch=useDispatch();
   
    const {isNewGroup} =useSelector(state=>state.misc)
   const {isError,isLoading,data,error} =useAvailableFriendsQuery();
   
   const [newGroup,isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation)
  const groupName=useInputValidation("");

  const [selectMenbers,setSelectedMenbers]=useState([]);
  
  const errors=[{
    isError,
    error,
  }]

  useErrors(errors)

  const selectMemberHandler= (id)=> {
       setSelectedMenbers((prev) => prev.includes(id)? prev.filter((i)=>i!==id) :[...prev,id]);
  };
  
 const closeHandler = () => {
    dispatch(setIsNewGroup(false));
 };

  const submitHandler= () => {
    if (!groupName.value) return toast.error("Group name is required");

    if (selectMenbers.length < 2)
      return toast.error("Please Select Atleast 3 Members");
  console.log("iside creating group")
    newGroup("Creating New Group...", {
      name: groupName.value,
      members: selectMenbers,
    });

    closeHandler();
  };

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
    <Stack
      padding={{ xs: "1rem", sm: "2rem" }}
      direction={"column"}
      
      width={"25rem"}
      spacing={"2rem"}
    >
      <DialogTitle textAlign={"center"}
      variant="h4">New Group</DialogTitle>
        
        <TextField label="Group Name" value={groupName.value} onChange={groupName.changeHandler} />

        <Typography variant='body1'>Members</Typography>
       <Stack>
       {isLoading?<Skeleton/>: data?.friends?.map((user) => (
              <UserItem 
                user={user} 
                key={user._id} 
                handler={selectMemberHandler} 
                isAdded={selectMenbers.includes(user._id)}
              />
            ))}

       </Stack> 

       <Stack direction={"row"} justifyContent={"space-between"}>
                <Button variant="outlined" color='error' onClick={closeHandler}>Cancle</Button>
                <Button variant='contained' onClick={submitHandler} disabled={isLoadingNewGroup}>Create</Button>
        </Stack>          
    </Stack>
  </Dialog>
  );
};

export default NewGroup
