import React from "react";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

type Item = {
  name: string;
  unit: number;
  price: number;
};

export const items: Item[] = [
  {
    name: "A",
    unit: 1,
    price: 100,
  },
];

export const AuctionHouse = () => {
  return (
    <Container>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Item</TableCell>
              <TableCell align="right">Unit</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Unit Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="item">
                  {item.name}
                </TableCell>
                <TableCell align="right">{item.unit}</TableCell>
                <TableCell align="right">{item.price}</TableCell>
                <TableCell align="right">{item.price / item.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
