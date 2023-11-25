import { ReactNode } from 'react';
import { RouteObject } from 'react-router-dom';
import CarpenterIcon from '@mui/icons-material/Carpenter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { Dashboard } from './dashboard/Dashboard';
import { AuctionHouse } from './auction-house/AuctionHouse';
import { Crafting } from './crafting/Crafting';
import { CraftingCreate } from './crafting/CraftingCreate';

type Navigation = RouteObject &
    Required<Pick<RouteObject, 'path'>> & {
        navIcon?: ReactNode;
        navText?: string;
    };

export const navigationItems: Navigation[] = [
    {
        path: '/home',
        element: <Dashboard />,
        navText: 'Home',
        navIcon: <DashboardIcon />,
    },
    {
        path: '/auction-house',
        element: <AuctionHouse />,
        navText: 'Auction House',
        navIcon: <StorefrontIcon />,
    },
    {
        path: '/crafting',
        element: <Crafting />,
        navText: 'Crafting',
        navIcon: <CarpenterIcon />,
    },
    {
        path: '/crafting/create',
        element: <CraftingCreate />,
    },
];
