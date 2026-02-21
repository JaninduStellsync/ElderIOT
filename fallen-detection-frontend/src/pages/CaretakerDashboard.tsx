import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Stack,
  Chip,
  Alert,
  Snackbar
} from "@mui/material";
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [lastFallTime, setLastFallTime] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("caretaker");
    if (stored) {
      setCaretaker(JSON.parse(stored));
    }
  }, []);

  const [lastCheckedTime, setLastCheckedTime] = useState<string | null>(null);

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
        setSnackbarOpen(true);
      }

    } catch (error) {
      console.log("Error checking fall");
    }
  };


  
  checkFall();
  const interval = setInterval(checkFall, 5000);

  return () => clearInterval(interval);

}, [caretaker, lastCheckedTime]);
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

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={1}>
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
          <Card elevation={1}>
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
          <Card elevation={1}>
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

      {/* FALL ALERT POPUP */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={8000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="error" icon={<WarningIcon />}>
          🚨 FALL DETECTED for {caretaker.elderName}!
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default CaretakerDashboard;