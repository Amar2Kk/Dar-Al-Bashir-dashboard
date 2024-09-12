import { NextResponse } from "next/server";
import prismaDB from "@/lib/prismaDB";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query") || "";

        if (!params.storeId) {
            return new NextResponse("Store ID is required", {
                status: 400,
            });
        }
        const products = await prismaDB.product.findMany({
            where: {
                storeId: params.storeId,
                OR: [
                    {
                        name: {
                            contains: query,
                        },
                    },
                    {
                        author: {
                            contains: query,
                        },
                    },
                ],
                isArchived: false,
            },
            include: {
                images: true,
                category: true,
                type: true,
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.log("[PRODUCTS_GET]:", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
