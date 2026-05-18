import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../Api_Routes/routes";
import useSWRMutation from "swr/mutation";
import { useNavigate } from "react-router-dom";

// input styles
const inputSx = {
  fontSize: 12,
  color: "#5c5c5c",
  lineHeight: "100%",
  fontWeight: 500,
  fontFamily: "'Poppins', sans-serif",
  mb: 1,
};

const INPUT_HEIGHT = 46;
const INPUT_RADIUS = 10;

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    height: INPUT_HEIGHT,
    borderRadius: `${INPUT_RADIUS}px`,
    fontSize: 14,
    fontFamily: "'Poppins', sans-serif",
    "& fieldset": {
      border: `1px solid "#5c5c5c"`,
    },
    "&.Mui-focused": {
      boxShadow: "none",
      outline: "none",
    },
    "& input:focus-visible": {
      outline: "none",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#5c5c5c",
      borderWidth: "2px",
    },
    "&:hover fieldset": {
      borderColor: "#5c5c5c",
    },
  },

  "& .MuiOutlinedInput-input": {
    padding: "0 14px",
    height: "100%",
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  },

  "& .MuiInputAdornment-root": {
    marginRight: 0,
    outline: "none !important",
  },
};

const iconStyle = {
  color: "#9e9e9e",
  paddingLeft: "15px",
  paddingRight: 0,
  backgroundColor: "transparent",
  "&:hover": {
    backgroundColor: "transparent",
    color: "#9e9e9e",
  },
  "&:active": {
    backgroundColor: "transparent",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "transparent",
  },
  "& .MuiTouchRipple-root": {
    display: "none",
  },
};

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (
      localStorage.getItem("accessToken") ||
      localStorage.getItem("refreshToken")
    ) {
      navigate("/todoList", { replace: true });
    }
  }, []);

  const [emailError, setEmailError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [loading, setLoading] = useState(false);

  const initialState = { email: "", username: "", password: "" };
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    setFormData(initialState);
  }, []);

  // using React Query
  //   const loginMutation = useMutation({
  //     mutationFn: async (loginData) => {
  //       const response = await axios.post(
  //         "https://api.escuelajs.co/api/v1/auth/login",
  //         loginData,
  //       );

  //       return response.data;
  //     },

  //     onSuccess: (data) => {
  //       console.log("Login Success:", data);
  //       setFormData(initialState);
  //     },

  //     onError: (error) => {
  //       console.log("Login Error:", error.response?.data || error.message);
  //     },
  //   });

  // using SWR
  // async function loginUser(url, { arg }) {
  //   const res = await login(arg);
  //   return res.data;
  // }

  // const { trigger, data, error } = useSWRMutation("login", loginUser);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      if (!emailRegex.test(value) && value !== "") {
        setEmailError(true);
        setHelperText("Please enter a valid email address");
      } else {
        setEmailError(false);
        setHelperText("");
      }
    }
  };

  // using fetch method
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (emailError || formData.email === "") {
  //     setEmailError(true);
  //     setHelperText("Valid email is required");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     // const response = await fetch(
  //     //   "https://api.escuelajs.co/api/v1/auth/login",
  //     //   {
  //     //     method: "POST",
  //     //     headers: {
  //     //       "Content-Type": "application/json",
  //     //     },
  //     //     body: JSON.stringify({
  //     //       email: formData.email,
  //     //       password: formData.password,
  //     //     }),
  //     //   },
  //     // );

  //     console.log("API Response:", response.data);
  //     setLoading(false);

  //     setFormData(initialState);
  //     setEmailError(false);
  //     setHelperText("");
  //   } catch (error) {
  //     console.log("API Error:", error);
  //   }
  // };

  // axios based submit

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (emailError || formData.email === "") {
    //   setEmailError(true);
    //   setHelperText("Valid email is required");
    //   return;
    // }

    try {
      setLoading(true);

      const response = await login({
        username: formData.username,
        password: formData.password,
      });

      console.log("API Response:", response.data);
      localStorage.setItem("token", response.data.accessToken);
      navigate("/todoList", { replace: true });

      setLoading(false);
      setFormData(initialState);
      setEmailError(false);
      setHelperText("");
    } catch (error) {
      console.log("API Error:", error.response?.data || error.message);
      setLoading(false);
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (emailError || formData.email === "") {
  //     setEmailError(true);
  //     setHelperText("Valid email is required");
  //     return;
  //   }

  //   trigger({
  //     email: formData.email,
  //     password: formData.password,
  //   });

  //   // loginMutation.mutate({
  //   //   email: formData.email,
  //   //   password: formData.password,
  //   // });
  // };

  return (
    <Container maxWidth="lg" sx={{ pt: "14px" }}>
      <Box
        sx={{
          maxWidth: 500,
          borderRadius: "10px",
          p: "20px",
          mt: 10,
          mx: "auto",
          backgroundColor: "#fff",
          boxShadow: "0 18px 40px rgba(0,0,0,0.55)",
          border: "1px solid #000",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 20, sm: 24 },
            fontWeight: 600,
            lineHeight: "100%",
            color: "#1e1e1e",
            fontFamily: "'Poppins', sans-serif",
            mb: 1.5,
            textAlign: "center",
          }}
        >
          This is login page
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* <Box>
            <Typography sx={inputSx}>Email*</Typography>
            <TextField
              name="email"
              fullWidth
              size="small"
              value={formData.email}
              placeholder="Enter your email here"
              onChange={handleChange}
              error={emailError}
              helperText={helperText}
              sx={textFieldSx}
            />
          </Box> */}

          <Box sx={{ mt: 1 }}>
            <Typography sx={inputSx}>User Name</Typography>
            <TextField
              name="username"
              fullWidth
              size="small"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your user name here"
              sx={textFieldSx}
            />
          </Box>

          <Box sx={{ mt: 1 }}>
            <Typography sx={inputSx}>Password</Typography>
            <TextField
              name="password"
              fullWidth
              type="password"
              size="small"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password here"
              sx={{
                mb: 1,
                fontFamily: '"Poppins", sans-serif',
                "& .MuiOutlinedInput-root": {
                  height: "46px",
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: 14,
                  backgroundColor: "input.background",
                  borderRadius: "10px",
                  "& fieldset": {
                    border: `1px solid #5c5c5c`,
                  },
                  "&.Mui-focused": {
                    boxShadow: "none",
                    outline: "none",
                  },
                  "& input:focus-visible": {
                    outline: "none",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#5c5c5c",
                    borderWidth: "2px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#5c5c5c",
                  },
                  "& input::placeholder": {
                    color: "#9e9e9e",
                    opacity: 1,
                  },
                },
                borderRadius: "10px",
              }}
            />
          </Box>

          <Button
            variant="contained"
            type="submit"
            fullWidth
            color="primary"
            onClick={handleSubmit}
            sx={{
              fontsize: 14,
              fontWeight: 600,
              mt: 2,
              textTransform: "capitalize",
            }}
          >
            {/* {loginMutation.isPending ? "Submitting..." : "Submit"} */}
            {loading ? (
              <CircularProgress size="20px" color="inherit" />
            ) : (
              "Submit"
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
