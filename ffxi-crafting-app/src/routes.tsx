import { ReactNode } from 'react';
import { RouteObject } from 'react-router-dom';
import CarpenterIcon from '@mui/icons-material/Carpenter';
import InsightsIcon from '@mui/icons-material/Insights';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { InsightsDashboard } from './insights-dashboard/InsightsDashboard';
import { AuctionHouse } from './auction-house/AuctionHouse';
import { Crafting } from './crafting/Crafting';
import { Synthesis } from './crafting/Synthesis';
import { ShoppingCart } from './shopping-cart/ShoppingCart';

type Navigation = RouteObject &
    Required<Pick<RouteObject, 'path'>> & {
        navIcon?: ReactNode;
        navText?: string;
    };

export const navigationItems: Navigation[] = [
    {
        path: '/home',
        element: <InsightsDashboard />,
        navText: 'Home',
        navIcon: <InsightsIcon />,
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
        path: '/synthesis/create',
        element: <Synthesis />,
    },
    {
        path: '/synthesis/edit/:id',
        element: <Synthesis />,
    },
    {
        path: '/shopping-cart',
        element: <ShoppingCart />,
        navText: 'Shopping Cart',
        navIcon: <ShoppingCartIcon />,
    },
];
