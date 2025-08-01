"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { editPortfolio } from "@/api/portfoliosApi";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EditPortfolio({ portfolio }) {
  const [updatedPortfolio, setUpdatedPortfolio] = useState(portfolio);
  const [updatedFile, setUpdatedFile] = useState("");

  const handleChange = (e) => {
    setUpdatedPortfolio({
      ...updatedPortfolio,
      [e.target.name]: e.target.value,
    });
  };

  const handleFile = (e) => setUpdatedFile(e.target.files[0]);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await editPortfolio(updatedPortfolio, updatedFile);

    if (data) {
      toast.success(data.msg);
      router.refresh();
    }
  };

  return (
    <div>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="bg-white text-black fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray1 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
          <form
            method="PUT"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
              Edit Portfolio
            </Dialog.Title>
            <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-mauve11">
              Edit your portfolio here. Click save when you're done.
            </Dialog.Description>
            <fieldset className="mb-[15px] flex items-center gap-5">
              <label
                className="w-[90px] text-right text-[15px] text-violet11"
                htmlFor="title"
              >
                Title
              </label>
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-700"
                id="title"
                type="text"
                name="title"
                value={updatedPortfolio.title}
                onChange={handleChange}
              />
            </fieldset>
            <fieldset className="mb-[15px] flex items-center gap-5">
              <label
                className="w-[90px] text-right text-[15px] text-violet11"
                htmlFor="description"
              >
                Description
              </label>
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-700"
                type="text"
                name="description"
                value={updatedPortfolio.description}
                onChange={handleChange}
              />
            </fieldset>
            <fieldset className="mb-[15px] flex items-center gap-5">
              <label
                className="w-[90px] text-right text-[15px] text-violet11"
                htmlFor="uploaded_file"
              >
                File
              </label>
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-700"
                id="updatedFile"
                type="file"
                name="updatedFile"
                onChange={handleFile}
              />
            </fieldset>
            <div className="mt-[25px] flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                type="submit"
              >
                Save
              </button>
            </div>
            <Dialog.Close asChild>
              <button
                className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 bg-gray3 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </div>
  );
}
