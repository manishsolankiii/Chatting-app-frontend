import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { sampleUser } from '../../Constants/SampleData'
import UserItem from '../Shared/UserItem'
import { useAsyncMutation, useErrors } from '../../hooks/hook'
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from '../../redux/api/api'
import { useDispatch, useSelector } from 'react-redux'
import { setIsAddMember } from '../../redux/reducers/misc'
const AddMemberSialog = ({chatId}) => {
    
  const [selectMenbers,setSelectedMenbers]=useState([]);
  const dispatch=useDispatch();
  const { isAddMember } = useSelector((state) => state.misc);

  const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);
  const [addMember,isLoadingAddMember]=useAsyncMutation(
     useAddGroupMembersMutation
  )

  const selectMemberHandler= (id)=> {
       setSelectedMenbers((prev) => prev.includes(id)? prev.filter((i)=>i!==id) :[...prev,id]);
  };

  console.log(data);
    
    const closeHandler= () => {

          dispatch(setIsAddMember(false));
    }
    const addmemberSubmitHandler = () => {
     addMember("adding members...",{members:selectMenbers,chatId})
         closeHandler();
    }

    useErrors([{ isError, error }]);
  return (
     <Dialog open={isAddMember} onClose={closeHandler}>
             <Stack padding={"2rem"} width={"20rem"} spacing={"2rem"}>
                <DialogTitle textAlign={"center"}>Add Member</DialogTitle>

                <Stack spacing={"1rem"}>
                     {
                       isLoading?<Skeleton/>: data?.availableFriends
                       ?.length>0 ? data?.availableFriends
                       ?.map(i => (
                            <UserItem key={i._id} user={i} handler={selectMemberHandler} isAdded={selectMenbers.includes(i._id)} />
                        )): <Typography textAlign={"center"}>No Friends </Typography>
                     }
                </Stack>
                
                <Stack direction={"row"} alignItems={'center'} justifyContent={"space-between"}>
                <Button onClick={closeHandler} color="error">Cancel</Button>
                <Button onClick={addmemberSubmitHandler} variant='contained' disabled={isLoadingAddMember}>Submit Changes</Button>
                </Stack>
              
             </Stack>
     </Dialog>
  
)}

export default AddMemberSialog
