import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismaDB from "@/lib/prismaDB";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { storeId: string };
}) {
    const { userId } = auth();
    if (!userId) {
        redirect("/sign-in");
    }
    const store = await prismaDB.store.findFirst({
        where: {
            id: params.storeId,
            userId,
        },
    });

    if (!store) {
        redirect("/");
    }

    return (
        <div className="min-h-[98vh] flex flex-col">
            <NavBar />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}
