import prismaDB from "@/lib/prismaDB";
import { format } from "date-fns";

import { CategoryColumn } from "./components/columns";
import { CategoryClient } from "./components/client";

interface CategoriesPageProps {
    params: { storeId: string };
}
export const revalidate = 0;

const CategoriesPage: React.FC<CategoriesPageProps> = async ({ params }) => {
    const categories = await prismaDB.category.findMany({
        where: { storeId: params.storeId },
        include: {
            billboard: true,
        },
        orderBy: { createdAt: "desc" },
    });

    const formattedCategories: CategoryColumn[] = categories.map((item) => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        createdAt: format(item.createdAt, "MMM do, yyyy"),
    }));
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryClient data={formattedCategories} />
            </div>
        </div>
    );
};

export default CategoriesPage;
