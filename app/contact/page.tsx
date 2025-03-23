"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/lib/validation/contact";
import * as z from "zod";
import { toast } from "sonner";

const ContactPage = () => {
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: z.infer<typeof contactSchema>) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Message sent successfully!");
        form.reset();
      } else {
        toast.error("Failed to send message.");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto flex max-w-screen-xl flex-col justify-between gap-10 lg:flex-row lg:gap-20">
          <div className="mx-auto flex max-w-sm flex-col justify-between gap-10">
            <div className="text-center lg:text-left">
              <h1 className="mb-2 text-5xl font-semibold lg:mb-1 lg:text-6xl">Contact Us</h1>
              <p className="text-muted-foreground">
                We are available for questions, feedback, or collaboration opportunities.
              </p>
            </div>
            <div className="mx-auto w-fit lg:mx-0">
              <h3 className="mb-6 text-center text-2xl font-semibold lg:text-left">Contact Details</h3>
              <ul className="ml-4 list-disc">
                <li>
                  <span className="font-bold">Email: </span>
                  <a href="mailto:saqlainsultan991@gmail.com" className="underline">
                    saqlainsultan991@gmail.com
                  </a>
                </li>
                <li>
                  <span className="font-bold">Email: </span>
                  <a href="mailto:saqlain@webmuza.com" className="underline">
                    saqlain@webmuza.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <form
            className="mx-auto flex max-w-screen-md flex-col gap-6 rounded-lg border p-10"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="firstname">First Name</Label>
                <Input id="firstname" {...form.register("firstname")} />
                {form.formState.errors.firstname && (
                  <p className="text-red-500 text-sm">{form.formState.errors.firstname.message}</p>
                )}
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="lastname">Last Name</Label>
                <Input id="lastname" {...form.register("lastname")} />
                {form.formState.errors.lastname && (
                  <p className="text-red-500 text-sm">{form.formState.errors.lastname.message}</p>
                )}
              </div>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" {...form.register("subject")} />
              {form.formState.errors.subject && (
                <p className="text-red-500 text-sm">{form.formState.errors.subject.message}</p>
              )}
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" {...form.register("message")} />
              {form.formState.errors.message && (
                <p className="text-red-500 text-sm">{form.formState.errors.message.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
