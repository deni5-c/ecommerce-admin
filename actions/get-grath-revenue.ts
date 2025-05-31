import prismadb from "@/lib/prismadb";
import { parse } from "path";

interface GrathData {
    name: string;
    total: number;
}

export const getGrathRevenue = async (storeId: string) => {
    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true,
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                }
            }
        }
    })

    const montlyRevenue: { [key: number]: number } = {};

    for (const order of paidOrders) {
        const month = order.createdAt.getMonth()
        let revenueForOrder = 0;
        for (const item of order.orderItems) {
            revenueForOrder += item.product.price.toNumber();
        }

        montlyRevenue[month] = (montlyRevenue[month] || 0) + revenueForOrder;
    }

    const grathData: GrathData[] = [
        {name: "Jan", total: 0},
        {name: "Feb", total: 0},
        {name: "Mar", total: 0},
        {name: "Apr", total: 0},
        {name: "May", total: 0},
        {name: "Jun", total: 0},
        {name: "Jul", total: 0},
        {name: "Aug", total: 0},
        {name: "Sep", total: 0},
        {name: "Oct", total: 0},
        {name: "Nov", total: 0},
        {name: "Dec", total: 0},
    ]

    for (const month in montlyRevenue) {
        grathData[parseInt(month)].total = montlyRevenue[parseInt(month)];
    }

    return grathData;
}