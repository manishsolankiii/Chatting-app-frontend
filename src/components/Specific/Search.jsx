import { useInputValidation } from '6pp'
import { Dialog, DialogTitle, InputAdornment, List, ListItem, ListItemText, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Search as SearchIcon } from '@mui/icons-material'
import UserItem from '../Shared/UserItem';
import { sampleUser } from '../../Constants/SampleData';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSearch } from '../../redux/reducers/misc';
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api';
import { useAsyncMutation } from '../../hooks/hook';



const Search = () => {
  const dispatch=useDispatch();
  const { isSearch } = useSelector(
    (state) => state.misc
  );
  
  const [searchUser] = useLazySearchUserQuery();

  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );


  const search= useInputValidation("");
  const [users,setUsers] = useState([])



  const adFriendhandler = async (id) => {
    await sendFriendRequest("Sending  the friend request...", { userId: id });
  };

  
  const searchClosehandler=()=> {
    dispatch(setIsSearch(false))
  }
  
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e));
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);
  return (
    <Dialog 
      open={isSearch} onClose={searchClosehandler}
    >
      <Stack 
        padding={{xs:"1rem" ,sm:"2rem"}} 
        direction={"column"}
        width={"25rem"}
      >
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField label="" value={search.value} onChange={search.changeHandler} variant='outlined' size='small' InputProps={{
            startAdornment:(
              <InputAdornment position='start'>
                <SearchIcon/>
              </InputAdornment>
            )
        }} />
       
       <List>
           
            {users.map((user) => (
              <UserItem 
                user={user} 
                key={user._id} 
                handler={adFriendhandler} 
                handlerIsLoading={isLoadingSendFriendRequest} 
              />
            ))}
           
       </List>
        
      </Stack>
    </Dialog>
  )
}

export default Search
