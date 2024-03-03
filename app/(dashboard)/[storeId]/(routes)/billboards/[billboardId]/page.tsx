import prismaDB from "@/lib/prismaDB";
import { BillboardForm } from "./components/billboard-form";

interface NewBillboardPageProps {
    params: { billboardId: string };
}

const NewBillboardPage: React.FC<NewBillboardPageProps> = async ({
    params,
}) => {
    const billboard = await prismaDB.billboard.findUnique({
        where: { id: params.billboardId },
    });
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardForm initialData={billboard}/>
            </div>
        </div>
    );
};

export default NewBillboardPage;
