import prismaDB from "@/lib/prismaDB";
import { format } from "date-fns";

import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

interface OrderPageProps {
    params: { storeId: string };
}

const OrderPage: React.FC<OrderPageProps> = async ({ params }) => {
    const orders = await prismaDB.order.findMany({
        where: { storeId: params.storeId },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
            address: true,
        },
        orderBy: { createdAt: "desc" },
    });
    const formattedOrders: OrderColumn[] = orders.map((item) => ({
        id: item.id,
        phone: item.address.phone,
        paymobId: item.PayMobOrderId,
        address: [
            item.address.apartment,
            item.address.building,
            item.address.floor,
            item.address.street,
            item.address.city,
            item.address.state,
            item.address.country,
            item.address.zipCode,
        ]
            .filter(Boolean)
            .join(", "),
        products: item.orderItems
            .map((orderItem) => orderItem.product.name)
            .join(", "),
        totalPrice: formatter.format(
            item.orderItems.reduce((total, item) => {
                return total + Number(item.product.price);
            }, 0)
        ),
        isPaid: item.isPaid,
        isDelivered: item.isDelivered,
        createdAt: format(item.createdAt, "MMM do, yyyy"),
    }));
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderClient data={formattedOrders} />
            </div>
        </div>
    );
};

export default OrderPage;
