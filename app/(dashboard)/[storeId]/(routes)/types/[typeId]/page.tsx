import prismaDB from "@/lib/prismaDB";
import { TypesForm } from "./components/type-form";

interface NewTypePageProps {
    params: { typeId: string };
}

const NewTypePage: React.FC<NewTypePageProps> = async ({ params }) => {
    const type = await prismaDB.type.findUnique({
        where: { id: params.typeId },
    });
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <TypesForm initialData={type} />
            </div>
        </div>
    );
};

export default NewTypePage;
