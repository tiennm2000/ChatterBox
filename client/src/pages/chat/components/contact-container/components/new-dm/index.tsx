import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FaPlus } from 'react-icons/fa';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { animationDefaultOptions } from '@/lib/utils';
import Lottie from 'react-lottie';

const NewDM = () => {
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);

  const searchContact = async (searchTerm: string) => {};

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              onClick={() => setOpenNewContactModal(true)}
              className="text-neutral-700 text-start font-light text-opacity-95 hover:text-neutral-500 cursor-pointer transition-all duration-300"
            />
          </TooltipTrigger>
          <TooltipContent className="bg-pastel-lavender border-none mb-2 p-3">
            Select new contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-pastel-peach border-none w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search contacts"
              className="rounded-lg p-6 bg-pastel-light-pink "
              onChange={(e) => searchContact(e.target.value)}
            />
          </div>
          {searchedContacts.length <= 0 && (
            <div className="flex-1 mt-5 md:bg-pastel-light-pink md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={150}
                width={150}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi<span className="text-purple-500">!</span> Search new
                  <span className="text-purple-500"> Contact.</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
