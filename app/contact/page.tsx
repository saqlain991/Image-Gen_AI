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
    <section className="page-shell">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="flex flex-col gap-10">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Get in touch</p>
              <h1 className="mb-4 text-4xl font-semibold tracking-tight sm:text-5xl">Let’s talk.</h1>
              <p className="text-muted-foreground">
                We are available for questions, feedback, or collaboration opportunities.
              </p>
            </div>
            <div>
              <h2 className="mb-3 text-lg font-semibold">Contact details</h2>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
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
            className="surface-card flex flex-col gap-6 p-5 shadow-sm sm:p-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="firstname">First Name</Label>
                <Input id="firstname" {...form.register("firstname")} />
                {form.formState.errors.firstname && (
                  <p className="text-sm text-destructive">{form.formState.errors.firstname.message}</p>
                )}
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="lastname">Last Name</Label>
                <Input id="lastname" {...form.register("lastname")} />
                {form.formState.errors.lastname && (
                  <p className="text-sm text-destructive">{form.formState.errors.lastname.message}</p>
                )}
              </div>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" {...form.register("subject")} />
              {form.formState.errors.subject && (
                <p className="text-sm text-destructive">{form.formState.errors.subject.message}</p>
              )}
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" {...form.register("message")} />
              {form.formState.errors.message && (
                <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
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
