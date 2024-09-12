import { NextResponse } from "next/server";
import prismaDB from "@/lib/prismaDB";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const body = await req.json();
        const { address, userId } = body;

        if (
            !address ||
            !address.apartment ||
            !address.building ||
            !address.floor ||
            !address.street ||
            !address.city ||
            !address.state ||
            !address.zipCode ||
            !address.country ||
            !address.name ||
            !address.phone
        ) {
            return new NextResponse("Complete address is required", {
                status: 400,
            });
        }
        if (!userId) {
            return new NextResponse("User Id is required", {
                status: 400,
            });
        }
        if (!params.storeId) {
            return new NextResponse("Store ID is required", {
                status: 400,
            });
        }

        // Check if the user already has an address
        const existingAddress = await prismaDB.address.findFirst({
            where: { userId: userId },
        });

        if (existingAddress) {
            // If the user already has an address, update it
            const updatedAddress = await prismaDB.address.update({
                where: { id: existingAddress.id },
                data: {
                    name: address.name,
                    apartment: address.apartment,
                    building: address.building,
                    floor: address.floor,
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    zipCode: address.zipCode,
                    country: address.country,
                    phone: address.phone,
                },
            });
            return NextResponse.json(updatedAddress);
        }

        const newAddress = await prismaDB.address.create({
            data: {
                userId: userId,
                name: address.name,
                apartment: address.apartment,
                building: address.building,
                floor: address.floor,
                street: address.street,
                city: address.city,
                state: address.state,
                zipCode: address.zipCode,
                country: address.country,
                phone: address.phone,
            },
        });

        return NextResponse.json(newAddress);
    } catch (error) {
        console.log("[ADDRESS_POST]:", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}