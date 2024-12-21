// import { IconArrowLeft } from "@tabler/icons-react";
import React from 'react';

import { useActionBoxStore } from '../../store';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useIsMobile, usePrevious } from '@/hooks';
import { ArrowLeft } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';


export interface ActionDialogProps {
  trigger: React.ReactNode;
  title: string;
  isTriggered?: boolean;
}

interface ActionDialogWrapperProps extends ActionDialogProps {
  children: React.ReactNode;
}

export const ActionDialogWrapper = ({
  trigger,
  children,
  title,
  isTriggered = false,
}: ActionDialogWrapperProps) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isActionComplete] = useActionBoxStore((state) => [
    state.isActionComplete,
  ]);
  const prevIsActionComplete = usePrevious(isActionComplete);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (!prevIsActionComplete && isActionComplete) {
      setIsDialogOpen(false);
    }
  }, [prevIsActionComplete, isActionComplete]);

  React.useEffect(() => {
    setIsDialogOpen(isTriggered);
  }, [setIsDialogOpen, isTriggered]);

  return (
    <Dialog
      open={isDialogOpen}
      modal={!isMobile}
      onOpenChange={(open: boolean) => setIsDialogOpen(open)}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        hideClose={isMobile}
        className={`${
          isMobile
            ? 'z-50 mt-20 flex justify-start border-none p-0 sm:rounded-2xl md:max-w-[520px] md:px-5 md:py-3'
            : 'border-0 p-0 sm:rounded-2xl md:flex md:max-w-[520px] md:px-5 md:py-3'
        }`}
        closeClassName={!isMobile ? 'top-2 right-2' : undefined}
      >
        <DialogTitle>
          <VisuallyHidden>{title}</VisuallyHidden>
        </DialogTitle>

        <div>
          {isMobile && (
            <div
              className="flex cursor-pointer items-center gap-2 pl-2 capitalize hover:underline"
              onClick={() => setIsDialogOpen(false)}
            >
              <ArrowLeft /> {title}
            </div>
          )}
          <div className={`${isMobile ? 'mb-8 h-screen p-4' : 'p-4'}`}>
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
