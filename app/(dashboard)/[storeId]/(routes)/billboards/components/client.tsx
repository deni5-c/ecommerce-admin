"use client"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

import { BillboardColumn, columns } from "./columns"


interface BillboardClientProps {
    data: BillboardColumn[]
}

export const BillboardClient: React.FC<BillboardClientProps> = ({
        data
    
}) => {
    const route = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Billboards (${data.length})`}
                    description="Manage billboards for your store"
                />
                <Button onClick={() => route.push(`/${params.storeId}/billboards/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button> 
            </div>
            <Separator />
            <DataTable 
                columns={columns}
                data={data}
                searchKey="label"
            />
            <Heading 
                title="API"
                description="API calls for Billboards"
            />
            <Separator />
            <ApiList entityName="billboards" entityIdName="billboardId"/>
        </>
    )
}