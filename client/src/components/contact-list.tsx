import { useAppStore } from '@/store';
import { Contact } from '@/utils/types';
import { Avatar, AvatarImage } from './ui/avatar';
import { HOST } from '@/utils/constants';
import { getColor } from '@/lib/utils';

interface ContactListProps {
  contacts: Contact[];
  isChannel?: boolean;
}

const ContactList = ({ contacts, isChannel = false }: ContactListProps) => {
  const {
    selectedChatData,
    selectedChatType,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact: Contact) => {
    if (isChannel) {
      setSelectedChatType('channel');
    } else {
      setSelectedChatType('contact');
    }

    setSelectedChatData(contact);

    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer 
        ${selectedChatData && selectedChatData._id === contact._id ? 'bg-pastel-light-pink hover:bg-pastel-sky-purple' : 'hover:bg-pastel-salmon'} `}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-black">
            {!isChannel && (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {contact?.image ? (
                  <AvatarImage
                    src={`${HOST}/${contact.image}`}
                    alt="profile"
                    className="object-cover h-full w-full bg-pastel-sky-purple"
                  />
                ) : (
                  <div
                    className={`uppercase h-10 w-10 text-lg border  flex items-center justify-center rounded-full ${selectedChatData?._id === contact._id ? 'bg-pastel-peach border-2 border-white' : getColor(contact?.color!)}`}
                  >
                    {contact?.firstName
                      ? contact?.firstName.split('').shift()
                      : contact?.email.split('').shift()}
                  </div>
                )}
              </Avatar>
            )}
            {isChannel && (
              <div className="bg-pastel-salmon h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
            {isChannel ? (
              <span>{contact._id}</span>
            ) : (
              <span>
                {contact.firstName} {contact.lastName}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
