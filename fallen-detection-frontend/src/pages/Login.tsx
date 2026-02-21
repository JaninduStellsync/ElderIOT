import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Paper,
  alpha,
  useTheme
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import api from "../services/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { username, password });

      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
                localStorage.setItem(
                "caretaker",
                JSON.stringify(res.data.caretaker)
                );

        navigate("/caretaker");
      }
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: `linear-gradient(135deg, ${alpha("#2563eb", 0.05)} 0%, ${alpha("#1e40af", 0.08)} 100%)`,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha("#2563eb", 0.03)} 0%, transparent 70%)`,
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha("#1e40af", 0.03)} 0%, transparent 70%)`,
          zIndex: 0
        }}
      />

      <Card
        elevation={0}
        sx={{
          width: 420,
          p: 3,
          borderRadius: 4,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(226, 232, 240, 0.6)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
          position: "relative",
          zIndex: 1,
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 30px 60px rgba(0, 0, 0, 0.12)"
          }
        }}
      >
        <CardContent sx={{ px: 1 }}>
          {/* Logo and Title */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                borderRadius: 3,
                background: `linear-gradient(135deg, #2563eb 0%, #1e40af 100%)`,
                mb: 2,
                boxShadow: `0 10px 20px ${alpha("#2563eb", 0.3)}`
              }}
            >
              <MedicalServicesIcon sx={{ fontSize: 32, color: "#ffffff" }} />
            </Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.5px",
                mb: 1
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Sign in to access your dashboard
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                "& .MuiAlert-icon": {
                  color: "#ef4444"
                }
              }}
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" noValidate>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#2563eb"
                    }
                  },
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#2563eb",
                      borderWidth: 2
                    }
                  }
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#2563eb"
                }
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "#64748b" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#2563eb"
                    }
                  },
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#2563eb",
                      borderWidth: 2
                    }
                  }
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#2563eb"
                }
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleLogin}
              disabled={loading}
              sx={{
                mt: 4,
                mb: 2,
                py: 1.5,
                background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                boxShadow: `0 10px 20px ${alpha("#2563eb", 0.3)}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)",
                  boxShadow: `0 15px 25px ${alpha("#2563eb", 0.4)}`,
                  transform: "translateY(-2px)"
                },
                "&:disabled": {
                  background: alpha("#2563eb", 0.5),
                  boxShadow: "none"
                }
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            {/* Additional Links */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                Demo credentials: admin / password
              </Typography>
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
              
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;