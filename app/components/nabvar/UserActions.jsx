import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, MessageSquare } from 'lucide-react';
import { getCleanImageUrl, getUserInitial } from './utils';

export default function UserActions({ userProfile, isScrolled }) {
  if (!userProfile) {
    return (
      <Link href="/auth/login" className="px-5 py-2.5 text-[13px] font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-all hover:shadow-lg hover:shadow-blue-500/25 active:scale-95">
        Login
      </Link>
    );
  }

  const displayImageUrl = getCleanImageUrl(userProfile.profile_image_url);

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <NavIconButton icon={MessageSquare} href="/chat" />
      <NavIconButton icon={Heart} href="/favorites" />
      <NavIconButton icon={ShoppingBag} href="/cart" count={3} />
      
      <Link href="/profile" className="ml-1 group">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden group-hover:border-blue-500 transition-all">
          {displayImageUrl ? (
            <Image src={displayImageUrl} alt="User" width={40} height={40} className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-black text-blue-600 text-sm bg-blue-50">
              {getUserInitial(userProfile.name)}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

function NavIconButton({ icon: Icon, href, count }) {
  return (
    <Link href={href} className="relative p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
      <Icon className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
          {count}
        </span>
      )}
    </Link>
  );
}