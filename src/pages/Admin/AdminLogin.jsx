import React, { useEffect } from 'react'
import {
    Avatar,
    Button,
    Container,
    IconButton,
    Paper,
    Stack,
    TextField,
    Typography,
  } from "@mui/material";
import { useInputValidation } from '6pp';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin, getAdmin } from '../../redux/thunks/admin';


const AdminLogin = () => {
  
  const {isAdmin}=useSelector(state=>state.auth);
  const dispatch=useDispatch();
const secretKey = useInputValidation("");

    const submitHandler =(e)=>{
        e.preventDefault();
        console.log("submit");
        dispatch(adminLogin(secretKey.value));
    };

    useEffect(()=> {
      dispatch(getAdmin());
    },[dispatch])

    if(isAdmin) return <Navigate to="/admin/dashboard"/>
  return (
    <div
    style={{
      // backgroundImage:
      //  "linear-gradient(rgba(255, 100, 200, 0.5), rgb(180 103 107))",
      // "linear-gradient(rgba(234, 100, 112, 0.8), rgb(234 112 112))",
      backgroundImage: 'url("/wallapaper.jpeg")',
      //  backgroundImage: 'url("https://images.unsplash.com/photo-1528459584353-5297db1a9c01?q=80&w=1799&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',// Update this path to your image
      backgroundSize: "cover", // Ensures the background image covers the entire container
      backgroundPosition: "center", // Centers the background image
      backgroundRepeat: "no-repeat",
    }}
  >
    <Container
      component={"main"}
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxHeight: "90%",
          overflowY: "scroll",
          // overflowY: 'auto',

          bgcolor: "#ea7070",
          color: "white",
          borderBottomLeftRadius: "50px",
          borderBottomRightRadius: "50px",
          borderTopRightRadius: "50px",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          
        }}
      >
         
         
            <Typography variant="h5">Admin login</Typography>
            <form
              style={{
                width: "100%",
                marginTop: "1rem",
              }}
              onSubmit={submitHandler}
            >
             
              <TextField
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black", // Default border color
                    },
                    "&:hover fieldset": {
                      borderColor: "gray", // Border color on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white", // Border color when focused
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white", // Text color
                  },
                  "& .MuiInputLabel-root": {
                    color: "white", // Label color
                  },
                }}
                required
                fullWidth
                label="SecretKey"
                type="password"
                margin="normal"
                variant="outlined"
                value={secretKey.value}
                onChange={secretKey.changeHandler}
              />

              <Button
                sx={{
                  marginTop: "1rem",
                }}
                variant="contained"
                fullWidth
                color="primary"
                type="submit"
              >
                Login
              </Button>

             
            </form>
         
        
      </Paper>
    </Container>
  </div>
  )
}

export default AdminLogin
