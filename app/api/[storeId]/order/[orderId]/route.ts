import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismaDB from "@/lib/prismaDB";

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; orderId: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }
        if (!params.orderId) {
            return new NextResponse("Order ID is required", {
                status: 400,
            });
        }
        const storeByUserId = await prismaDB.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            },
        });
        if (!storeByUserId) {
            return new NextResponse("Unauthorized", {
                status: 403,
            });
        }
        const order = await prismaDB.order.updateMany({
            where: {
                id: params.orderId,
            },
            data: {
                isDelivered:true
            },
        });
        return NextResponse.json(order);
    } catch (error) {
        console.log("[ORDER_PATCH]:", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}