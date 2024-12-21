'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';


const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

type DialogOverlayProps = {
  isBgGlass?: boolean;
};

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> &
    DialogOverlayProps
>(({ className, isBgGlass = false, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 h-screen data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      isBgGlass ? 'backdrop-blur-sm' : 'bg-background/80',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

type DialogContentProps = {
  hideClose?: boolean;
  closeClassName?: string;
  position?: 'top' | 'bottom' | 'center';
  size?: 'xl' | 'lg' | 'md' | 'sm';
  hidePadding?: boolean;
  isBgGlass?: boolean;
};

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
    DialogContentProps
>(
  (
    {
      className,
      hideClose = false,
      hidePadding = false,
      position = 'center',
      size = 'xl',
      closeClassName,
      children,
      isBgGlass,
      ...props
    },
    ref,
  ) => (
    <DialogPortal>
      <DialogOverlay isBgGlass={isBgGlass} />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed left-0 z-50 flex h-full w-full flex-col justify-center gap-4 overflow-auto border border-border/50 bg-background shadow-lg outline-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg md:left-[50%] md:h-auto md:max-h-screen md:w-full md:translate-x-[-50%] md:translate-y-[-50%]',
          position === 'center' &&
            'top-0 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%] md:top-[50%]',
          position === 'top' &&
            'top-0 data-[state=closed]:slide-out-to-top-[380px] data-[state=open]:slide-in-from-top-[380px] md:top-[380px]',
          !hidePadding && 'p-8 md:p-12',
          size === 'sm' && `md:max-w-[400px]`,
          size === 'md' && `md:max-w-md`,
          size === 'xl' && `md:max-w-xl`,
          size === 'lg' && `md:max-w-lg`,
          isBgGlass && 'bg-background/95',
          className,
        )}
        onOpenAutoFocus={(e) => e.preventDefault()}
        {...props}
      >
        {children}
        {!hideClose && (
          <DialogPrimitive.Close
            className={cn(
              'absolute right-4 top-4 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
              closeClassName,
            )}
          >
            <X size={20} />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  ),
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'mb-4 flex flex-col items-center space-y-2 text-center',
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-3xl font-medium leading-none tracking-tight',
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-muted-foreground', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
