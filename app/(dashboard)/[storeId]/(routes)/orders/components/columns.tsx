"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type OrderColumn = {
    id: string;
    phone: string;
    address: string;
    isPaid: Boolean;
    isDelivered: Boolean;
    totalPrice: string;
    products: string;
    createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
    {
        accessorKey: "products",
        header: "Products",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "totalPrice",
        header: "Total Price",
    },
    {
        accessorKey: "isPaid",
        header: "Paid",
    },
    {
        accessorKey: "isDelivered",
        header: "Delivered",
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    },
];
