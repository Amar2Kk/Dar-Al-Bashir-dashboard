import prismaDB from "@/lib/prismaDB";
import { format } from "date-fns";

import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

interface ProductPageProps {
    params: { storeId: string };
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
    const products = await prismaDB.product.findMany({
        where: { storeId: params.storeId },
        include:{
            category: true,   
            type: true
        },
        orderBy: { createdAt: "desc" },
    });

    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        author: item.author,
        desc: item.desc,
        inStock: item.inStock,
        price: formatter.format(item.price).replace("EGP", "").trim() + " EGP",
        category: item.category.name,
        type: item.type.name,
        isFeatured: item.isFeatured,
        isNew: item.isNew,
        isArchived: item.isArchived,
        createdAt: format(item.createdAt, "MMM do, yyyy"),
    }));
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts} />
            </div>
        </div>
    );
};

export default ProductPage;
