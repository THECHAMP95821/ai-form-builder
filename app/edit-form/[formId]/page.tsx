"use client";

import Controller from "@/app/_components/Controller";
import FormUi from "@/app/_components/FormUi";
import { Button } from "@/components/ui/button";
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { ArrowLeft, Share2, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fromJSON } from "postcss";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { RWebShare } from 'react-web-share'

const EditForm = ({ params }: { params: { formId: number } }) => {
    const { user } = useUser();
    const [jsonform, setJsonForm] = useState<any>([]);
    const [updateTrigger, setUpdateTrigger] = useState<number>();
    const [record, setRecord] = useState<any>([]);
    const [selectedTheme, setSelectedTheme] = useState<string>("light");
    const [selectedBackground, setSelectedBackground] = useState<string>();
    const [selectedStyle, setSelectedStyle] = useState();

    const router = useRouter();
    useEffect(() => {
        if (updateTrigger) {
            setJsonForm(jsonform);
            updateDb();
        }
    }, [updateTrigger]);
    useEffect(() => {
        user && getFormData();
    }, [user]);
    const updateDb = async () => {
        const result = await db
            .update(JsonForms)
            .set({
                jsonform: jsonform,
            })
            .where(
                and(
                    eq(JsonForms.id, record.id),
                    eq(
                        JsonForms.createdBy,
                        user?.primaryEmailAddress?.emailAddress!
                    )
                )
            );
        toast("Updated the fields !!!");
    };
    const getFormData = async () => {
        const result = await db
            .select()
            .from(JsonForms)
            .where(
                and(
                    eq(JsonForms.id, params.formId),
                    eq(
                        JsonForms.createdBy,
                        user?.primaryEmailAddress?.emailAddress!
                    )
                )
            );
        setRecord(result[0]);
        setJsonForm(JSON.parse(result[0].jsonform));
        setSelectedBackground(result[0].background!);
        setSelectedTheme(result[0].theme!);
        setSelectedStyle(JSON.parse(result[0].style!));
    };
    const onFieldUpdate = (value: any, idx: number) => {
        jsonform.formFields[idx].label = value.label;
        jsonform.formFields[idx].placeholder = value.placeholder;
        setUpdateTrigger(Date.now());
    };
    const deleteField = (idx: number) => {
        const res = jsonform.formFields.filter(
            (item: any, index: number) => index != idx
        );
        jsonform.formFields = res;
        setUpdateTrigger(Date.now());
    };

    const updateControllerFields = async (value: any, columnName: any) => {
        console.log(value, columnName);

        const email = user?.primaryEmailAddress?.emailAddress;

        if (!email) {
            console.error("Email address is undefined");
            toast("Update failed: Email address is undefined");
            return;
        }

        const result = await db
            .update(JsonForms)
            .set({
                [columnName]: value,
            })
            .where(
                and(eq(JsonForms.id, record.id), eq(JsonForms.createdBy, email))
            )
            .returning({ id: JsonForms.id });

        toast("Updated!!!");
    };

    return (
        <div className="p-10">
            <h2
                onClick={() => router.back()}
                className="flex gap-2 items-center my-5 cursor-pointer hover:font-bold transition-all"
            >
                <ArrowLeft /> Back
            </h2>
            <div className="flex gap-2">
                <Link href={"/aiform/" + record?.id} target="_blank">
                    <Button className="flex gap-2">
                        {" "}
                        <SquareArrowOutUpRight className="h-5 w-5" /> Live
                        Preview
                    </Button>
                </Link>
                <RWebShare
                    data={{
                        text:
                            jsonform?.formHeading +
                            " , Build your form in seconds with AI form Builder ",
                        url:
                            process.env.NEXT_PUBLIC_BASE_URL +
                            "/aiform/" +
                            record?.id,
                        title: jsonform?.formTitle,
                    }}
                    onClick={() => console.log("shared successfully!")}
                >
                    <Button className="flex gap-2 bg-green-600 hover:bg-green-700">
                        {" "}
                        <Share2 /> Share
                    </Button>
                </RWebShare>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 p-5 border rounde-lg shadow-md gap-5">
                <div>
                    <Controller
                        selectedTheme={(value: any) => {
                            updateControllerFields(value, "theme");
                            setSelectedTheme(value);
                        }}
                        selectedBackground={(value: any) => {
                            updateControllerFields(value, "background");

                            setSelectedBackground(value);
                        }}
                        selectedStyle={(value: any) => {
                            setSelectedStyle(value);
                            updateControllerFields(value, "style");
                        }}
                        setSignInEnable={(value: any) => {
                            updateControllerFields(value, "enabledSignIn");
                        }}
                    />
                </div>
                <div
                    className="md:col-span-2 border rounded-lg p-5 flex items-center justify-center"
                    style={{ backgroundImage: selectedBackground }}
                >
                    <FormUi
                        selectedTheme={selectedTheme!}
                        onFieldUpdate={onFieldUpdate}
                        jsonform={jsonform}
                        deleteField={deleteField}
                    ></FormUi>
                </div>
            </div>
        </div>
    );
};

export default EditForm;
