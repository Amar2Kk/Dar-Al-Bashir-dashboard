import prismaDB from "@/lib/prismaDB";
import { NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { productsIds, userId, addressId, PayMobOrderId } =
            await req.json();

        if (!productsIds || productsIds.length === 0) {
            return NextResponse.json(
                { message: "Product IDs are required." },
                { status: 400 }
            );
        }
        if (!userId || !addressId) {
            return NextResponse.json(
                { message: "User ID and Address ID are required." },
                { status: 400 }
            );
        }

        const products = await prismaDB.product.findMany({
            where: {
                id: {
                    in: productsIds
                }
            }
        });

        if (products.length !== productsIds.length) {
            return NextResponse.json(
                { message: "Some products not found." },
                { status: 400 }
            );
        }

        // Create order
        const order = await prismaDB.order.create({
            data: {
                storeId: params.storeId,
                userId,
                addressId,
                PayMobOrderId,
                isPaid: true,
                orderItems: {
                    create: products.map((product) => ({
                        product: { connect: { id: product.id } },
                        price: product.price
                    })),
                },
            },
            include: { orderItems: true },
        });

        const productIds = order.orderItems
            .map((orderItem) => orderItem.productId)
            .filter((id): id is string => id !== null);

        await prismaDB.product.updateMany({
            where: { id: { in: productIds } },
            data: {
                inStock: { decrement: 1 },
            },
        });

        await prismaDB.product.updateMany({
            where: {
                id: { in: productIds },
                inStock: 0,
            },
            data: {
                isArchived: true,
            },
        });

        return NextResponse.json(
            { message: "Order created successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}
