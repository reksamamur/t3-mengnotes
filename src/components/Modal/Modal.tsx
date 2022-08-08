import { Dialog, Transition } from "@headlessui/react";
import { Fragment, FC } from "react";
import clsx from "clsx";
import { ModalProps } from "./ModelProps";

export const Modal: FC<ModalProps> = ({
  open,
  title,
  message,
  ok,
  cancel,
  dismiss,
  btnOkMessage,
  btnCancelMessage,
}: ModalProps) => {

  const setDismiss = () => {
    if (dismiss === true) {
      return cancel && cancel(false);
    } else {
      return cancel && cancel(true);
    }
  };

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className={clsx(
            "fixed flex w-full h-screen inset-0 overflow-y-auto items-center justify-center z-10",
            {
              "backdrop-filter backdrop-blur-lg bg-opacity-30 firefox:bg-opacity-90 bg-white":
                open === true,
            }
          )}
          onClose={() => setDismiss()}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="transition-all space-y-12">
              <div className="space-y-10">
                <Dialog.Title
                  as="h3"
                  className="text-5xl font-medium text-zinc-900"
                >
                  {title}
                </Dialog.Title>

                <div>
                  <p className="text-base text-zinc-900">{message}</p>
                </div>
              </div>

              <div className="space-x-4">
                <button
                  onClick={() => cancel && cancel(false)}
                  className="cursor-pointer py-4 px-8 border border-zinc-900 outline-none text-zinc-900 hover:bg-zinc-300 text-lg rounded-sm"
                >
                  {btnCancelMessage}
                </button>
                <button
                  type="button"
                  className="cursor-pointer py-4 px-8 border border-zinc-900 bg-zinc-900 outline-none text-white hover:bg-zinc-500 text-lg rounded-sm"
                  onClick={() => ok && ok()}
                >
                  {btnOkMessage}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

Modal.displayName = "Modal";

export default Modal;
