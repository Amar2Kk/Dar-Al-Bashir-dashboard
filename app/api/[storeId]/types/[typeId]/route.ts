import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismaDB from "@/lib/prismaDB";

export async function GET(
    req: Request,
    { params }: { params: { typeId: string } }
) {
    try {
        if (!params.typeId) {
            return new NextResponse("Type ID is required", {
                status: 400,
            });
        }
        const type = await prismaDB.type.findUnique({
            where: {
                id: params.typeId,
            },
        });

        return NextResponse.json(type);
    } catch (error) {
        console.log("[TYPE_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; typeId: string } }
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
        if (!params.typeId) {
            return new NextResponse("Type ID is required", {
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
        const type = await prismaDB.type.updateMany({
            where: {
                id: params.typeId,
            },
            data: {
                name,
            },
        });
        return NextResponse.json(type);
    } catch (error) {
        console.log("[TYPE_PATCH]:", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; typeId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        if (!params.typeId) {
            return new NextResponse("Type ID is required", {
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
        const type = await prismaDB.type.deleteMany({
            where: {
                id: params.typeId,
            },
        });

        return NextResponse.json(type);
    } catch (error) {
        console.log("[TYPE_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
