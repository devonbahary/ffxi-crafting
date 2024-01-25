import { ReactNode } from 'react';
import { RouteObject } from 'react-router-dom';
import CarpenterIcon from '@mui/icons-material/Carpenter';
import InsightsIcon from '@mui/icons-material/Insights';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { DESCRIPTION as PROFITS_DESCRIPTION, Profits } from './profits/Profits';
import {
    DESCRIPTION as AUCTION_HOUSE_DESCRIPTION,
    AuctionHouse,
} from './auction-house/AuctionHouse';
import {
    DESCRIPTION as CRAFTING_DESCRIPTION,
    Crafting,
} from './crafting/Crafting';
import { Synthesis } from './crafting/Synthesis';
import {
    DESCRIPTION as SHOPPING_CART_DESCRIPTION,
    ShoppingCart,
} from './shopping-cart/ShoppingCart';
import { LandingPage } from './landing/LandingPage';

export type RouteItem = Required<Pick<RouteObject, 'path' | 'element'>> & {
    navigable?: Navigable;
};

export type NavigableRouteItem = RouteItem &
    Required<Pick<RouteItem, 'navigable'>>;

type Navigable = {
    icon: ReactNode;
    name: string;
    image: string;
    landingPageText: string;
};

export const ROUTE_ITEMS: RouteItem[] = [
    {
        path: '/profits',
        element: <Profits />,
        navigable: {
            name: 'Profits',
            icon: <InsightsIcon />,
            image: require('./images/Profits.png'),
            landingPageText: PROFITS_DESCRIPTION,
        },
    },
    {
        path: '/auction-house',
        element: <AuctionHouse />,
        navigable: {
            name: 'Auction House',
            icon: <StorefrontIcon />,
            image: require('./images/AuctionHouse.png'),
            landingPageText: AUCTION_HOUSE_DESCRIPTION,
        },
    },
    {
        path: '/crafting',
        element: <Crafting />,
        navigable: {
            name: 'Crafting',
            icon: <CarpenterIcon />,
            image: require('./images/Crafting.png'),
            landingPageText: CRAFTING_DESCRIPTION,
        },
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
        navigable: {
            name: 'Shopping Cart',
            icon: <ShoppingCartIcon />,
            image: require('./images/ShoppingCart.png'),
            landingPageText: SHOPPING_CART_DESCRIPTION,
        },
    },
    {
        path: '/',
        element: <LandingPage />,
    },
];

export const NAVIGABLE_ROUTE_ITEMS: NavigableRouteItem[] = ROUTE_ITEMS.filter(
    (r): r is NavigableRouteItem => r.navigable !== undefined
);
