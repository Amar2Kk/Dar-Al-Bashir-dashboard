"use client";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Type } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";

interface TypesFormProps {
    initialData: Type | null;
}
const formSchema = z.object({
    name: z.string().min(2),
});

type TypesFormValues = z.infer<typeof formSchema>;

export const TypesForm: React.FC<TypesFormProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit type" : "Create type";
    const description = initialData ? "Edit type" : "Add a new type";
    const toastMessage = initialData ? "Type updated." : "Type created.";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<TypesFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
        },
    });
    const onSubmit = async (data: TypesFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(
                    `/api/${params.storeId}/types/${params.typeId}`,
                    data
                );
            } else {
                await axios.post(`/api/${params.storeId}/types`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/types`);
            toast.success(toastMessage);
        } catch (error: any) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/types/${params.typeId}`);
            router.refresh();
            router.push(`/${params.storeId}/types`);
            toast.success("Type deleted.");
        } catch (error: any) {
            toast.error(
                "Make sure you removed all types using this type first."
            );
        } finally {
            setLoading(false);
            setOpen(false);
            router.refresh();
        }
    };
    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData && (
                    <Button
                        variant="destructive"
                        size="sm"
                        disabled={loading}
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="w-5 h-5" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full"
                >
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="Type name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        disabled={loading}
                        className="ml-auto"
                        type="submit"
                    >
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    );
};
