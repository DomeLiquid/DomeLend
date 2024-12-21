import DesktopFooter from './destop-footer';
import MobileFooter from './mobile-footer';

const Footer = ({ user }: { user: any | null }) => {
  return (
    <div>
      <DesktopFooter className="hidden md:block" user={user} />
      <MobileFooter className={'md:hidden'} user={user} />
    </div>
  );
};

export default Footer;
