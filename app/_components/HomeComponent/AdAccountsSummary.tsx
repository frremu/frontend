'use client'

import React from 'react';
import {
    Typography, Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    Button 
} from '@mui/material';
import DashboardCard from './DashboardCard';
import AccountLogin  from '../AccountLogin';

const typeColor = 
    {
        Facebook: "rgb(19, 222, 185)",
        Instagram: "rgb(250, 137, 107)",
        Google: "rgb(73, 190, 255)",
 }

const accounts = [
    {
        id: "1",
        name: "Promoting Biglytics post",
        accountName: "Biglytics Ad Account",
        status: "Completed",
        type: "Facebook",     
        impressions: 0,
        clicks: 0,
        pbg: typeColor.Facebook,
        budget: 3.9,
    },
    {
        id: "2",
        name: "Capture automate screen",
        accountName: "Biglytics Ad Account",
        status: "Completed",
        type: "Facebook",
        impressions: 1,
        clicks: 1,
        pbg: typeColor.Facebook,
        budget: 24.5,
    },
    {
        id: "3",
        name: "Big Data Ebook",
        accountName: "Biglytics Ad Account",
        status: "Completed",
        type: "Facebook",
        impressions: 5,
        clicks: 10,
        pbg: typeColor.Facebook,
        budget: 12.8,
    },
    {
        id: "4",
        name: "Default Campaign Group",
        accountName: "Biglytics",
        status: "Active",
        type: "Facebook",
        impressions: 6,
        clicks: 8,
        pbg: typeColor.Facebook,
        budget: 2.4,
    },
];


const AdAccountsSummary = () => {
    return (

        <DashboardCard >
             <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <Typography variant="h5" fontWeight={550}>
          Dashboard
        </Typography>
        
        <AccountLogin/>

      </Box>

            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                <Table
                    aria-label="simple table"
                    sx={{
                        whiteSpace: "nowrap",
                        mt: 2
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Name
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Account Name
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Type
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Impressions
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Clicks
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Budget Spent
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {accounts.map((account) => (
                            <TableRow key={account.id}>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            fontSize: "15px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        {account.name}
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                {account.accountName}
                                            </Typography>
                                            <Typography
                                                color="textSecondary"
                                                sx={{
                                                    fontSize: "13px",
                                                }}
                                            >
                                                {account.status}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        sx={{
                                            px: "4px",
                                            backgroundColor: account.pbg,
                                            color: "#fff",
                                        }}
                                        size="small"
                                        label={account.type}
                                    ></Chip>
                                </TableCell>

                                <TableCell align="right">
                                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                                        {account.impressions}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                                        {account.clicks}
                                    </Typography>
                                </TableCell>
                               

                                <TableCell align="right">
                                    <Typography color="textSecondary" variant="subtitle2">${account.budget}k</Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </DashboardCard>
    );
};

export default AdAccountsSummary;
