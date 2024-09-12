"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type ProductColumn = {
    id: string;
    name: string;
    author: string;
    desc: string;
    price: string;
    category: string;
    type: string;
    inStock: number;
    isFeatured: boolean;
    isNew: boolean;
    isArchived: boolean;
    createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },

    {
        accessorKey: "isFeatured",
        header: "Featured",
        cell: ({ row }) => (
            <span
                className={`px-2 py-1 rounded-md text-white text-sm ${
                    row.original.isFeatured ? "bg-green-500" : "bg-red-500"
                }`}
            >
                {row.original.isFeatured ? "True" : "False"}
            </span>
        ),
    },
    {
        accessorKey: "isNew",
        header: "New",
        cell: ({ row }) => (
            <span
                className={`px-2 py-1 rounded-md text-white text-sm ${
                    row.original.isNew ? "bg-green-500" : "bg-yellow-500"
                }`}
            >
                {row.original.isNew ? "True" : "False"}
            </span>
        ),
    },
    {
        accessorKey: "isArchived",
        header: "Archived",
        cell: ({ row }) => (
            <span
                className={`px-2 py-1 rounded-md text-white text-sm ${
                    row.original.isArchived ? "bg-red-500" : "bg-yellow-500"
                }`}
            >
                {row.original.isArchived ? "True" : "False"}
            </span>
        ),
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "inStock",
        header: "Stock",
        cell: ({ row }) => (
            <span
                className={`px-2 py-1 rounded-md text-black dark:text-white text-sm ${
                    row.original.inStock < 2
                        ? "border border-red-500"
                        : "border border-green-500"
                }`}
            >
                {row.original.inStock}
            </span>
        ),
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "author",
        header: "Author",
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
