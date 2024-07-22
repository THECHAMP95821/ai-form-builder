import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import FieldEdit from "./FieldEdit";
import { Dispatch, useRef, useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { toast } from "sonner";
import { userResponses } from "@/configs/schema";
import { db } from "@/configs";

const FormUi = ({
    selectedTheme,
    jsonform,
    onFieldUpdate,
    deleteField,
    editable = true,
    formId = 0,
    enabledSignIn = false,
}: {
    selectedTheme: string;
    jsonform: any;
    onFieldUpdate: any;
    deleteField: any;
    editable?: any;
    formId?: any;
    enabledSignIn?: any;
}) => {
    type FormData = {
        [key: string]: {
            label: string;
            value: any; // You can replace 'any' with a more specific type if known
        }[];
    };
    const { user, isSignedIn } = useUser();
    const [formData, setFormData] = useState<FormData>();
    let formRef = useRef<HTMLFormElement>(null);
    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const onFormSubmit = async (event: any) => {
        event.preventDefault();
        console.log(formData);

        const result = await db.insert(userResponses).values({
            jsonResponse:  JSON.stringify(formData),
            createdAt: moment().format("DD/MM/yyy"),
            formRef: formId,
        });

        if (result) {
            formRef.current?.reset();
            toast("Response Submitted Successfully !");
        } else {
            toast("Error while saving your form !");
        }
    };

    

    const handleCheckboxChange = (name: any, itemName: any, value: any) => {
        const list = formData?.[name] ? formData?.[name] : [];

        if (value) {
            list.push({
                label: itemName,
                value: value,
            });
            setFormData({
                ...formData,
                [name]: list,
            });
        } else {
            const result = list.filter((item: any) => item.label == itemName);
            setFormData({
                ...formData,
                [name]: result,
            });
        }
    };

    const hadleSelectChange = (name: any, value: any) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    return (
        <form
            ref={formRef}
            onSubmit={onFormSubmit}
            className="border p-5 w-full"
            data-theme={selectedTheme}
        >
            <h2 className="font-bold text-center text-2xl">
                {jsonform?.formTitle}
            </h2>
            <h2 className="text-sm text-gray-500 text-center">
                {jsonform?.formSubheading}
            </h2>
            {jsonform.formFields?.map((field: any, idx: number) => (
                <div key={idx}>
                    {field.fieldType == "select" ? (
                        <div className="my-3">
                            <label className="text-sm text-gray-500">
                                {field.label}
                            </label>
                            <Select
                                onValueChange={(v) =>
                                    hadleSelectChange(field.name, v)
                                }
                                required={field?.required}
                            >
                                <SelectTrigger className="w-full bg-transparent">
                                    <SelectValue
                                        placeholder={field.placeholder}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.options.map(
                                        (option: any, oidx: number) => (
                                            <SelectItem
                                                key={oidx}
                                                value={option}
                                            >
                                                {option}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : field.fieldType == "radio" ? (
                        <div>
                            <label className="text-sm text-gray-500">
                                {field.label}
                            </label>
                            <RadioGroup
                                required={field?.required}
                                defaultValue="option-one"
                            >
                                {field.options?.map(
                                    (option: any, idx: number) => (
                                        <div key={idx} className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                onClick={() =>
                                                    hadleSelectChange(
                                                        field.name,
                                                        option.label
                                                    )
                                                }
                                                value={option}
                                                id={option}
                                            />
                                            <Label htmlFor={option}>
                                                {option}
                                            </Label>
                                        </div>
                                    )
                                )}
                            </RadioGroup>
                        </div>
                    ) : field.fieldType == "checkbox" ? (
                        <div>
                            <label className="text-sm text-gray-500">
                                {field.label}
                            </label>
                            {field?.options ? (
                                field.options.map(
                                    (option: any, oidx: number) => (
                                        <div key={oidx} className="flex gap-2">
                                            <Checkbox
                                                onCheckedChange={(v) =>
                                                    handleCheckboxChange(
                                                        field?.label,
                                                        option.label
                                                            ? option.label
                                                            : option,
                                                        v
                                                    )
                                                }
                                                required={field?.required}
                                            />
                                            <h2>{option.label}</h2>
                                        </div>
                                    )
                                )
                            ) : (
                                <div>
                                    <div className="flex gap-2 items-center">
                                        <Checkbox required={field?.required} />
                                        <h2>{field.label}</h2>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="my-3">
                            <label className="text-sm text-gray-500">
                                {field.label}
                            </label>
                            <Input
                                type={field?.type}
                                placeholder={field.placeholder}
                                name={field.name}
                                className="bg-transparent"
                                required={field?.required}
                                onChange={(e) => handleInputChange(e)}
                            />
                        </div>
                    )}
                    <div>
                        {editable && (
                            <FieldEdit
                                idx={idx}
                                deleteField={deleteField}
                                defaultValue={field}
                                onUpdate={(value: any) =>
                                    onFieldUpdate(value, idx)
                                }
                            />
                        )}
                    </div>
                </div>
            ))}
            <div className="mt-5">
                {!enabledSignIn ? (
                    <button className="btn btn-primary">Submit</button>
                ) : isSignedIn ? (
                    <button className="btn btn-primary">Submit</button>
                ) : (
                    <Button>
                        <SignInButton mode="modal">
                            Sign In before Submit
                        </SignInButton>
                    </Button>
                )}
            </div>
        </form>
    );
};

export default FormUi;
