"use client";

import toast from "react-hot-toast";
import { Copy, MoreHorizontal, PackageCheck } from "lucide-react";

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
import { useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
    data: OrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const params = useParams();
    const router = useRouter();

    const onCopy = (data: string) => {
        navigator.clipboard.writeText(data);
        toast.success("Copied to clipboard.");
    };
    const handleDelivered = async () => {
        try {
            await axios.patch(`/api/${params.storeId}/order/${data.id}`);
            router.refresh();
            toast.success("Order marked as delivered.");
        } catch (error: any) {
            toast.error("An error occurred.");
        }
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
                    <DropdownMenuItem
                        className="group"
                        onClick={handleDelivered}
                    >
                        <PackageCheck className="mr-2 h-4 w-4 group-hover:text-green-600 transition" />
                        Mark as Delivered
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
