import prismaDB from "@/lib/prismaDB";

interface GraphData {
    name: string;
    Total: number;
}

export const getGraphRevenue = async (storeId: string) => {
    const paidOrders = await prismaDB.order.findMany({
        where: {
            storeId,
            isPaid: true,
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    });

    const monthlyRevenue: { [key: number]: number } = {};

    for (const order of paidOrders) {
        const month = order.createdAt.getMonth();
        let revenueForOrder = 0;
        for (const item of order.orderItems) {
            revenueForOrder += item.price;
        }
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
    }
    const graphData: GraphData[] = [
        { name: "Jan", Total: 0 },
        { name: "Feb", Total: 0 },
        { name: "Mar", Total: 0 },
        { name: "Apr", Total: 0 },
        { name: "May", Total: 0 },
        { name: "Jun", Total: 0 },
        { name: "Jul", Total: 0 },
        { name: "Aug", Total: 0 },
        { name: "Sep", Total: 0 },
        { name: "Oct", Total: 0 },
        { name: "Nov", Total: 0 },
        { name: "Dec", Total: 0 },
    ];

    for (const month in monthlyRevenue) {
        graphData[parseInt(month)].Total = monthlyRevenue[parseInt(month)];
    }
    return graphData
};
