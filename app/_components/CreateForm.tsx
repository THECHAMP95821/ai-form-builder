"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/configs";
import { AiChatSession } from "@/configs/AiModel";
import { JsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const PROMPT =
    ", On the basis of description please give form in json format with form title as formTitle, form subheading as formSubheading, with form having Form fields as formFields, having field name as name, placeholder as placeholder, and field label as label, fieldType, field required in json format, for field with multiple options give options as an array of strumgs";

const CreateForm = () => {
    const [userInput, setUserInput] = useState<string>();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useUser();
    const router = useRouter();
    const onCreateForm = async () => {
        console.log(userInput);
        setLoading(true);
        const result = await AiChatSession.sendMessage(
            "Description: " + userInput + PROMPT
        );
        if (result.response.text()) {
            try {
                const resp = await db
                    .insert(JsonForms)
                    .values({
                        jsonform: result.response.text(),
                        createdBy: user?.primaryEmailAddress?.emailAddress!,
                        createdAt: moment().format("DD/MM/YYYY"),
                    })
                    .returning({ id: JsonForms.id });
                console.log("NEW FORM ID ", resp);
                if (resp[0].id) {
                    router.push("/edit-form/" + resp[0].id);
                }
            } catch (error) {
                console.log(error);
            }

            setLoading(false);
        }
        setLoading(false);
        console.log(result.response.text());
    };
    return (
        <div>
            <Button onClick={() => setOpen(true)}>+Create form</Button>
            <Dialog open={open}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create new form</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        <Textarea
                            onChange={(e) => setUserInput(e.target.value)}
                            className="my-2"
                            placeholder="Write description of your form"
                        />
                        <div className="flex gap-2 my-3 justify-end">
                            <Button
                                onClick={() => {
                                    setOpen(false);
                                }}
                                variant={"destructive"}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={loading}
                                onClick={() => onCreateForm()}
                            >
                                {loading ? (
                                    <Loader2 className=" animate-spin" />
                                ) : (
                                    "Create"
                                )}
                            </Button>
                        </div>
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CreateForm;
