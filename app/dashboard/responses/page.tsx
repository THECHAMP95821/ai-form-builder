"use client";
import { db } from "@/configs";
import { JsonForms, userResponses } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import FormListItemResp from "./_components/FormListItemResp";
import { sql } from "drizzle-orm";

function Responses() {
    const { user } = useUser();
    const [formList, setFormList] = useState<any>();

    useEffect(() => {
        user && getFormList();
    }, [user]);

    const getFormList = async () => {
        const email = user?.primaryEmailAddress?.emailAddress;

        if (email) {
            try {
                // Perform the query to get forms and response counts
                const result = await db
                    .select({
                        JsonForms, // Select all fields from JsonForms
                        responseCount: sql<number>`cast(count(${userResponses.id}) as int)`, // Count responses
                    })
                    .from(JsonForms)
                    .leftJoin(
                        userResponses,
                        eq(JsonForms.id, userResponses.formRef)
                    ) // Join tables
                    .where(eq(JsonForms.createdBy, email)) // Filter by email
                    .groupBy(JsonForms.id); // Group by form id

                setFormList(result);
                console.log("RESULT", result);
            } catch (error) {
                console.error("Error fetching form list:", error);
            }
        } else {
            console.error("User email is undefined.");
        }
    };
    return (
        formList && (
            <div className="p-10">
                <h2 className="font-bold text-3xl flex items-center justify-between">
                    Responses
                </h2>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                    {formList &&
                        formList?.map((form: any, index: any) => {
                            return (
                                <FormListItemResp
                                    key={index}
                                    formRecord={form.JsonForms}
                                    jsonForm={JSON.parse(
                                        form.JsonForms.jsonform
                                    )}
                                    responseCount={form.responseCount}
                                />
                            );
                        })}
                </div>
            </div>
        )
    );
}

export default Responses;
