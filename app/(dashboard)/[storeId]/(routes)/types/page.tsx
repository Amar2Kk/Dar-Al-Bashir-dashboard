import prismaDB from "@/lib/prismaDB";
import { format } from "date-fns";

import { TypesClient } from "./components/client";
import { TypesColumns } from "./components/columns";

interface TypesPageProps {
    params: { storeId: string };
}

const TypesPage: React.FC<TypesPageProps> = async ({ params }) => {
    const types = await prismaDB.type.findMany({
        where: { storeId: params.storeId },
        orderBy: { createdAt: "desc" },
    });

    const formattedTypes: TypesColumns[] = types.map((item) => ({
        id: item.id,
        name: item.name,
        createdAt: format(item.createdAt, "MMM do,yyyy"),
    }));
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <TypesClient data={formattedTypes} />
            </div>
        </div>
    );
};

export default TypesPage;
