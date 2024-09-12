"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type OrderColumn = {
    id: string;
    paymobId: string;
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
        accessorKey: "paymobId",
        header: "Order ID (Paymob)",
    },
    {
        accessorKey: "products",
        header: "Products",
        cell: ({ row }) => {
            const productNames = row.original.products.split(",");

            return (
                <div className="flex flex-col space-y-2">
                    {productNames.map((productName, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-3 border p-2 rounded-md"
                        >
                            <span className="text-sm font-medium">
                                {productName.trim()}
                            </span>
                        </div>
                    ))}
                </div>
            );
        },
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
        cell: ({ row }) => (
            <span
                className={`px-2 py-1 rounded-md text-white text-sm ${
                    row.original.isPaid ? "bg-green-500" : "bg-red-500"
                }`}
            >
                {row.original.isPaid ? "Paid" : "Unpaid"}
            </span>
        ),
    },
    {
        accessorKey: "isDelivered",
        header: "Delivered",
        cell: ({ row }) => (
            <span
                className={`px-2 py-1 rounded-md text-white text-sm ${
                    row.original.isDelivered ? "bg-green-500" : "bg-yellow-500"
                }`}
            >
                {row.original.isDelivered ? "Delivered" : "Pending"}
            </span>
        ),
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
