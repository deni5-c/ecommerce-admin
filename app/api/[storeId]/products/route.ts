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

        const { 
            name, 
            price, 
            categoryId, 
            colorId, 
            sizeId, 
            images, 
            isFeatured, 
            isArchived 
        } = body

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!name) {
            return new NextResponse("Name is required", {status: 400 })
        }

        if(!images || !images.length) {
            return new NextResponse("Images are required", { status: 400 })
        }

        if(!price) {
            return new NextResponse("Price URL is required", {status: 400 })
        }

        if(!categoryId) {
            return new NextResponse("Category ID is required", { status: 400 })
        }

        if(!colorId) {
            return new NextResponse("Color ID is required", { status: 400 })
        }

        if(!sizeId) {
            return new NextResponse("Size ID is required", { status: 400 })
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

        const product = await prisma.product.create({
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                isFeatured,
                isArchived,                
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                },
            }
        })

        return NextResponse.json(product)
    } catch (error){
        console.log('[PRODUCTS_POST]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }   
) {
    params = await params
    try {
        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get("categoryId") || undefined
        const colorId = searchParams.get("colorId") || undefined
        const sizeId = searchParams.get("sizeId") || undefined
        const isFeatured = searchParams.get("isFeatured")

        if(!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 })
        }

        const products = await prisma.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(products)
    } catch (error){
        console.log('[PRODUCTS_GET]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}