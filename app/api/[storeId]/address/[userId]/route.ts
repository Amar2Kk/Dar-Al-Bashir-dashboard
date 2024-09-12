import { NextResponse } from "next/server";

import prismaDB from "@/lib/prismaDB";

export async function GET(
    req: Request,
    { params }: { params: { userId: string } }
) {
    try {
        if (!params.userId) {
            return new NextResponse("User ID is required", {
                status: 400,
            });
        }
        const address = await prismaDB.address.findFirst({
            where: {
                userId: params.userId,
            }
        });
        if (!address) {
            return new NextResponse("Address not found", {
                status: 404,
            });
        }
        return NextResponse.json(address);
    } catch (error) {
        console.log("[USER_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}