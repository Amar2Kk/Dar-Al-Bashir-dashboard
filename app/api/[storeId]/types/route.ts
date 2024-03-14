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
        const { name } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
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
        const type = await prismaDB.type.create({
            data: {
                name,
                storeId: params.storeId,
            },
        });
        return NextResponse.json(type);
    } catch (error) {
        console.log("[TYPES_POST]:", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        if (!params.storeId) {
            return new NextResponse("Store ID is required", {
                status: 400,
            });
        }
        const types = await prismaDB.type.findMany({
            where: {
                storeId: params.storeId,
            },
        });
        return NextResponse.json(types);
    } catch (error) {
        console.log("[TYPES_GET]:", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
