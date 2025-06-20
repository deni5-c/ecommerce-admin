"use client"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

import { CategoryColumn, columns } from "./columns"


interface CategoryClientProps {
    data: CategoryColumn[]
}

export const CategoryClient: React.FC<CategoryClientProps> = ({
        data
    
}) => {
    const route = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Categories (${data.length})`}
                    description="Manage categories"
                />
                <Button onClick={() => route.push(`/${params.storeId}/categories/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button> 
            </div>
            <Separator />
            <DataTable 
                columns={columns}
                data={data}
                searchKey="name"
            />
            <Heading 
                title="API"
                description="API calls for Categories"
            />
            <Separator />
            <ApiList entityName="categories" entityIdName="categoryId"/>
        </>
    )
}