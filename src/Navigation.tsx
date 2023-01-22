import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DiamondIcon from "@mui/icons-material/Diamond";
import { Routes } from "./constants.ts";

type NavigationProps = {
  navigateTo: (route: string) => void;
};

export const Navigation: React.FC<NavigationProps> = ({ navigateTo }) => {
  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <nav aria-label="main mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={(e) => navigateTo(Routes.Auction)}>
              <ListItemIcon>
                <AttachMoneyIcon />
              </ListItemIcon>
              <ListItemText primary="Auction House" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={(e) => navigateTo(Routes.Craft)}>
              <ListItemIcon>
                <DiamondIcon />
              </ListItemIcon>
              <ListItemText primary="Crafting" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
};
