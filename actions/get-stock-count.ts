import prismaDB from "@/lib/prismaDB";

export const getStockCount = async (storeId: string) => {
    const products = await prismaDB.product.findMany({
        where: {
            storeId,
            isArchived: false,
        },
    });

    const totalStockCount = products.reduce(
        (total, product) => total + product.inStock,
        0
    );

    return totalStockCount;
};
