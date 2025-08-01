"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Box, Flex } from "@radix-ui/themes";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Checkout from "@/components/Checkout";

export default function UpgradeToPro() {
  const initialOptions = {
    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };
  return (
    <div className="mt-2">
      <Dialog.Root>
        <Box>
          <Dialog.Trigger asChild>
            <Flex align="center" justify="center">
              <button className="relative w-40 inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                <span className="relative w-40 px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                  Upgrade to Pro
                </span>
              </button>
            </Flex>
          </Dialog.Trigger>
        </Box>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
          <Dialog.Content className="bg-white text-black fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray1 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
            <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
              Subscribe to Pro
            </Dialog.Title>
            <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-mauve11">
              Subscribe for only $99 per month.
            </Dialog.Description>

            <div className="max-w-sm w-full lg:max-w-full lg:flex">
              <div className="border h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden">
                <Box className="h-full bg-gradient-to-r from-teal-400 to-yellow-200"></Box>
              </div>
              <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                <div className="mb-8">
                  <div className="text-gray-900 font-bold text-xl mb-2">
                    Subscribe to Pro
                  </div>
                  <p className="text-gray-700 text-base">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Voluptatibus quia, nulla! Maiores et perferendis eaque,
                    exercitationem praesentium nihil.
                  </p>
                </div>
                <div className="flex items-center">
                  <div>
                    <PayPalScriptProvider options={initialOptions}>
                      <Checkout />
                    </PayPalScriptProvider>
                  </div>
                </div>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 bg-gray3 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
