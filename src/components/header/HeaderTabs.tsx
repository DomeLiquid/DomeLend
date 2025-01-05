import { useRouter } from '@/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { env } from '@/env.mjs';

export default function HeaderTabs() {
  const router = useRouter();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="flex items-center gap-2">
            Lend
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-[120px]">
          <DropdownMenuRadioGroup>
            <DropdownMenuRadioItem
              value="lend"
              onClick={() => router.push('/lend')}
            >
              Lend
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value="loop"
              onClick={() => (window.location.href = env.NEXT_PUBLIC_LOOP_URL)}
            >
              Loop
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
