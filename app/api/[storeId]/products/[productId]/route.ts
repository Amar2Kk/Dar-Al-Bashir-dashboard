import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismaDB from "@/lib/prismaDB";

export async function GET(
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {
        if (!params.productId) {
            return new NextResponse("Product ID is required", {
                status: 400,
            });
        }
        const product = await prismaDB.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                type: true,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCT_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; productId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const {
            name,
            author,
            desc,
            price,
            inStock,
            categoryId,
            typeId,
            images,
            isFeatured,
            isNew,
            isArchived,
        } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }
        if (!author) {
            return new NextResponse("Author is required", { status: 400 });
        }
        if (!desc) {
            return new NextResponse("Description is required", { status: 400 });
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
        if (!params.productId) {
            return new NextResponse("Product ID is required", {
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
        await prismaDB.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                author,
                desc,
                price,
                inStock,
                categoryId,
                typeId,
                images: {
                    deleteMany: {},
                },
                isFeatured,
                isNew,
                isArchived,
            },
        });

        const product = await prismaDB.product.update({
            where: {
                id: params.productId,
            },
            data: {
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
        console.log("[PRODUCT_PATCH]:", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; productId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        if (!params.productId) {
            return new NextResponse("Product ID is required", {
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
        const product = await prismaDB.product.deleteMany({
            where: {
                id: params.productId,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCT_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
