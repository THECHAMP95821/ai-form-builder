"use client"
import { db } from '@/configs';
import { JsonForms } from '@/configs/schema';
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm';
import  { useEffect, useState } from 'react'
import FormListItem from './FormListItem';

function FormList() {

    const {user}=useUser();
    const [formList,setFormList]=useState<any>([]);
    const GetFormList=async()=>{
        const result=await db.select().from(JsonForms)
        .where(eq(JsonForms.createdBy,user?.primaryEmailAddress?.emailAddress!))
        .orderBy(desc(JsonForms.id));

        setFormList(result);
        console.log(result);
    }
    useEffect(()=>{
        user&&GetFormList();
    },[user,GetFormList])
    

  return (
    <div className='mt-5 grid grid-cols-2 md:grid-cols-3 gap-5'>
        {formList.map((form:any,index:any)=>(
            <div key={index}>
                <FormListItem 
                jsonForm={JSON.parse(form.jsonform)}
                formRecord={form}
                refreshData={GetFormList}
                />
           </div>
        ))}
    </div>
  )
}

export default FormList