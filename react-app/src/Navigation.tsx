import * as React from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import DiamondIcon from '@mui/icons-material/Diamond'
import { Routes } from './constants'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router'

type RouteData = {
    pathname: Routes
    label: string
}

const routeData: RouteData[] = [
    {
        pathname: Routes.Auction,
        label: 'Auction House',
    },
    {
        pathname: Routes.Craft,
        label: 'Crafting',
    },
]

export const Navigation = () => {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <nav aria-label="main mailbox folders">
                <List>
                    {routeData.map((routeData) => {
                        const { pathname, label } = routeData

                        return (
                            <ListItem key={pathname} disablePadding>
                                <ListItemButton
                                    onClick={(e) => navigate(`/${pathname}`)}
                                    selected={
                                        location.pathname === `/${pathname}`
                                    }
                                >
                                    <ListItemIcon>
                                        <AttachMoneyIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={label} />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>
            </nav>
        </Box>
    )
}
