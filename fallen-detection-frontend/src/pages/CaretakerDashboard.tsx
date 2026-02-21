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
  MenuItem
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import PersonIcon from "@mui/icons-material/Person";
import DevicesIcon from "@mui/icons-material/Devices";
import WarningIcon from "@mui/icons-material/Warning";

import Layout from "../components/Layout";
import api from "../services/api";

interface Caretaker {
  name: string;
  username: string;
  elderName: string;
  deviceId: string;
}

const CaretakerDashboard = () => {
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
        <Typography>No caretaker data found.</Typography>
      </Layout>
    );
  }

  return (
    <Layout role="caretaker">
      <Typography variant="h5" mb={3}>
        Caretaker Dashboard
      </Typography>

      {/* PROFILE SECTION */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "#2563eb" }}>
                  <PersonIcon />
                </Avatar>
                <div>
                  <Typography variant="h6">
                    {caretaker.name}
                  </Typography>
                  <Typography variant="body2">
                    Username: {caretaker.username}
                  </Typography>
                </div>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">
                Elder Assigned
              </Typography>
              <Typography variant="h6">
                {caretaker.elderName}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">
                Assigned Device
              </Typography>
              <Chip
                icon={<DevicesIcon />}
                label={caretaker.deviceId}
                color="primary"
                variant="outlined"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 📊 MONTHLY REPORT */}
      <Grid container spacing={3} mt={1}>
        <Grid item xs={12}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography variant="h6">
                  Monthly Fall Report
                </Typography>

                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={selectedMonth}
                    label="Month"
                    onChange={(e) =>
                      setSelectedMonth(Number(e.target.value))
                    }
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

              {report && (
                <>
                  <Typography variant="subtitle1" mb={1}>
                    Elder: <strong>{caretaker.elderName}</strong>
                  </Typography>

                  <Typography variant="body2" mb={3}>
                    Total Falls: <strong>{report.totalFalls}</strong> | 
                    Total Records: <strong>{report.totalRecords}</strong> | 
                    Probability: <strong>{report.probability}%</strong>
                  </Typography>

                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={report.dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="falls"
                        stroke="#2563eb"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 🚨 EMERGENCY POPUP */}
      <Dialog
        open={fallAlertOpen}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
            textAlign: "center",
            p: 4,
            border: "4px solid #d32f2f"
          }
        }}
      >
        <DialogContent>
          <WarningIcon
            sx={{ fontSize: 90, color: "#d32f2f", mb: 2 }}
          />

          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#d32f2f", mb: 2 }}
          >
            FALL DETECTED!
          </Typography>

          <Typography variant="h6" mb={2}>
            Elder: <strong>{caretaker.elderName}</strong>
          </Typography>

          <Typography variant="body1" mb={4}>
            Immediate medical attention required.
          </Typography>

          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={stopAlarm}
            sx={{
              px: 6,
              py: 1.5,
              fontSize: "1.1rem",
              borderRadius: 3
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