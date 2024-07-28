"use client"

import { ArrowRight, Plus } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { api } from "~/trpc/react"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const formSchema = z.object({
    name: z.string().min(1).max(100),
})

export function AddSkienDialog() {

    const createSkien = api.skien.create.useMutation(
        {
            onSuccess: (skien) => {
                console.log(skien)
            }
        }
    );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {

        createSkien.mutate(values)
        if (createSkien.isSuccess) {
            revalidatePath("/skiens")
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <span className="flex gap-2 items-center">
                        <Plus className="h-4 w-4" />
                        Add a skien
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Add a skien
                    </DialogTitle>
                    <DialogDescription>
                        Start adding a new skien to your collection.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Name your skien.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" size="sm" className="px-3">
                                <span className="flex items-center gap-2 justify-baseline">
                                    <span >Create</span>
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}
