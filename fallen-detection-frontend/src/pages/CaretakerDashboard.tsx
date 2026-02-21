import { useEffect, useState, useRef } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Stack,
  Chip,
  Dialog,
  DialogContent,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  alpha,
  useTheme,
  IconButton,
  Tooltip,
  Fade,
  Zoom
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine
} from "recharts";

import PersonIcon from "@mui/icons-material/Person";
import DevicesIcon from "@mui/icons-material/Devices";
import WarningIcon from "@mui/icons-material/Warning";
import ElderlyIcon from "@mui/icons-material/Elderly";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";

import Layout from "../components/Layout";
import api from "../services/api";

interface Caretaker {
  name: string;
  username: string;
  elderName: string;
  deviceId: string;
}

const CaretakerDashboard = () => {
  const theme = useTheme();
  const [caretaker, setCaretaker] = useState<Caretaker | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  );
  const [report, setReport] = useState<any>(null);

  const [fallAlertOpen, setFallAlertOpen] = useState(false);
  const [lastCheckedTime, setLastCheckedTime] =
    useState<string | null>(null);

  // 🔊 Proper Audio Ref (Fixed Version)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio once
  useEffect(() => {
    audioRef.current = new Audio("/alarm.wav");
    audioRef.current.loop = true;
  }, []);

  // Load caretaker from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("caretaker");
    if (stored) {
      setCaretaker(JSON.parse(stored));
    }
  }, []);

  // 📊 Fetch Monthly Report
  useEffect(() => {
    if (!caretaker) return;

    const fetchReport = async () => {
      try {
        const year = new Date().getFullYear();

        const res = await api.get(
          `/caretaker/monthly-report?deviceId=${caretaker.deviceId}&month=${selectedMonth}&year=${year}`
        );

        setReport(res.data);
      } catch (err) {
        console.log("Report fetch error");
      }
    };

    fetchReport();
  }, [caretaker, selectedMonth]);

  // 🚨 Fall Detection Polling
  useEffect(() => {
    if (!caretaker) return;

    const checkFall = async () => {
      try {
        const res = await api.get(
          `/caretaker/fall/${caretaker.deviceId}`
        );

        const { fall, createdAt } = res.data;

        if (fall && createdAt !== lastCheckedTime) {
          setLastCheckedTime(createdAt);
          setFallAlertOpen(true);

          if (audioRef.current && audioRef.current.paused) {
            audioRef.current.play().catch(() => {});
          }
        }
      } catch (error) {
        console.log("Error checking fall");
      }
    };

    checkFall();
    const interval = setInterval(checkFall, 5000);

    return () => clearInterval(interval);
  }, [caretaker, lastCheckedTime]);

  // 🛑 Stop Alarm
  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setFallAlertOpen(false);
  };

  if (!caretaker) {
    return (
      <Layout role="caretaker">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
            <InfoIcon sx={{ fontSize: 48, color: "#94a3b8", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#475569" }}>No caretaker data found.</Typography>
          </Paper>
        </Box>
      </Layout>
    );
  }

  // Calculate average falls if report exists
  const avgFalls = report?.dailyData 
    ? (report.dailyData.reduce((acc: number, day: any) => acc + (day.falls || 0), 0) / report.dailyData.length).toFixed(1)
    : 0;

  return (
    <Layout role="caretaker">
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Avatar 
            sx={{ 
              bgcolor: alpha("#ef4444", 0.1), 
              color: "#ef4444",
              width: 56,
              height: 56
            }}
          >
            <NotificationsActiveIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e293b" }}>
              Caretaker Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748b" }}>
              Monitor and respond to fall detection alerts
            </Typography>
          </Box>
        </Stack>
        <Divider sx={{ borderColor: "#e2e8f0" }} />
      </Box>

      {/* PROFILE SECTION */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              height: "100%",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#3b82f6",
                boxShadow: "0 8px 24px rgba(59, 130, 246, 0.1)"
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar 
                sx={{ 
                  bgcolor: alpha("#3b82f6", 0.1), 
                  color: "#3b82f6",
                  width: 56,
                  height: 56
                }}
              >
                <PersonIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>
                  Caretaker
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
                  {caretaker.name}
                </Typography>
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                  @{caretaker.username}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              height: "100%",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#10b981",
                boxShadow: "0 8px 24px rgba(16, 185, 129, 0.1)"
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar 
                sx={{ 
                  bgcolor: alpha("#10b981", 0.1), 
                  color: "#10b981",
                  width: 56,
                  height: 56
                }}
              >
                <ElderlyIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>
                  Elder Assigned
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
                  {caretaker.elderName}
                </Typography>
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                  Under your care
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              height: "100%",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#8b5cf6",
                boxShadow: "0 8px 24px rgba(139, 92, 246, 0.1)"
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar 
                sx={{ 
                  bgcolor: alpha("#8b5cf6", 0.1), 
                  color: "#8b5cf6",
                  width: 56,
                  height: 56
                }}
              >
                <DevicesIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>
                  Assigned Device
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Chip
                    icon={<DevicesIcon />}
                    label={caretaker.deviceId}
                    size="medium"
                    sx={{
                      bgcolor: alpha("#8b5cf6", 0.1),
                      color: "#8b5cf6",
                      fontWeight: 600,
                      "& .MuiChip-icon": { color: "#8b5cf6" }
                    }}
                  />
                  <Chip
                    label="Active"
                    size="small"
                    sx={{
                      bgcolor: alpha("#10b981", 0.1),
                      color: "#10b981",
                      height: 24
                    }}
                  />
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Stats Cards */}
      {report && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                background: `linear-gradient(135deg, ${alpha("#3b82f6", 0.02)} 0%, ${alpha("#3b82f6", 0.05)} 100%)`
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: alpha("#3b82f6", 0.1), color: "#3b82f6" }}>
                  <WarningAmberIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Total Falls
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b" }}>
                    {report.totalFalls || 0}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                background: `linear-gradient(135deg, ${alpha("#10b981", 0.02)} 0%, ${alpha("#10b981", 0.05)} 100%)`
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: alpha("#10b981", 0.1), color: "#10b981" }}>
                  <ShowChartIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Total Records
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b" }}>
                    {report.totalRecords || 0}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                background: `linear-gradient(135deg, ${alpha("#f59e0b", 0.02)} 0%, ${alpha("#f59e0b", 0.05)} 100%)`
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: alpha("#f59e0b", 0.1), color: "#f59e0b" }}>
                  <TrendingUpIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Probability
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b" }}>
                    {report.probability || 0}%
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                background: `linear-gradient(135deg, ${alpha("#8b5cf6", 0.02)} 0%, ${alpha("#8b5cf6", 0.05)} 100%)`
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: alpha("#8b5cf6", 0.1), color: "#8b5cf6" }}>
                  <CalendarMonthIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Daily Average
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b" }}>
                    {avgFalls}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* 📊 MONTHLY REPORT */}
<Grid container spacing={3} sx={{ width: "100%", maxWidth: "2000px", mx: "auto" }}>
  <Grid item xs={12}>
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        width: "200%"
      }}
    >
      <Box sx={{ p: 3, bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: alpha("#3b82f6", 0.1), color: "#3b82f6" }}>
              <ShowChartIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
                Monthly Fall Report
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                {caretaker.elderName} • {new Date(0, selectedMonth - 1).toLocaleString("default", { month: "long" })} {new Date().getFullYear()}
              </Typography>
            </Box>
          </Stack>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Select Month</InputLabel>
            <Select
              value={selectedMonth}
              label="Select Month"
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              sx={{
                borderRadius: 2,
                bgcolor: "#ffffff",
                "&:hover": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3b82f6"
                  }
                }
              }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", {
                    month: "long"
                  })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <CardContent sx={{ p: 3 }}>
        {report ? (
          <>
            <Box sx={{ height: 400, width: "100%" }}>
              <ResponsiveContainer>
                <AreaChart data={report.dailyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFalls" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#94a3b8"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="falls"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#colorFalls)"
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#3b82f6", stroke: "#ffffff", strokeWidth: 2 }}
                  />
                  <ReferenceLine y={0} stroke="#e2e8f0" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>

            <Box sx={{ mt: 3, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>Peak Fall Day</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: "#1e293b" }}>
                    Day {report.dailyData?.reduce((max: any, day: any) => 
                      (day.falls > (max?.falls || 0) ? day : max), { falls: 0 }
                    )?.day || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>Maximum Falls</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: "#1e293b" }}>
                    {Math.max(...(report.dailyData?.map((d: any) => d.falls) || [0]))}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>Risk Level</Typography>
                  <Chip
                    label={report.probability > 70 ? "High" : report.probability > 30 ? "Medium" : "Low"}
                    size="small"
                    sx={{
                      bgcolor: report.probability > 70 ? alpha("#ef4444", 0.1) : 
                              report.probability > 30 ? alpha("#f59e0b", 0.1) : 
                              alpha("#10b981", 0.1),
                      color: report.probability > 70 ? "#ef4444" : 
                             report.probability > 30 ? "#f59e0b" : 
                             "#10b981",
                      fontWeight: 600
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <ShowChartIcon sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#64748b", mb: 1 }}>
              No Data Available
            </Typography>
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              No fall records found for the selected month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Paper>
  </Grid>
</Grid>

      {/* 🚨 EMERGENCY POPUP */}
      <Dialog
        open={fallAlertOpen}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
              "0%": {
                boxShadow: "0 0 0 0 rgba(239, 68, 68, 0.7)"
              },
              "70%": {
                boxShadow: "0 0 0 20px rgba(239, 68, 68, 0)"
              },
              "100%": {
                boxShadow: "0 0 0 0 rgba(239, 68, 68, 0)"
              }
            }
          }
        }}
      >
        <Box sx={{ bgcolor: "#ef4444", p: 2, textAlign: "center" }}>
          <Typography variant="h5" sx={{ color: "#ffffff", fontWeight: 700 }}>
            EMERGENCY ALERT
          </Typography>
        </Box>
        
        <DialogContent sx={{ p: 4, textAlign: "center" }}>
          <Zoom in={true}>
            <WarningIcon
              sx={{ fontSize: 100, color: "#ef4444", mb: 2 }}
            />
          </Zoom>

          <Typography
            variant="h3"
            sx={{ fontWeight: 800, color: "#ef4444", mb: 2, letterSpacing: 2 }}
          >
            FALL DETECTED!
          </Typography>

          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              bgcolor: "#fef2f2", 
              borderRadius: 3,
              mb: 3,
              border: "1px solid #fee2e2"
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} mb={2}>
              <ElderlyIcon sx={{ color: "#ef4444", fontSize: 32 }} />
              <Typography variant="h5" sx={{ color: "#1e293b", fontWeight: 600 }}>
                {caretaker.elderName}
              </Typography>
            </Stack>
            
            <Typography variant="body1" sx={{ color: "#475569", mb: 1 }}>
              <strong>Device ID:</strong> {caretaker.deviceId}
            </Typography>
            
            <Typography variant="body1" sx={{ color: "#475569" }}>
              <strong>Time:</strong> {new Date().toLocaleTimeString()}
            </Typography>
          </Paper>

          <Typography variant="body1" sx={{ color: "#64748b", mb: 4 }}>
            Immediate medical attention is required. Please respond immediately.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={stopAlarm}
            startIcon={<CheckCircleIcon />}
            sx={{
              px: 6,
              py: 2,
              fontSize: "1.2rem",
              fontWeight: 700,
              borderRadius: 3,
              background: "#ef4444",
              boxShadow: "0 8px 16px rgba(239, 68, 68, 0.3)",
              "&:hover": {
                background: "#dc2626",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 24px rgba(239, 68, 68, 0.4)"
              },
              transition: "all 0.2s ease"
            }}
          >
            ACKNOWLEDGE & STOP ALARM
          </Button>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CaretakerDashboard;