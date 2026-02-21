import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Paper,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Avatar,
  Stack,
  useTheme,
  alpha,
  InputAdornment
} from "@mui/material";
import Layout from "../components/Layout";
import api from "../services/api";
import {
  Devices as DevicesIcon,
  PersonAdd as PersonAddIcon,
  Dashboard as DashboardIcon,
  Memory as MemoryIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  VpnKey as VpnKeyIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Add as AddIcon,
  Security as SecurityIcon,
  Fingerprint as FingerprintIcon
} from "@mui/icons-material";

interface Device {
  _id: string;
  deviceId: string;
  status?: string;
}

const AdminDashboard = () => {
  const theme = useTheme();
  const [deviceId, setDeviceId] = useState("");
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: "", 
    severity: "success" as "success" | "error" 
  });
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    elderName: "",
    deviceId: ""
  });

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/devices");
      setDevices(res.data);
    } catch (error) {
      showSnackbar("Failed to fetch devices", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const registerDevice = async () => {
    if (!deviceId.trim()) {
      showSnackbar("Please enter a device ID", "error");
      return;
    }

    try {
      setLoading(true);
      await api.post("/admin/device", { deviceId });
      setDeviceId("");
      await fetchDevices();
      showSnackbar("Device registered successfully", "success");
    } catch (error) {
      showSnackbar("Failed to register device", "error");
    } finally {
      setLoading(false);
    }
  };

  const createCaretaker = async () => {
    if (!form.name || !form.username || !form.password || !form.elderName || !form.deviceId) {
      showSnackbar("Please fill in all fields", "error");
      return;
    }

    try {
      setLoading(true);
      await api.post("/admin/caretaker", form);
      setForm({ name: "", username: "", password: "", elderName: "", deviceId: "" });
      showSnackbar("Caretaker created successfully", "success");
    } catch (error) {
      showSnackbar("Failed to create caretaker", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDevices();
  };

  const stats = [
    { label: "Total Devices", value: devices.length, icon: <DevicesIcon />, color: "#6366f1" },
    { label: "Active Devices", value: devices.length, icon: <CheckCircleIcon />, color: "#10b981" },
    { label: "Caretakers", value: "-", icon: <PersonIcon />, color: "#f59e0b" },
  ];

  return (
    <Layout role="admin">
      {/* Header with Gradient */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 3,
          color: "white",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "300px",
            height: "100%",
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
            transform: "skewX(-20deg) translateX(100px)"
          }}
        />
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 56, height: 56 }}>
              <SecurityIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                Admin Dashboard
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Manage devices and caretakers for the Elder Fall Detection System
              </Typography>
            </Box>
          </Stack>
          
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 2,
                    border: "1px solid rgba(255,255,255,0.2)"
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 48, height: 48 }}>
                      {stat.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Register Device Section */}
        <Grid item xs={12} lg={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e9ecef",
              height: "100%",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#6366f1",
                boxShadow: "0 8px 24px rgba(99, 102, 241, 0.1)"
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Avatar sx={{ bgcolor: alpha("#6366f1", 0.1), color: "#6366f1", width: 48, height: 48 }}>
                  <MemoryIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1f36" }}>
                    Register New Device
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#687385" }}>
                    Add a new monitoring device to the system
                  </Typography>
                </Box>
              </Stack>

              <TextField
                fullWidth
                label="Device ID"
                placeholder="Enter unique device identifier"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                variant="outlined"
                size="medium"
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FingerprintIcon sx={{ color: "#9aa1b0", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#f8fafc",
                    "&:hover": {
                      backgroundColor: "#ffffff"
                    }
                  }
                }}
              />

              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={registerDevice}
                disabled={loading}
                sx={{
                  py: 1.5,
                  background: "#6366f1",
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                  "&:hover": {
                    background: "#4f52e0",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 16px rgba(99, 102, 241, 0.4)"
                  }
                }}
              >
                Register Device
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Create Caretaker Section */}
        <Grid item xs={12} lg={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e9ecef",
              height: "100%",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#10b981",
                boxShadow: "0 8px 24px rgba(16, 185, 129, 0.1)"
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Avatar sx={{ bgcolor: alpha("#10b981", 0.1), color: "#10b981", width: 48, height: 48 }}>
                  <PersonAddIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1f36" }}>
                    Create New Caretaker
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#687385" }}>
                    Assign a caretaker to monitor an elderly person
                  </Typography>
                </Box>
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    placeholder="Enter caretaker's full name"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    variant="outlined"
                    size="small"
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: "#9aa1b0", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={textFieldStyles}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    placeholder="Enter username"
                    value={form.username}
                    onChange={(e) => setForm({...form, username: e.target.value})}
                    variant="outlined"
                    size="small"
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: "#9aa1b0", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={textFieldStyles}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    placeholder="Enter secure password"
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                    variant="outlined"
                    size="small"
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKeyIcon sx={{ color: "#9aa1b0", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={textFieldStyles}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Elder Name"
                    placeholder="Enter elder's full name"
                    value={form.elderName}
                    onChange={(e) => setForm({...form, elderName: e.target.value})}
                    variant="outlined"
                    size="small"
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: "#9aa1b0", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={textFieldStyles}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Assign Device"
                    value={form.deviceId}
                    onChange={(e) => setForm({...form, deviceId: e.target.value})}
                    variant="outlined"
                    size="small"
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DevicesIcon sx={{ color: "#9aa1b0", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={textFieldStyles}
                  >
                    <MenuItem value="" disabled>
                      <em>Select a device to assign</em>
                    </MenuItem>
                    {devices.map(d => (
                      <MenuItem key={d._id} value={d.deviceId}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <DevicesIcon sx={{ fontSize: 18, color: "#687385" }} />
                          <span>{d.deviceId}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                startIcon={<AssignmentIcon />}
                onClick={createCaretaker}
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.5,
                  background: "#10b981",
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                  "&:hover": {
                    background: "#0ea271",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 16px rgba(16, 185, 129, 0.4)"
                  }
                }}
              >
                Create Caretaker Account
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Devices List Section */}
        <Grid item xs={12}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e9ecef",
              mt: 2
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack 
                direction="row" 
                alignItems="center" 
                justifyContent="space-between" 
                spacing={2} 
                mb={3}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: alpha("#6366f1", 0.1), color: "#6366f1" }}>
                    <DevicesIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1f36" }}>
                      Registered Devices
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#687385" }}>
                      {devices.length} device{devices.length !== 1 ? 's' : ''} connected
                    </Typography>
                  </Box>
                </Stack>
                <Tooltip title="Refresh list">
                  <IconButton 
                    onClick={handleRefresh} 
                    disabled={loading}
                    sx={{ 
                      border: "1px solid #e9ecef",
                      borderRadius: 2,
                      p: 1.5
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Stack>

              {devices.length === 0 ? (
                <Paper 
                  sx={{ 
                    p: 6, 
                    textAlign: "center", 
                    bgcolor: "#f8fafc",
                    borderRadius: 3,
                    border: "2px dashed #e9ecef"
                  }}
                >
                  <DevicesIcon sx={{ fontSize: 64, color: "#cbd5e0", mb: 2 }} />
                  <Typography variant="h6" sx={{ color: "#1a1f36", mb: 1, fontWeight: 600 }}>
                    No devices registered
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#687385", mb: 3 }}>
                    Get started by registering your first monitoring device
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => document.getElementById('device-input')?.focus()}
                    sx={{
                      borderColor: "#6366f1",
                      color: "#6366f1",
                      borderRadius: 2,
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#4f52e0",
                        bgcolor: alpha("#6366f1", 0.04)
                      }
                    }}
                  >
                    Register Device
                  </Button>
                </Paper>
              ) : (
                <Grid container spacing={2}>
                  {devices.map((device, index) => (
                    <Grid item xs={12} sm={6} md={4} key={device._id}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          border: "1px solid #e9ecef",
                          borderRadius: 3,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            borderColor: "#6366f1",
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 24px rgba(99, 102, 241, 0.1)"
                          }
                        }}
                      >
                        <Stack spacing={2}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Avatar sx={{ bgcolor: alpha("#6366f1", 0.1), color: "#6366f1" }}>
                              <MemoryIcon />
                            </Avatar>
                            <Chip
                              label="Active"
                              size="small"
                              sx={{
                                bgcolor: alpha("#10b981", 0.1),
                                color: "#10b981",
                                fontWeight: 500,
                                fontSize: "0.75rem"
                              }}
                            />
                          </Stack>
                          
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1a1f36", mb: 0.5 }}>
                              Device {index + 1}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#687385", display: "block", fontFamily: "monospace" }}>
                              ID: {device.deviceId}
                            </Typography>
                          </Box>

                          <Divider sx={{ borderColor: "#e9ecef" }} />

                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" sx={{ color: "#9aa1b0" }}>
                              Last seen: Just now
                            </Typography>
                            <Chip
                              label="Online"
                              size="small"
                              sx={{
                                bgcolor: alpha("#10b981", 0.1),
                                color: "#10b981",
                                height: 24,
                                "& .MuiChip-label": { px: 1, fontSize: "0.7rem" }
                              }}
                            />
                          </Stack>
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ 
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)"
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

// Common text field styles
const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    backgroundColor: "#f8fafc",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#ffffff",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#6366f1"
      }
    },
    "&.Mui-focused": {
      backgroundColor: "#ffffff",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#6366f1",
        borderWidth: 2
      }
    }
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#6366f1"
  }
};

export default AdminDashboard;