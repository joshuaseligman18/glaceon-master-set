import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FormWrapper from "./form";

const NewCardForm: React.FC = async () => {
    const session = await auth();
    if (!session) return redirect("/");

    return <FormWrapper />;
};

export default NewCardForm;
