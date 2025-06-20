import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

import prisma from "@/lib/prismadb"

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }   
) {
    try {
        const { userId } = await auth()
        const body = await req.json()

        const { name, value } = body

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!name) {
            return new NextResponse("Name is required", {status: 400 })
        }

        if(!value) {
            return new NextResponse("Value is required", {status: 400 })
        }

        params = await params
        if(!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 })
        }

        const storeByUserId = await prisma.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 })
        }

        const color = await prisma.color.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        })

        return NextResponse.json(color)
    } catch (error){
        console.log('[COLORS_POST]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }   
) {
    params = await params
    try {
        if(!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 })
        }

        const colors = await prisma.color.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(colors)
    } catch (error){
        console.log('[COLORS_GET]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}