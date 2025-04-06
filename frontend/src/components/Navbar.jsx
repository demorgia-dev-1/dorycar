import { AppBar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  return (
    <AppBar position="static">
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 4,
          py: 2,
          background: "linear-gradient(to left, #f3bedc, #e9bde3, #dcbee8, #cebeed, #bebfef, #b2c4f3, #a6c9f4, #9ccdf4, #98d6f4, #9adff2, #a1e6ee, #adede9)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "white",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            cursor: "pointer",
            mr: 4,
          }}
          onClick={() => navigate("/")}
        >
          DoryCar
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          {/* {user ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={logout} // Call logout function
                sx={{ backgroundColor: "white" }}
              >
                Logout
              </Button>
              <AccountCircleIcon
                sx={{
                  color: "white",
                  fontSize: 40,
                  cursor: "pointer",
                  marginLeft: "10px",

                }}
                />
              <img
              src=""
              alt="${user.name}"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                marginLeft: "10px",

              }}
              />
            </>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/register")}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate("/login")}
                sx={{ backgroundColor: "white" }}
              >
                Login
              </Button>
            </>
          )} */}
          {user ? (
  <>
    <Button
      variant="contained"
      color="primary"
      onClick={() => navigate("/dashboard")}
    >
      Dashboard
    </Button>

    {/* <Button
      variant="outlined"
      color="primary"
      onClick={() => navigate("/profile")}
      sx={{ backgroundColor: "white" }}
    >
      Profile
    </Button> */}

    <Button
      variant="outlined"
      color="primary"
      onClick={logout}
      sx={{ backgroundColor: "white" }}
    >
      Logout
    </Button>

    {/* Profile avatar or initials */}
    {/* <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        backgroundColor: "#ffffffaa",
        color: "#333",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        ml: 2,
        cursor: "pointer",
        boxShadow: "0 0 5px rgba(0,0,0,0.3)",
      }}
      onClick={() => navigate("/profile")}
    >
      {user.name?.charAt(0)?.toUpperCase()}
    </Box> */}

    <Box
  sx={{
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: "#ffffffaa",
    color: "#333",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    ml: 2,
    cursor: "pointer",
    boxShadow: "0 0 5px rgba(0,0,0,0.3)",
    overflow: "hidden",
  }}
  onClick={() => navigate("/profile")}
>
  {user?.profileImage ? (
    <img
      src={user.profileImage}
      alt={user.name}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  ) : (
    <Typography variant="body2" sx={{ color: "#333" }}>
      {user?.name?.charAt(0)?.toUpperCase()}
    </Typography>
  )}
</Box>

  </>
) : (
  <>
    <Button
      variant="contained"
      color="primary"
      onClick={() => navigate("/register")}
    >
      Get Started
    </Button>
    <Button
      variant="outlined"
      color="primary"
      onClick={() => navigate("/login")}
      sx={{ backgroundColor: "white" }}
    >
      Login
    </Button>
  </>
)}

        </Box>
      </Box>
    </AppBar>
  );
};

export default Navbar;
