"use client";

import toast from "react-hot-toast";
import { Copy, MoreHorizontal } from "lucide-react";


import { Button } from "@/components/ui/button";
import { OrderColumn } from "./columns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CellActionProps {
    data: OrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {


    const onCopy = (data: string) => {
        navigator.clipboard.writeText(data);
        toast.success("Copied to clipboard.");
    };
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="group"
                        onClick={() => onCopy(data.address)}
                    >
                        <Copy className="mr-2 h-4 w-4 group-hover:text-sky-600 transition" />
                        Copy address
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="group"
                        onClick={() => onCopy(data.phone)}
                    >
                        <Copy className="mr-2 h-4 w-4 group-hover:text-sky-600 transition" />
                        Copy phone number
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
