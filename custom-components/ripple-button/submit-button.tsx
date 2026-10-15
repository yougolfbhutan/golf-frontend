import { Loader2 } from "lucide-react";
import { RippleWaveButton } from "@/custom-components/ripple-button/ripple-button";

export function SubmitButton({
  loading,
  children,
}: {
  loading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <RippleWaveButton
      type="submit"
      // variant="default"
      enableWave
      enableRipple
      disabled={loading}
      className="mt-1 h-[52px] w-full rounded-full text-[15px] font-bold"
    >
      {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
      {children}
    </RippleWaveButton>
  );
}