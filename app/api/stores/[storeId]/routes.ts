import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string }}
) {
    try{
        const { userId } = await auth()
        const body = await req.json()

        const { name } = body

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        if (!params) {
            return new NextResponse("Store id is required", { status: 400 })
        }

        const store = await prismadb.store.updateMany({
            where: {
                id: params.storeId,
                userId
            },
            data: {
                name
            }
        })

        return NextResponse.json(store)
    } catch(error){
        console.log('[STORE_PATCH]', error)
        return new NextResponse("Internel error", {status: 500})
    }
}