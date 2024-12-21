// import {
//   Sheet,
//   SheetContent,
//   SheetTrigger,
//   SheetClose,
//   SheetHeader,
// } from '@/components/ui/sheet';
// import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
// import { Button } from '@/components/ui/button';
// import { ChevronDown, LogOut, CircleX, Plus } from 'lucide-react';
// import Image from 'next/image';
// import { signOut, useSession } from 'next-auth/react';
// import { Card, CardHeader, CardTitle } from '@/components/ui/card';
// import { useEffect, useRef, useState } from 'react';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import { useAccountStore } from '@/app/stores/AccountStore';
// import { getAccounts } from '@/lib/actions';
// import { PopoverClose } from '@radix-ui/react-popover';
// import { Badge } from '../ui/badge';
// import TabbedInterface from './tabs';
// import { toast } from 'react-toastify';

// const UserSheet: React.FC = ({}) => {
//   const { data: session } = useSession();
//   const [isOpen, setIsOpen] = useState(false);
//   const accountStore = useAccountStore();

//   const [isLoading, setIsLoading] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkScreenSize = () => {
//       setIsMobile(window.innerWidth < 768); // 768px is the 'md' breakpoint in Tailwind by default
//     };

//     checkScreenSize();
//     window.addEventListener('resize', checkScreenSize);

//     return () => window.removeEventListener('resize', checkScreenSize);
//   }, []);

//   useEffect(() => {
//     const fetchAccounts = async () => {
//       setIsLoading(true);
//       try {
//         const accounts = await getAccounts();
//         accountStore.setAccounts(accounts);
//         if (accounts.length > 0) {
//           accountStore.setSelectedAccount(accounts[0]);
//           toast.success('Accounts loaded successfully');
//         }
//       } catch (error) {
//         console.error('Error fetching accounts:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAccounts();
//   }, []);

//   return (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Avatar className="h-10 w-10 bg-[#7e7b7d]">
//           <AvatarImage
//             src={session?.user.image || ''}
//             alt="Avatar"
//             className="h-10 w-10 rounded-full"
//           />
//           <AvatarFallback>A</AvatarFallback>
//         </Avatar>
//       </SheetTrigger>
//       <SheetContent side={isMobile ? 'left' : 'right'} className="w-full">
//         <SheetHeader className="flex items-center justify-between pt-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <Avatar className="h-10 w-10 bg-[#7e7b7d]">
//                 <AvatarImage src={session?.user.image || ''} alt="Avatar" />
//                 <AvatarFallback>A</AvatarFallback>
//               </Avatar>
//               <Popover open={isOpen} onOpenChange={setIsOpen}>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     className="bg-gray-200 text-lg font-semibold dark:bg-neutral-800"
//                   >
//                     {accountStore.selectedAccount
//                       ? `Account ${accountStore.selectedAccount.index + 1}`
//                       : 'Select your DomeFi account below.'}
//                     <ChevronDown className="ml-2 h-4 w-4" />
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-[348px] p-0">
//                   <div className="p-4">
//                     <h2 className="mb-2 text-xl font-bold">Your accounts</h2>
//                     <p className="mb-4 text-sm text-muted-foreground">
//                       Select your DomeFi account below.
//                     </p>
//                     {isLoading ? (
//                       <p>Loading...</p>
//                     ) : (
//                       accountStore.accounts.map((account, index) => (
//                         <PopoverClose asChild key={account.id}>
//                           <div
//                             className={`mb-2 flex items-center justify-between rounded-md p-2 ${
//                               account.id === accountStore.selectedAccount?.id
//                                 ? 'bg-gray-200 dark:bg-neutral-700'
//                                 : 'bg-background'
//                             }`}
//                             onClick={() =>
//                               accountStore.setSelectedAccount(account)
//                             }
//                           >
//                             <span className="text-sm font-medium">
//                               账户 {index + 1}
//                             </span>
//                             <span className="mx-2 text-xs text-muted-foreground">
//                               {account.id.slice(0, 8)}...{account.id.slice(-4)}
//                             </span>
//                             <Badge
//                               variant={
//                                 account.accountFlags === 1
//                                   ? 'destructive'
//                                   : 'secondary'
//                               }
//                             >
//                               <span className="text-xs">
//                                 {account.accountFlags === 1
//                                   ? 'Disabled'
//                                   : 'Active'}
//                               </span>
//                             </Badge>
//                           </div>
//                         </PopoverClose>
//                       ))
//                     )}
//                     <Button variant="outline" className="mt-4 w-full">
//                       <Plus className="mr-2 h-4 w-4" /> 添加账户
//                     </Button>
//                   </div>
//                 </PopoverContent>
//               </Popover>
//             </div>
//             <Button
//               variant="ghost"
//               onClick={() => signOut()}
//               className="aspect-square rounded-full p-2"
//             >
//               <LogOut className="h-5 w-5" />
//             </Button>
//             <SheetClose asChild>
//               <Button
//                 variant="ghost"
//                 className="aspect-square rounded-full p-2"
//               >
//                 <CircleX className="h-5 w-5" />
//               </Button>
//             </SheetClose>
//           </div>
//         </SheetHeader>

//         <div className="p-4">
//           <TabbedInterface />
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// };

// export default UserSheet;
