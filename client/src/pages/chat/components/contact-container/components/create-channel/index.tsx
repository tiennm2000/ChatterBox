import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FaPlus } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';
import {
  CREATE_CHANNEL_ROUTES,
  GET_ALL_CONTACTS_ROUTES,
} from '@/utils/constants';
import { Button } from '@/components/ui/button';
import MultipleSelector from '@/components/ui/multipleselect';
import { UserGroupChannel } from '@/utils/types';
import { useAppStore } from '@/store';

const CreateChannel = () => {
  const [newChannelModal, setNewChannelModal] = useState(false);
  const { addChannel } = useAppStore();

  const [allContacts, setAllContacts] = useState<UserGroupChannel[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<UserGroupChannel[]>(
    []
  );
  const [channelName, setChannelName] = useState('');

  useEffect(() => {
    const getData = async () => {
      const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES, {
        withCredentials: true,
      });
      console.log(response.data.contacts);
      setAllContacts(response.data.contacts);
    };

    getData();
  }, []);

  const createChannel = async () => {
    try {
      if (channelName.length > 0 && selectedContacts.length > 0) {
        const response = await apiClient.post(
          CREATE_CHANNEL_ROUTES,
          {
            name: channelName,
            members: selectedContacts.map((contact) => contact.value),
          },
          { withCredentials: true }
        );

        if (response.status === 201) {
          setChannelName('');
          setAllContacts([]);
          setSelectedContacts([]);
          setNewChannelModal(false);
          addChannel(response.data.channel);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              onClick={() => setNewChannelModal(true)}
              className="text-neutral-700 text-start font-light text-opacity-95 hover:text-neutral-500 cursor-pointer transition-all duration-300"
            />
          </TooltipTrigger>
          <TooltipContent className="bg-pastel-lavender border-none mb-2 p-3">
            Create new channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogContent className="bg-pastel-peach border-none w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Please fill up the details for new channel.{' '}
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Channel name"
              className="rounded-lg p-6 bg-pastel-light-pink "
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg bg-pastel-sky-purple border-none py-2 "
              defaultOptions={allContacts}
              placeholder="Search contacts"
              value={selectedContacts}
              onChange={setSelectedContacts}
              emptyIndicator={
                <p className="text-center text-lg leading-10 ">
                  No results found.
                </p>
              }
            />
          </div>
          <div>
            <Button
              className="w-full bg-pastel-salmon hover:bg-pastel-sky-purple transition-all duration-300"
              onClick={createChannel}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
