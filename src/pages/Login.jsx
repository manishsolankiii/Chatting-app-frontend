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
import React, { useState } from "react";
import { CameraAlt as CameraAltIcom } from "@mui/icons-material";
import { VisuallyHiddenInput } from "../components/styles/StylesCOmponenet";
import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";
import { usernameValidator } from "../utils/validators";
import { server } from "../Constants/config";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducers/auth";
import toast from "react-hot-toast";
import axios from "axios";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const toggleLogin = () => setIsLogin(!isLogin);

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useStrongPassword();

  const avatar = useFileHandler("single", 8);

  const dispatch=useDispatch();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging  in...");
     setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
       
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );  
    
    
      console.log("from login",data.user);
      dispatch(userExists(data.user));
      toast.success(data.message,{
        id:toastId,
      });
    } catch (error) {
        toast.error(error?.response?.data?.message || error || "something went wrong", {
          id: toastId,
        });
    }finally{
      setIsLoading(false);
    }
  };

  const handleSIgnup = async(e) => {
    e.preventDefault();
     const toastId = toast.loading("Signing Up...");
      setIsLoading(true);

    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );
      
     
      dispatch(userExists(data.user));
      toast.success(data.message,{
        id:toastId,
      })
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
        
     
    } finally{
      setIsLoading(false);
    }
  };

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
      
      <nav class="flex justify-between pl-28  nvi pt-3 "></nav>
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
          {isLogin ? (
            <>
              <Typography variant="h5">login</Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleLogin}
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
                  label="username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />
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
                  label="password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />

                <Button
                  sx={{
                    marginTop: "1rem",
                  }}
                  variant="contained"
                  fullWidth
                  color="primary"
                  type="submit"
                  disabled={isLoading}
                >
                  Login
                </Button>

                <Typography textAlign={"center"} margin={"1rem"}>
                  OR
                </Typography>

                <Button
                disabled={isLoading}
                  variant="outlined"
                  fullWidth
                  type="submit"
                  onClick={toggleLogin}
                >
                  Sign up
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5">Signup</Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleSIgnup}
              >
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  />

                  <IconButton
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      bgcolor: "rgba(255,255,255,0.5)",
                      ":hover": {
                        bgcolor: "rgba(255,255,255,0.7)",
                      },
                    }}
                  >
                    <>
                      <CameraAltIcom />
                      <VisuallyHiddenInput
                        type="file"
                        onChange={avatar.changeHandler}
                      />
                    </>
                  </IconButton>
                </Stack>
                {avatar.error && (
                  <Typography
                    width={"fit-content"}
                    display={"block"}
                    color="error"
                    varient="caption"
                  >
                    {avatar.error}
                  </Typography>
                )}
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
                  label="name"
                  margin="normal"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                />
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
                  label="Bio"
                  margin="normal"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />
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
                  label="username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />
                {username.error && (
                  <Typography color="black" varient="caption">
                    {username.error}
                  </Typography>
                )}
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
                  label="password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />
                {password.error && (
                  <Typography color="black" varient="caption">
                    {password.error}
                  </Typography>
                )}
                <Button
                  sx={{
                    marginTop: "1rem",
                  }}
                  variant="contained"
                  fullWidth
                  color="primary"
                  type="submit"
                  disabled={isLoading}
                >
                  Sign Up
                </Button>

                <Typography textAlign={"center"} margin={"1rem"}>
                  OR
                </Typography>

                <Button
                disabled={isLoading}
                  variant="outlined"
                  fullWidth
                  type="submit"
                  onClick={toggleLogin}
                >
                  Login
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
