import { Delete, Edit, Trash } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const FieldEdit = ({
    idx,
    defaultValue,
    onUpdate,
    deleteField
}: {
    idx:number
    defaultValue: any;
    onUpdate: any;
    deleteField:any
}) => {
    const [label, setLabel] = useState<string>(defaultValue?.label);
    const [placeholder, setPlacehoder] = useState<string>(
        defaultValue?.placeholder
    );
    return (
        <div className="flex gap-2">
            <Popover>
                <PopoverTrigger>
                    <Edit className="h-4 w-5" />
                </PopoverTrigger>
                <PopoverContent>
                    <h2>Edit fields</h2>
                    <div>
                        <label className="text-xs"> Label name</label>
                        <Input
                            defaultValue={defaultValue.label}
                            type="text"
                            onChange={(e) => {
                                setLabel(e.target.value);
                            }}
                        ></Input>
                    </div>
                    <div>
                        <label className="text-xs"> Placeholder name</label>
                        <Input
                            defaultValue={defaultValue.placeholder}
                            type="text"
                            onChange={(e) => {
                                setPlacehoder(e.target.value);
                            }}
                        ></Input>
                    </div>
                    <Button
                        onClick={() =>
                            onUpdate({
                                label,
                                placeholder,
                            })
                        }
                        size="sm"
                        className="mt-3"
                    >
                        Update
                    </Button>
                </PopoverContent>
            </Popover>
            <AlertDialog>
                <AlertDialogTrigger>
                    <Trash className="h-4 w-5 text-red-500" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={()=>deleteField(idx)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default FieldEdit;
