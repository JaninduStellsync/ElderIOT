import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Divider,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const drawerWidth = 260;

interface Props {
  children: ReactNode;
  role: string;
}

const Layout = ({ children, role }: Props) => {
  const navigate = useNavigate();
  const theme = useTheme();

  // ✅ STATE MUST BE INSIDE COMPONENT
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setLogoutOpen(false);
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* APP BAR */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "#ffffff",
          color: "#1e293b",
          borderBottom: "1px solid #e2e8f0",
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <MedicalServicesIcon sx={{ color: "#2563eb" }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                background:
                  "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              ElderCare Sentinel
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Typography variant="body2" sx={{ mr: 2 }}>
            {role === "admin" ? "Administrator" : "Caregiver"}
          </Typography>

          <Avatar sx={{ bgcolor: "#2563eb" }}>
            {role === "admin" ? "A" : "C"}
          </Avatar>
        </Toolbar>
      </AppBar>
<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      {/* DRAWER */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column"
          }
        }}
      >
        <Toolbar />

        <Box sx={{ px: 2, py: 3, flexGrow: 1 }}>
          <List>
            <ListItemButton selected>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </List>
<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
          <Divider sx={{ my: 3 }} />

          <List>
            <ListItemButton
              onClick={() => setLogoutOpen(true)}
              sx={{
                "&:hover": {
                  backgroundColor: alpha(
                    theme.palette.error.main,
                    0.08
                  )
                }
              }}
            >
              <ListItemIcon sx={{ color: "#ef4444" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ color: "#ef4444" }}
              />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          mt: 8,
          backgroundColor: "#f8fafc"
        }}
      >
        {children}
      </Box>

      {/* ✅ LOGOUT CONFIRMATION DIALOG */}
     <Dialog
  open={logoutOpen}
  onClose={() => setLogoutOpen(false)}
  PaperProps={{
    sx: {
      borderRadius: 4,
      p: 2,
      width: 380
    }
  }}
>
  <DialogContent sx={{ textAlign: "center", pt: 3 }}>
    
    {/* Icon */}
    <Box
      sx={{
        width: 70,
        height: 70,
        borderRadius: "50%",
        backgroundColor: "#fee2e2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 16px auto"
      }}
    >
      <LogoutIcon sx={{ fontSize: 32, color: "#dc2626" }} />
    </Box>

    {/* Title */}
    <Typography
      variant="h6"
      sx={{ fontWeight: 600, mb: 1 }}
    >
      Confirm Logout
    </Typography>

    {/* Subtitle */}
    <Typography
      variant="body2"
      sx={{ color: "#64748b", mb: 3 }}
    >
      Are you sure you want to logout from your session?
    </Typography>

    {/* Buttons */}
    <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
      <Button
        variant="outlined"
        onClick={() => setLogoutOpen(false)}
        sx={{
          borderRadius: 2,
          px: 3,
          textTransform: "none"
        }}
      >
        Cancel
      </Button>

      <Button
        variant="contained"
        color="error"
        onClick={handleLogout}
        sx={{
          borderRadius: 2,
          px: 3,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "0 8px 20px rgba(220, 38, 38, 0.3)"
        }}
      >
        Logout
      </Button>
    </Box>

  </DialogContent>
</Dialog>
    </Box>
  );
};

export default Layout;