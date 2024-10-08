import prismaDB from "@/lib/prismaDB";
import { format } from "date-fns";

import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./components/columns";

interface BillboardPageProps {
    params: { storeId: string };
}
export const revalidate = 0;

const BillboardPage: React.FC<BillboardPageProps> = async ({ params }) => {
    const billboards = await prismaDB.billboard.findMany({
        where: { storeId: params.storeId },
        orderBy: { createdAt: "desc" },
    });

    const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "MMM do, yyyy"),
    }));
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient data={formattedBillboards} />
            </div>
        </div>
    );
};

export default BillboardPage;
