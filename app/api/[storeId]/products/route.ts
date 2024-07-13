import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismaDB from "@/lib/prismaDB";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const {
            name,
            price,
            inStock,
            categoryId,
            typeId,
            images,
            isFeatured,
            isArchived,
        } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }
        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }
        if (!images || !images.length) {
            return new NextResponse("Images are required", { status: 400 });
        }
        if (!inStock) {
            return new NextResponse("Stock number is required", {
                status: 400,
            });
        }
        if (!categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
        }
        if (!typeId) {
            return new NextResponse("Type id is required", { status: 400 });
        }
        if (!params.storeId) {
            return new NextResponse("Store ID is required", {
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
        const product = await prismaDB.product.create({
            data: {
                name,
                price,
                inStock,
                categoryId,
                typeId,
                isFeatured,
                isArchived,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image),
                        ],
                    },
                },
            },
        });
        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCTS_POST]:", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const typeId = searchParams.get("typeId") || undefined;
        const isFeatured = searchParams.get("isFeatured");

        if (!params.storeId) {
            return new NextResponse("Store ID is required", {
                status: 400,
            });
        }
        const products = await prismaDB.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                typeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
            },
            include: {
                images: true,
                category: true,
                type: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json(products);
    } catch (error) {
        console.log("[PRODUCTS_GET]:", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
