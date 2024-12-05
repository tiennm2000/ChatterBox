import { useEffect } from 'react';
import NewDM from './components/new-dm';
import ProfileInfo from './components/profile-info';
import { apiClient } from '@/lib/api-client';
import { GET_DM_CONTACTS_ROUTES } from '@/utils/constants';
import { useAppStore } from '@/store';
import ContactList from '@/components/contact-list';

const ContactContainer = () => {
  const { setDirectMessageContacts, directMessageContacts } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
        withCredentials: true,
      });
      if (response.data.contacts) {
        setDirectMessageContacts(response.data.contacts);
      }
    };

    getContacts();
  }, []);

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-pastel-sky-purple border-r-2 border-gray-900 w-full">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hide">
          <ContactList contacts={directMessageContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactContainer;

const Logo = () => {
  return (
    <div className="flex p-5 justify-start items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#333333"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />

        <line x1="8" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="12" y2="14" />
        <line x1="8" y1="6" x2="14" y2="6" />
      </svg>

      <span className="text-4xl font-bold text-gray-800">ChatterBox</span>
    </div>
  );
};

interface TitleProps {
  text: string;
}

const Title = ({ text }: TitleProps) => {
  return (
    <h6 className="uppercase tracking-wide text-neutral-500 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
