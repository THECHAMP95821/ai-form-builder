import { Button } from "@/components/ui/button";
import CreateForm from "../_components/CreateForm";
import FormList from "../_components/FormList";

const page = () => {
    return (
        <div className="p-10">
            <h2 className="font-bold text-3xl flex items-center justify-between">
                Dashboard
                <CreateForm />
            </h2>
            <FormList/>
        </div>
    );
};

export default page;