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
  alpha
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

const drawerWidth = 260;

interface Props {
  children: ReactNode;
  role: string;
}

const Layout = ({ children, role }: Props) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "#ffffff",
          color: "#1e293b",
          borderBottom: "1px solid #e2e8f0",
          backdropFilter: "blur(8px)",
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <MedicalServicesIcon sx={{ color: "#2563eb", fontSize: 28 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.5px"
              }}
            >
              ElderCare Sentinel
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
              {role === "admin" ? "Administrator" : "Caregiver"}
            </Typography>
            <Avatar 
              sx={{ 
                bgcolor: "#2563eb", 
                width: 36, 
                height: 36,
                fontSize: "0.875rem",
                fontWeight: 600
              }}
            >
              {role === "admin" ? "A" : "C"}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            borderRight: "none",
            backgroundColor: "#ffffff",
            boxShadow: "4px 0 10px rgba(0, 0, 0, 0.02)",
            transition: "all 0.3s ease"
          }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", px: 2, py: 3 }}>
          <List sx={{ px: 1 }}>
            <ListItemButton
              selected={true}
              sx={{
                borderRadius: 2,
                mb: 1,
                py: 1.5,
                px: 2.5,
                "&.Mui-selected": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12)
                  },
                  "& .MuiListItemIcon-root": {
                    color: "#2563eb"
                  },
                  "& .MuiListItemText-primary": {
                    color: "#2563eb",
                    fontWeight: 600
                  }
                },
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04)
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "#64748b" }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Dashboard" 
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  color: "#334155"
                }}
              />
            </ListItemButton>

            <ListItemButton
              sx={{
                borderRadius: 2,
                mb: 1,
                py: 1.5,
                px: 2.5,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04)
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "#64748b" }}>
                <PersonOutlineIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Profile" 
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  color: "#334155"
                }}
              />
            </ListItemButton>
          </List>

          <Divider sx={{ my: 2, borderColor: "#e2e8f0" }} />

          <List sx={{ px: 1 }}>
            <ListItemButton
              onClick={() => navigate("/")}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 2.5,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.error.main, 0.04)
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "#ef4444" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Logout" 
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  color: "#ef4444"
                }}
              />
            </ListItemButton>
          </List>

          <Box sx={{ position: "absolute", bottom: 20, left: 0, right: 0, px: 3 }}>
            <Box 
              sx={{ 
                p: 2, 
                borderRadius: 2,
                background: `linear-gradient(135deg, ${alpha("#2563eb", 0.05)} 0%, ${alpha("#1e40af", 0.08)} 100%)`,
                border: "1px solid #e2e8f0"
              }}
            >
              <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 0.5 }}>
                System Status
              </Typography>
              <Typography variant="body2" sx={{ color: "#2563eb", fontWeight: 600 }}>
                ● Active
              </Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 3, sm: 4, md: 5 },
          mt: 8,
          minHeight: "100vh",
          backgroundColor: "#f8fafc"
        }}
      >
        <Box
          sx={{
            maxWidth: "1600px",
            margin: "0 auto",
            height: "100%"
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;