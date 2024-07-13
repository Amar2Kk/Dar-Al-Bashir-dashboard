import prismaDB from "@/lib/prismaDB";
import { ProductForm } from "./components/product-form";

interface NewProductPageProps {
    params: { productId: string; storeId: string };
}

const NewProductPage: React.FC<NewProductPageProps> = async ({ params }) => {
    const product = await prismaDB.product.findUnique({
        where: { id: params.productId },
        include: {
            images: true,
        },
    });

    const categories = await prismaDB?.category.findMany({
        where: {
            storeId: params.storeId,
        },
    });

    const types = await prismaDB?.type.findMany({
        where: {
            storeId: params.storeId,
        },
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm
                    initialData={product}
                    categories={categories}
                    types={types}
                />
            </div>
        </div>
    );
};

export default NewProductPage;
