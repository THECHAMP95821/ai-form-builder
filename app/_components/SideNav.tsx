"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import { LibraryBig, LineChart, MessageSquare, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SideNav = () => {
    const menuList = [
        {
            id: 1,
            name: "My Forms",
            icon: LibraryBig,
            path: "/dashboard",
        },
        {
            id: 1,
            name: "Responses",
            icon: MessageSquare,
            path: "/dashboard/responses",
        },
        {
            id: 1,
            name: "Analytics",
            icon: LineChart,
            path: "/dashboard/analytics",
        },
        {
            id: 1,
            name: "Upgrade",
            icon: Shield,
            path: "/dashboard/upgrade",
        },
    ];

    const {user}=useUser();
    const path=usePathname();
    const [formList,setFormList]=useState<any>();
    const [PercFileCreated,setPercFileCreated]=useState(0);

    useEffect(()=>{
      
        user&&GetFormList()
    },[user])

    const GetFormList=async()=>{
        const result=await db.select().from(JsonForms)
        .where(eq(JsonForms.createdBy,user?.primaryEmailAddress?.emailAddress!))
        .orderBy(desc(JsonForms.id));

        setFormList(result);
        
        const perc=(result.length/3)*100;
        setPercFileCreated(perc)
    }
    return (
        <div className="h-screen shadow-md border">
            <div className="p-5">
                {menuList.map((menu, idx) => (
                    <Link href={menu.path}
                        key={idx}
                        className={`  flex items-center gap-3 p-4 mb-3 cursor-pointer hover:bg-primary hover:text-white rounded-lg ${
                            path == menu.path
                                ? "text-white bg-primary "
                                : "text-gray-500"
                        }`}
                    >
                        <menu.icon />
                        {menu.name}
                    </Link>
                ))}
            </div>
            <div className="fixed bottom-7 p-6 w-64">
                <Button className="w-full">+ Create Form</Button>
                <div className="my-7">
                    <Progress value={PercFileCreated} />
                    <h2 className="text-sm mt-2 text-gray-600"><strong>{formList?.length}</strong> out of <strong>3</strong> files created</h2>
                    <h2 className="text-sm mt-3 text-gray-600">Upgrade your plan for unlimited AI forms!</h2>
                </div>
            </div>
        </div>
    );
};

export default SideNav;
