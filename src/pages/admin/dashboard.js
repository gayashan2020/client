// pages/admin/dashboard.js

import { Box, Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";
import Layout from "../../components/Layout";
import { useEffect, useState, useContext } from 'react';
import { fetchCurrentUser } from "@/services/users";
import { LoadingContext } from "@/contexts/LoadingContext";
import { userRoles } from "@/assets/constants/authConstants";
import { useTheme } from '@mui/material/styles';
import { PieChartComponent } from "@/components/PieChartComponent";
import { BarChartComponent } from "@/components/BarChartComponent";
import { getOccupationData, getCityData } from "@/services/dashboard";


export default function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [occupationData, setOccupationData] = useState([]);
    const [cityData, setCityData] = useState([{district: "", count: 0}]);

    const { setLoading } = useContext(LoadingContext);

    const theme = useTheme();

    useEffect(() => {
        const getUser = async () => {
            setLoading(true);
            try {
                const currentUser = await fetchCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Failed to fetch current user', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchData = async () => {
            try {
                const data = await getOccupationData();
                if (data) {
                    setOccupationData(data);
                } else {
                    console.error('Failed to fetch occupation data');
                }
            } catch (error) {
                console.error('Failed to fetch occupation data', error);
            }
        };

        const fetchCityData = async () => {
            try {
                const data = await getCityData();
                console.log("getCityData",data);
                if (data) {
                    setCityData(data);
                } else {
                    console.error('Failed to fetch city data');
                }
            } catch (error) {
                console.error('Failed to fetch city data', error);
            }
        };

        getUser();
        fetchData();
        fetchCityData();
    }, []);

    return (
        <Layout>
            <Grid container spacing={3} justifyContent="flex-start">
                <Grid item xs={12} lg={3}>
                    <Box component="section">
                        <h2>User Profile</h2>
                        {user ? (
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {(user.role === userRoles.MENTOR || user.role === userRoles.ADMIN || user.role === userRoles.SUPER_ADMIN) ? user.fullName : `${user.firstName} ${user.lastName}`}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Initials: {user.initialsName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Email: {user.email}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Role: {user.role}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ) : (
                            <p></p>
                        )}
                    </Box>
                </Grid>

                <Grid item xs={12} lg={5}>
                    <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(3) }}>
                        <Paper sx={{ padding: theme.spacing(2), boxSizing: 'border-box' }}>
                            <PieChartComponent data={occupationData} />
                        </Paper>
                        <Paper sx={{ padding: theme.spacing(2), boxSizing: 'border-box' }}>
                            <BarChartComponent data={cityData} />
                        </Paper>
                    </Box>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <Box component="section">
                        <h2>User Details</h2>
                        {user ? (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Gender</TableCell>
                                            <TableCell>{user.gender}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Occupation</TableCell>
                                            <TableCell>{user.occupation}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Working Station</TableCell>
                                            <TableCell>{user.workingStation}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>City</TableCell>
                                            <TableCell>{user.city}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>District</TableCell>
                                            <TableCell>{user.district}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>NIC or Passport Number</TableCell>
                                            <TableCell>{user.nicOrPassport}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Contact Number</TableCell>
                                            <TableCell>{user.contactNumber}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>SLMC Registration Number</TableCell>
                                            <TableCell>{user.slmcregNumber}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>CPD Provider Registration Number</TableCell>
                                            <TableCell>{user.cpdProviderRegNumber}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Official Address</TableCell>
                                            <TableCell>{user.officialAddress}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <p></p>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Layout>
    );
}